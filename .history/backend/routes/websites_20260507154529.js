const express = require('express');

const router = express.Router();

const websiteController =
  require('../controllers/websiteController');

// CREATE WEBSITE
router.post(
  '/',
  websiteController.createWebsite
);

// GET ALL WEBSITES
router.get(
  '/',
  websiteController.getAllWebsites
);

// GET WEBSITE BY SLUG
router.get(
  '/:slug',
  websiteController.getWebsite
);

// DELETE WEBSITE
router.delete(
  '/:id',
  websiteController.deleteWebsite
);

module.exports = router;