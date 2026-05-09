const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/db');

// Configure multer for memory storage (store in buffer)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp, svg)'));
  }
};

// Set limits to 5MB
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload image to database as BLOB
router.post('/upload', (req, res, next) => {
  // Handle multer errors
  upload.single('image')(req, res, (err) => {
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
    const filename = Date.now() + '-' + originalname;
    
    // Validate file size again
    if (size > 5 * 1024 * 1024) {
      return res.status(413).json({ 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      });
    }
    
    // Store image as BLOB in database
    const [result] = await db.query(
      'INSERT INTO media (filename, original_name, image_data, mime_type, size) VALUES (?, ?, ?, ?, ?)',
      [filename, originalname, buffer, mimetype, size]
    );
    
    // Generate data URL for immediate display
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimetype};base64,${base64}`;
    
    res.json({
      success: true,
      data: {
        id: result.insertId,
        filename: filename,
        original_name: originalname,
        url: dataUrl,
        size: size,
        mime_type: mimetype
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all media with data URLs
router.get('/', async (req, res) => {
  try {
    const [media] = await db.query('SELECT id, filename, original_name, mime_type, size, created_at FROM media ORDER BY created_at DESC');
    
    // Convert to data URLs
    const mediaWithUrls = await Promise.all(media.map(async (item) => {
      const [imageData] = await db.query('SELECT image_data FROM media WHERE id = ?', [item.id]);
      const base64 = imageData[0].image_data.toString('base64');
      const dataUrl = `data:${item.mime_type};base64,${base64}`;
      
      return {
        ...item,
        url: dataUrl
      };
    }));
    
    res.json({ success: true, data: mediaWithUrls });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single image by ID
router.get('/:id', async (req, res) => {
  try {
    const [media] = await db.query('SELECT * FROM media WHERE id = ?', [req.params.id]);
    
    if (media.length === 0) {
      return res.status(404).json({ success: false, error: 'Image not found' });
    }
    
    const item = media[0];
    const base64 = item.image_data.toString('base64');
    const dataUrl = `data:${item.mime_type};base64,${base64}`;
    
    res.json({
      success: true,
      data: {
        id: item.id,
        filename: item.filename,
        original_name: item.original_name,
        url: dataUrl,
        mime_type: item.mime_type,
        size: item.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete media
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Media deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;