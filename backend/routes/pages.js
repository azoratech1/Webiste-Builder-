const express = require('express');

const router = express.Router();

const pageController = require('../controllers/pageController');

// Navigation
router.get('/navigation', pageController.getNavigationPages);

// Get by slug
router.get('/slug/:slug', pageController.getPageBySlug);

// Get all pages
router.get('/', pageController.getAllPages);

// Get page by ID
router.get('/:id', pageController.getPage);

// Create page
router.post('/', pageController.createPage);

// Update page
router.put('/:id', pageController.updatePage);

// Delete page
router.delete('/:id', pageController.deletePage);

module.exports = router;