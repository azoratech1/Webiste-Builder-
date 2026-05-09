const Page = require('../models/Page');
const Section = require('../models/Section');

const getNextId = require('../utils/getNextId');

// GET ALL PAGES
exports.getAllPages = async (req, res) => {

  try {

    const pages = await Page.find({
  website_id: req.website_id
}).sort({
      created_at: -1
    });

    res.json({
      success: true,
      data: pages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET PAGE BY ID
exports.getPage = async (req, res) => {

  try {

    const id = Number(req.params.id);

    const page = await Page.findOne({
  id,
  website_id: req.website_id
})

    if (!page) {

      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    const sections = await Section.find({
      page_id: id
    }).sort({
      order_position: 1
    });

    res.json({
      success: true,
      data: {
        ...page.toObject(),
        sections
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// CREATE PAGE
exports.createPage = async (req, res) => {

  try {

    const nextId = await getNextId(Page);

    const page = await Page.create({
  id: nextId,
  website_id: req.website_id,
  ...req.body
})

    res.json({
      success: true,
      data: {
        id: page.id
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE PAGE
exports.updatePage = async (req, res) => {

  try {

    const id = Number(req.params.id);

    await Page.updateOne(
      { id },
      req.body
    );

    res.json({
      success: true,
      data: {
        affected: 1
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// DELETE PAGE
exports.deletePage = async (req, res) => {

  try {

    const id = Number(req.params.id);

    // Delete related sections
    await Section.deleteMany({
      page_id: id
    });

    // Delete page
    await Page.deleteOne({
      id
    });

    res.json({
      success: true,
      data: {
        affected: 1
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET PAGE BY SLUG
exports.getPageBySlug = async (req, res) => {

  try {

    const page = await Page.findOne({
      slug: req.params.slug
    });

    if (!page) {

      return res.status(404).json({
        success: false,
        error: 'Page not found'
      });
    }

    const sections = await Section.find({
      page_id: page.id,
      is_active: true
    }).sort({
      order_position: 1
    });

    res.json({
      success: true,
      data: {
        ...page.toObject(),
        sections
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET NAVIGATION PAGES
exports.getNavigationPages = async (req, res) => {

  try {

    const pages = await Page.find({
      is_active: true,
      show_in_nav: true
    })
    .select('id name slug')
    .sort({
      order_position: 1
    });

    res.json({
      success: true,
      data: pages
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};