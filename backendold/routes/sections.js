const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Create section
router.post('/', async (req, res) => {
  try {
    const { page_id, section_type, title, content, order_position, is_active = true } = req.body;
    
    if (!page_id || !section_type) {
      return res.status(400).json({ success: false, error: 'page_id and section_type required' });
    }
    
    const contentStr = JSON.stringify(content || {});
    const orderPos = order_position !== undefined ? order_position : 0;
    
    const [result] = await db.query(
      'INSERT INTO sections (page_id, section_type, title, content, order_position, is_active) VALUES (?, ?, ?, ?, ?, ?)',
      [page_id, section_type, title, contentStr, orderPos, is_active]
    );
    
    res.json({ success: true, data: { id: result.insertId } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update section
router.put('/:id', async (req, res) => {
  try {
    const { title, content, order_position, is_active } = req.body;
    const contentStr = JSON.stringify(content || {});
    
    await db.query(
      'UPDATE sections SET title = ?, content = ?, order_position = ?, is_active = ? WHERE id = ?',
      [title, contentStr, order_position, is_active, req.params.id]
    );
    
    res.json({ success: true, message: 'Section updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete section
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM sections WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Section deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Reorder sections
router.post('/reorder', async (req, res) => {
  try {
    const { sections } = req.body;
    
    for (const section of sections) {
      await db.query('UPDATE sections SET order_position = ? WHERE id = ?', [section.order, section.id]);
    }
    
    res.json({ success: true, message: 'Sections reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get sections by page
router.get('/page/:pageId', async (req, res) => {
  try {
    const [sections] = await db.query(
      'SELECT * FROM sections WHERE page_id = ? ORDER BY order_position ASC',
      [req.params.pageId]
    );
    
    const parsedSections = sections.map(section => ({
      ...section,
      content: typeof section.content === 'string' ? JSON.parse(section.content) : section.content
    }));
    
    res.json({ success: true, data: parsedSections });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;