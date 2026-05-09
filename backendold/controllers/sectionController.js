const Section = require('../models/Section');

exports.getSectionsByPage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const sections = await Section.getByPageId(pageId);
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createSection = async (req, res) => {
  try {
    const { page_id, section_type, title, content, order_position, is_active } = req.body;
    
    if (!page_id || !section_type) {
      return res.status(400).json({ 
        success: false, 
        error: 'page_id and section_type are required' 
      });
    }
    
    const sectionId = await Section.create(req.body);
    res.json({ success: true, data: { id: sectionId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if this is a temporary ID (from frontend)
    if (isNaN(id) || id.toString().length > 10) {
      // This is a temporary ID, create new section instead
      console.log('Temporary ID detected, creating new section:', id);
      const newId = await Section.create(req.body);
      return res.json({ success: true, data: { id: newId, created: true } });
    }
    
    const affected = await Section.update(id, req.body);
    res.json({ success: true, data: { affected } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.json({ success: true, data: { affected: 1, deleted: false } });
    }
    
    const affected = await Section.delete(id);
    res.json({ success: true, data: { affected } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reorderSections = async (req, res) => {
  try {
    const { sections } = req.body;
    await Section.reorder(sections);
    res.json({ success: true, message: 'Sections reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};