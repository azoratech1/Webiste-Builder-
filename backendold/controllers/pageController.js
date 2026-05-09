const Page = require('../models/Page');
const Section = require('../models/Section');

exports.getAllPages = async (req, res) => {
  try {
    const pages = await Page.getAll();
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getPage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id || id === 'undefined') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid page ID' 
      });
    }
    
    const page = await Page.getById(id);
    if (!page) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }
    const sections = await Section.getByPageId(id);
    res.json({ success: true, data: { ...page, sections } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createPage = async (req, res) => {
  try {
    const { name, slug, is_active = true } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name and slug are required' 
      });
    }
    
    const pageId = await Page.create({ name, slug, is_active });
    res.json({ success: true, data: { id: pageId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await Page.update(id, req.body);
    res.json({ success: true, data: { affected } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const { id } = req.params;
    const affected = await Page.delete(id);
    res.json({ success: true, data: { affected } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};