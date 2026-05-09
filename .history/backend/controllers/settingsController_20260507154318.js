const Setting = require('../models/Setting');
const Media = require('../models/Media');

const getNextId = require('../utils/getNextId');

// GET COMPANY SETTINGS
exports.getCompanySettings = async (req, res) => {

  try {

    let settings = await Setting.findOne({
      website_id: req.website_id,
      setting_key: 'company'
    });

    // Create default settings if not exists
    if (!settings) {

      const nextId = await getNextId(Setting);

      settings = await Setting.create({
        id: nextId,
        website_id: req.website_id,
        setting_key: 'company',
        setting_value: getDefaultSettings()
      });
    }

    res.status(200).json({
      success: true,
      data: settings.setting_value
    });

  } catch (error) {

    console.error(
      'Error in getCompanySettings:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE COMPANY SETTINGS
exports.updateCompanySettings =
async (req, res) => {

  try {

    const settings = req.body;

    if (
      !settings ||
      typeof settings !== 'object'
    ) {

      return res.status(400).json({
        success: false,
        error: 'Invalid settings data'
      });
    }

    const existing =
      await Setting.findOne({

        website_id: req.website_id,
        setting_key: 'company'
      });

    if (existing) {

      existing.setting_value = settings;

      await existing.save();

    } else {

      const nextId =
        await getNextId(Setting);

      await Setting.create({

        id: nextId,

        website_id: req.website_id,

        setting_key: 'company',

        setting_value: settings
      });
    }

    res.status(200).json({
      success: true,
      message:
        'Settings updated successfully'
    });

  } catch (error) {

    console.error(
      'Error in updateCompanySettings:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPLOAD LOGO
exports.uploadLogo = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        error:
          'No file uploaded. Please select an image file.'
      });
    }

    const {
      filename,
      originalname,
      path,
      mimetype,
      size
    } = req.file;

    const nextMediaId =
      await getNextId(Media);

    // Save media
    const media = await Media.create({

      id: nextMediaId,

      website_id: req.website_id,

      filename,

      original_name: originalname,

      path,

      mime_type: mimetype,

      size
    });

    const logoUrl =
      `http://localhost:5000/uploads/${filename}`;

    // Get company settings
    let settings =
      await Setting.findOne({

        website_id: req.website_id,

        setting_key: 'company'
      });

    if (!settings) {

      const nextSettingId =
        await getNextId(Setting);

      settings =
        await Setting.create({

          id: nextSettingId,

          website_id: req.website_id,

          setting_key: 'company',

          setting_value:
            getDefaultSettings()
        });
    }

    // Update logo
    settings.setting_value.logo =
      logoUrl;

    await settings.save();

    res.status(200).json({

      success: true,

      message:
        'Logo uploaded successfully',

      data: {

        id: media.id,

        url: logoUrl,

        filename,

        original_name: originalname,

        size,

        mime_type: mimetype
      }
    });

  } catch (error) {

    console.error(
      'Upload error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// DEFAULT SETTINGS
function getDefaultSettings() {

  return {

    name: 'ABC Technologies',

    logo: null,

    tagline: 'Your Success Partner',

    email: 'info@example.com',

    phone: '+1 (555) 123-4567',

    address:
      '123 Business Street, Tech City',

    website: 'www.example.com',

    socialMedia: {

      facebook: '',

      twitter: '',

      linkedin: '',

      instagram: ''
    }
  };
}