const Media = require('../models/Media');
const fs = require('fs');

exports.getAllMedia = async (req, res) => {
  try {
    const rows = await Media.find().sort({ created_at: -1 });

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.uploadMedia = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const {
      filename,
      originalname,
      path,
      mimetype,
      size
    } = req.file;

    const media = await Media.create({
      filename,
      original_name: originalname,
      path,
      mime_type: mimetype,
      size
    });

    const fileUrl = `http://localhost:5000/uploads/${filename}`;

    res.json({
      success: true,
      data: {
        id: media.id,
        url: fileUrl,
        filename,
        original_name: originalname,
        size,
        mime_type: mimetype
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.deleteMedia = async (req, res) => {
  try {

    const media = await Media.findById(req.params.id);

    if (media) {

      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }

      await Media.findByIdAndDelete(req.params.id);
    }

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};