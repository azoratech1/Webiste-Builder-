const Website = require('../models/Website');

const getNextId =
  require('../utils/getNextId');
const Page =
require('../models/Page');

const Section =
require('../models/Section');

const seedWebsite = require('../utils/seedWebsite')

const defaultPages =
require('../seed/defaultPages');
// CREATE WEBSITE
// CREATE WEBSITE
exports.createWebsite =
async (req, res) => {

  try {

    const nextId =
      await getNextId(
        Website
      );

    const website =
      await Website.create({

        id: nextId,

        name:
          req.body.name,

        slug:
          req.body.slug
            .toLowerCase()
            .trim()
      });

    // AUTO CREATE
    // DEFAULT DATA

 await seedWebsite(

  website.id,

  website.name
);
    res.json({

      success: true,

      data: website
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error: error.message
    });
  }
};

// GET WEBSITE BY SLUG
exports.getWebsite = async (req, res) => {

  try {

    const website =
      await Website.findOne({
        slug: req.params.slug.toLowerCase()
      });

    if (!website) {

      return res.status(404).json({
        success: false,
        error: 'Website not found'
      });
    }

    res.json({
      success: true,
      data: website
    });

  } catch (error) {

    console.error(
      'Get Website Error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET ALL WEBSITES
exports.getAllWebsites = async (req, res) => {

  try {

    const websites =
      await Website.find()
      .sort({
        created_at: -1
      });

    res.json({
      success: true,
      data: websites
    });

  } catch (error) {

    console.error(
      'Get Websites Error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE WEBSITE
exports.deleteWebsite = async (req, res) => {

  try {

    const id = Number(req.params.id);

    await Website.deleteOne({
      id
    });

    res.json({

      success: true,

      message:
        'Website deleted successfully'
    });

  } catch (error) {

    console.error(
      'Delete Website Error:',
      error
    );

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};