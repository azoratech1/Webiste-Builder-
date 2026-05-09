const Media = require('../models/Media');

const fs = require('fs');

const getNextId =
  require('../utils/getNextId');

// GET ALL MEDIA
exports.getAllMedia = async (req, res) => {

  try {

    const rows = await Media.find({

      website_id:
        req.website_id

    }).sort({

      created_at: -1
    });

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

// UPLOAD MEDIA
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

    // WEBSITE-WISE NEXT ID
    const nextId =
      await getNextId(
        Media,
        req.website_id
      );

    const media =
      await Media.create({

        id: nextId,

        website_id:
          req.website_id,

        filename,

        original_name:
          originalname,

        path,

        mime_type:
          mimetype,

        size
      });

  const fileUrl =

`${req.protocol}://${req.get('host')}/uploads/${filename}`;

    res.json({

      success: true,

      data: {

        id: media.id,

        url: fileUrl,

        filename,

        original_name:
          originalname,

        size,

        mime_type:
          mimetype
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

// DELETE MEDIA
exports.deleteMedia = async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    const media =
      await Media.findOne({

        id,

        website_id:
          req.website_id
      });

    if (media) {

      // DELETE FILE
      if (
        media.path &&
        fs.existsSync(media.path)
      ) {

        fs.unlinkSync(
          media.path
        );
      }

      // DELETE DB RECORD
      await Media.deleteOne({

        id,

        website_id:
          req.website_id
      });
    }

    res.json({

      success: true,

      message:
        'Media deleted successfully'
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};