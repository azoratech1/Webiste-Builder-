const db = require('../config/db');
const fs = require('fs');
const path = require('path');

// Get company settings
exports.getCompanySettings = async (req, res) => {
  try {
    console.log('Fetching company settings...');
    
    // Ensure settings table exists
    await ensureSettingsTable();
    
    const [rows] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    
    // If no settings found, create default
    if (rows.length === 0) {
      console.log('No settings found, creating default...');
      const defaultSettings = getDefaultSettings();
      const settingsJson = JSON.stringify(defaultSettings);
      
      await db.query(
        'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
        ['company', settingsJson]
      );
      
      return res.status(200).json({ 
        success: true, 
        data: defaultSettings 
      });
    }
    
    // Parse the settings value safely
    let settings;
    try {
      // Check if setting_value is already an object or string
      if (typeof rows[0].setting_value === 'string') {
        settings = JSON.parse(rows[0].setting_value);
      } else if (typeof rows[0].setting_value === 'object') {
        settings = rows[0].setting_value;
      } else {
        throw new Error('Invalid data type in database');
      }
      
      console.log('Settings parsed successfully:', settings);
      
      return res.status(200).json({ 
        success: true, 
        data: settings 
      });
    } catch (parseError) {
      console.error('Error parsing settings:', parseError);
      console.log('Raw data from DB:', rows[0].setting_value);
      
      // If parsing fails, reset to default
      const defaultSettings = getDefaultSettings();
      const settingsJson = JSON.stringify(defaultSettings);
      
      await db.query(
        'UPDATE settings SET setting_value = ? WHERE setting_key = ?',
        [settingsJson, 'company']
      );
      
      return res.status(200).json({ 
        success: true, 
        data: defaultSettings,
        message: 'Settings were corrupted and have been reset'
      });
    }
    
  } catch (error) {
    console.error('Error in getCompanySettings:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update company settings
exports.updateCompanySettings = async (req, res) => {
  try {
    console.log('Updating company settings...');
    const settings = req.body;
    
    // Validate settings object
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid settings data' 
      });
    }
    
    const settingsJson = JSON.stringify(settings);
    
    const [existing] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    
    if (existing.length > 0) {
      await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [settingsJson, 'company']);
    } else {
      await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', ['company', settingsJson]);
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Settings updated successfully' 
    });
  } catch (error) {
    console.error('Error in updateCompanySettings:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Upload logo
exports.uploadLogo = async (req, res) => {
  console.log('📸 Logo upload request received');
  console.log('Request file:', req.file);
  
  try {
    // Check if file exists
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded. Please select an image file.' 
      });
    }
    
    const { filename, originalname, path: filePath, mimetype, size } = req.file;
    
    console.log('✅ File saved:', { filename, originalname, size });
    
    // Save to media table
    const [result] = await db.query(
      'INSERT INTO media (filename, original_name, path, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, filePath, mimetype, size]
    );
    
    const logoUrl = `http://localhost:5000/uploads/${filename}`;
    
    // Get current settings
    const [settings] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    
    let companySettings = getDefaultSettings();
    
    if (settings.length > 0) {
      try {
        if (typeof settings[0].setting_value === 'string') {
          companySettings = JSON.parse(settings[0].setting_value);
        } else if (typeof settings[0].setting_value === 'object') {
          companySettings = settings[0].setting_value;
        }
      } catch (e) {
        console.log('Using default settings due to parse error');
      }
    }
    
    // Update logo
    companySettings.logo = logoUrl;
    
    // Save back to database
    await db.query('DELETE FROM settings WHERE setting_key = ?', ['company']);
    await db.query(
      'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)',
      ['company', JSON.stringify(companySettings)]
    );
    
    // Return proper JSON response
    return res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: {
        id: result.insertId,
        url: logoUrl,
        filename: filename,
        original_name: originalname,
        size: size,
        mime_type: mimetype
      }
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Helper functions
async function ensureSettingsTable() {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'settings'");
    if (tables.length === 0) {
      console.log('Creating settings table...');
      await db.query(`
        CREATE TABLE settings (
          id INT PRIMARY KEY AUTO_INCREMENT,
          setting_key VARCHAR(100) UNIQUE NOT NULL,
          setting_value JSON,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Settings table created successfully');
    }
  } catch (error) {
    console.error('Error creating settings table:', error);
    throw error;
  }
}

function getDefaultSettings() {
  return {
    name: 'ABC Technologies',
    logo: null,
    tagline: 'Your Success Partner',
    email: 'info@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Street, Tech City',
    website: 'www.example.com',
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  };
}