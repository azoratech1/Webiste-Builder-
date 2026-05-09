const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all pages
router.get('/', async (req, res) => {
  try {
    const [pages] = await db.query(`
      SELECT p.*, COUNT(s.id) as sections_count 
      FROM pages p 
      LEFT JOIN sections s ON p.id = s.page_id 
      GROUP BY p.id 
      ORDER BY p.created_at DESC
    `);
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single page by ID with sections
router.get('/:id', async (req, res) => {
  try {
    const [pages] = await db.query('SELECT * FROM pages WHERE id = ?', [req.params.id]);
    
    if (pages.length === 0) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }
    
    const [sections] = await db.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY order_position ASC',
      [req.params.id]
    );
    
    // Parse JSON content
    const parsedSections = sections.map(section => ({
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content
    }));
    
    res.json({ success: true, data: { ...pages[0], sections: parsedSections } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get page by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const [pages] = await db.query('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
    
    if (pages.length === 0) {
      return res.status(404).json({ success: false, error: 'Page not found' });
    }
    
    const [sections] = await db.query(
      'SELECT * FROM sections WHERE page_id = ? AND is_active = true ORDER BY order_position ASC',
      [pages[0].id]
    );
    
    const parsedSections = sections.map(section => ({
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content
    }));
    
    res.json({ success: true, data: { ...pages[0], sections: parsedSections } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create page
router.post('/', async (req, res) => {
  try {
    const { name, slug, is_active = true } = req.body;
    
    if (!name || !slug) {
      return res.status(400).json({ success: false, error: 'Name and slug required' });
    }
    
    const [result] = await db.query(
      'INSERT INTO pages (name, slug, is_active) VALUES (?, ?, ?)',
      [name, slug, is_active]
    );
    
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update page
router.put('/:id', async (req, res) => {
  try {
    const { name, slug, is_active } = req.body;
    
    await db.query(
      'UPDATE pages SET name = ?, slug = ?, is_active = ? WHERE id = ?',
      [name, slug, is_active, req.params.id]
    );
    
    res.json({ success: true, message: 'Page updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete page
router.delete('/:id', async (req, res) => {
  try {
    // Sections will be deleted automatically due to CASCADE
    await db.query('DELETE FROM pages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Page deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
router.get('/navigation', async (req, res) => {
  try {
    const [pages] = await db.query(
      'SELECT id, name, slug FROM pages WHERE is_active = true AND show_in_nav = true ORDER BY order_position ASC'
    );
    res.json({ success: true, data: pages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = router;