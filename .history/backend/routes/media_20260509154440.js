const express =
require('express');

const router =
express.Router();

const multer =
require('multer');

const mediaController =
require(
  '../controllers/mediaController'
);

// MULTER CONFIG
const storage =
multer.diskStorage({

  destination:
  function (
    req,
    file,
    cb
  ) {

    cb(
      null,
      'uploads/'
    );
  },

  filename:
  function (
    req,
    file,
    cb
  ) {

    const uniqueName =

      Date.now() +

      '-' +

      file.originalname.replace(
        /\s+/g,
        '-'
      );

    cb(
      null,
      uniqueName
    );
  }
});

// FILE FILTER
const fileFilter =
(
  req,
  file,
  cb
) => {

  const allowedTypes =

    /jpeg|jpg|png|gif|webp|svg/;

  const extname =
    allowedTypes.test(

      file.originalname
      .toLowerCase()
    );

  const mimetype =
    allowedTypes.test(
      file.mimetype
    );

  if (
    mimetype &&
    extname
  ) {

    cb(
      null,
      true
    );

  } else {

    cb(
      new Error(
        'Only image files are allowed'
      )
    );
  }
};

const upload =
multer({

  storage,

  fileFilter,

  limits: {

    fileSize:
      5 * 1024 * 1024
  }
});

// =====================
// UPLOAD MEDIA
// =====================

router.post(

  '/upload',

  // IMPORTANT:
  // MUST MATCH:
  // formData.append('file', file)

  upload.single('file'),

  mediaController.uploadMedia
);

// =====================
// GET ALL MEDIA
// =====================

router.get(
  '/',
  mediaController.getAllMedia
);

// =====================
// DELETE MEDIA
// =====================

router.delete(
  '/:id',
  mediaController.deleteMedia
);

module.exports =
router;