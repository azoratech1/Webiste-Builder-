const Website = require('../models/Website');

const getNextId =
  require('../utils/getNextId');
const Page =
require('../models/Page');

const Section =
require('../models/Section');

const 

const defaultPages =
require('../seed/defaultPages');
// CREATE WEBSITE
exports.createWebsite =
async (req, res) => {

  try {

    const Website =
      require('../models/Website');

    const nextId =
      await getNextId(Website);

    // CREATE WEBSITE
    const website =
      await Website.create({

        id: nextId,

        name: req.body.name,

        slug: req.body.slug
      });

    // CREATE DEFAULT PAGES
    for (const pageData
      of defaultPages) {

      const pageId =
        await getNextId(Page);

      const page =
        await Page.create({

          id: pageId,

          website_id:
            website.id,

          name:
            pageData.name,

          slug:
            pageData.slug,

          is_active: true,

          show_in_nav: true
        });

      // CREATE DEFAULT SECTIONS
      for (
        let i = 0;
        i <
        pageData.sections.length;
        i++
      ) {

        const section =
          pageData.sections[i];

        const sectionId =
          await getNextId(
            Section
          );

        await Section.create({

          id: sectionId,

          website_id:
            website.id,

          page_id:
            page.id,

          section_type:
            section.section_type,

          title:
            section.title,

          content:
            section.content,

          order_position:
            i,

          is_active: true
        });
      }
    }

    res.json({

      success: true,

      data: website
    });

  } catch (error) {

    res.status(500).json({

      success: false,

      error:
        error.message
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