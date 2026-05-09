const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

// Login
router.post('/login', authController.login);

// Register
router.post('/register', authController.register);

// Current user
router.get('/me', authController.getMe);

// Users
router.get('/users', authController.getAllUsers);

router.put('/users/:id', authController.updateUser);

router.delete('/users/:id', authController.deleteUser);

module.exports = router;