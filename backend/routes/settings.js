const express = require('express');

const router = express.Router();

const multer = require('multer');

const settingsController = require('../controllers/settingsController');

// Multer config
const storage = multer.diskStorage({

  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },

  filename: function (req, file, cb) {

    const uniqueName =
      'logo-' +
      Date.now() +
      '-' +
      file.originalname.replace(/\s+/g, '-');

    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Get settings
router.get(
  '/company',
  settingsController.getCompanySettings
);

// Update settings
router.put(
  '/company',
  settingsController.updateCompanySettings
);

// Upload logo
router.post(
  '/upload-logo',
  upload.single('logo'),
  settingsController.uploadLogo
);

module.exports = router;