const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db');

const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Get company settings
router.get('/company', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    
    let companyData;
    if (settings.length === 0) {
      companyData = {
        name: 'My Company',
        logo: null,
        tagline: 'Your Success Partner',
        email: 'info@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street',
        socialMedia: {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: ''
        }
      };
    } else {
      companyData = typeof settings[0].setting_value === 'string' 
        ? JSON.parse(settings[0].setting_value) 
        : settings[0].setting_value;
    }
    
    // If logo exists in media table, fetch it
    if (companyData.logo && companyData.logo.id) {
      const [logoData] = await db.query('SELECT image_data, mime_type FROM media WHERE id = ?', [companyData.logo.id]);
      if (logoData.length > 0) {
        const base64 = logoData[0].image_data.toString('base64');
        companyData.logo = {
          id: companyData.logo.id,
          url: `data:${logoData[0].mime_type};base64,${base64}`
        };
      }
    }
    
    res.json({ success: true, data: companyData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update company settings
router.put('/company', async (req, res) => {
  try {
    const settingsJson = JSON.stringify(req.body);
    
    const [existing] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    
    if (existing.length > 0) {
      await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [settingsJson, 'company']);
    } else {
      await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', ['company', settingsJson]);
    }
    
    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload company logo
router.post('/upload-logo', (req, res, next) => {
  upload.single('logo')(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ 
            success: false, 
            error: 'File too large. Maximum size is 5MB.' 
          });
        }
        return res.status(400).json({ success: false, error: err.message });
      }
      return res.status(400).json({ success: false, error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    
    const { originalname, buffer, mimetype, size } = req.file;
    const filename = 'logo-' + Date.now() + '-' + originalname;
    
    // Validate file size
    if (size > 5 * 1024 * 1024) {
      return res.status(413).json({ 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
    
    // Store logo in media table
    const [result] = await db.query(
      'INSERT INTO media (filename, original_name, image_data, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, buffer, mimetype, size]
    );
    
    // Update company settings with logo reference
    const [settings] = await db.query('SELECT * FROM settings WHERE setting_key = ?', ['company']);
    let companyData;
    
    if (settings.length === 0) {
      companyData = {
        name: 'My Company',
        tagline: 'Your Success Partner',
        email: 'info@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street',
        socialMedia: {}
      };
    } else {
      companyData = typeof settings[0].setting_value === 'string' 
        ? JSON.parse(settings[0].setting_value) 
        : settings[0].setting_value;
    }
    
    companyData.logo = { id: result.insertId };
    
    const settingsJson = JSON.stringify(companyData);
    
    if (settings.length > 0) {
      await db.query('UPDATE settings SET setting_value = ? WHERE setting_key = ?', [settingsJson, 'company']);
    } else {
      await db.query('INSERT INTO settings (setting_key, setting_value) VALUES (?, ?)', ['company', settingsJson]);
    }
    
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimetype};base64,${base64}`;
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        url: dataUrl,
        filename: filename
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;