const express = require('express');

const router = express.Router();

const sectionController = require('../controllers/sectionController');

// Create section
router.post('/', sectionController.createSection);

// Update section
router.put('/:id', sectionController.updateSection);

// Delete section
router.delete('/:id', sectionController.deleteSection);

// Reorder
router.post('/reorder', sectionController.reorderSections);

// Get sections by page
router.get('/page/:pageId', sectionController.getSectionsByPage);

module.exports = router;