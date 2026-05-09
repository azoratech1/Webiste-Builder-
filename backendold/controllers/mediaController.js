const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.getAllMedia = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM media ORDER BY created_at DESC');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadMedia = async (req, res) => {
  console.log('📸 Upload request received:', req.file);
  console.log('📸 Request body:', req.body);
  
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
    
    console.log('✅ File received:', { filename, originalname, size });
    
    // Insert into database
    const [result] = await db.query(
      'INSERT INTO media (filename, original_name, path, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, filePath, mimetype, size]
    );
    
    const fileUrl = `http://localhost:5000/uploads/${filename}`;
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        url: fileUrl,
        filename,
        original_name: originalname,
        size,
        mime_type: mimetype
      }
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

exports.deleteMedia = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [rows] = await db.query('SELECT * FROM media WHERE id = ?', [id]);
    const media = rows[0];
    
    if (media) {
      // Delete file from filesystem
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
      // Delete from database
      await db.query('DELETE FROM media WHERE id = ?', [id]);
    }
    
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};