const Section =
require('../models/Section');

const getNextId =
require('../utils/getNextId');

// GET SECTIONS BY PAGE
exports.getSectionsByPage =
async (req, res) => {

  try {

    const pageId =
      Number(req.params.pageId);

    const sections =
      await Section.find({

        website_id:
          req.website_id,

        page_id:
          pageId

      }).sort({
        order_position: 1
      });

    res.json({
      success: true,
      data: sections
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// CREATE SECTION
exports.createSection =
async (req, res) => {

  try {

    const nextId =
      await getNextId(
        Section,
        req.website_id
      );

    const section =
      await Section.create({

        id: nextId,

        website_id:
          req.website_id,

        page_id:
          Number(req.body.page_id),

        section_type:
          req.body.section_type,

        title:
          req.body.title,

        content:
          req.body.content || {},

        order_position:
          req.body.order_position || 0,

        is_active:
          req.body.is_active ?? true
      });

    res.json({
      success: true,
      data: {
        id: section.id
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE SECTION
exports.updateSection =
async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    await Section.updateOne(
      {
        id,
        website_id:
          req.website_id
      },
      {
        ...req.body,

        page_id:
          Number(req.body.page_id)
      }
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

// DELETE SECTION
exports.deleteSection =
async (req, res) => {

  try {

    const id =
      Number(req.params.id);

    await Section.deleteOne({
      id,
      website_id:
        req.website_id
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

// REORDER SECTIONS
exports.reorderSections =
async (req, res) => {

  try {

    const { sections } =
      req.body;

    for (const section of sections) {

      await Section.updateOne(
        {
          id:
            Number(section.id),

          website_id:
            req.website_id
        },
        {
          order_position:
            section.order
        }
      );
    }

    res.json({
      success: true,
      message:
        'Sections reordered successfully'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};