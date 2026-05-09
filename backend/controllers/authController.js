const jwt = require('jsonwebtoken');

const User = require('../models/User');

// LOGIN
exports.login = async (req, res) => {

  console.log('\n🔐 Login attempt');
  console.log('   Email:', req.body.email);
  console.log('   Password:', req.body.password);

  try {

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({
      email
    });

    if (!user) {

      console.log('   ❌ User not found');

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Compare plain text password
    if (user.password !== password) {

      console.log('   ❌ Invalid password');

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      {
        expiresIn: '7d'
      }
    );

    console.log('   ✅ Login successful');

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (error) {

    console.error('   ❌ Login error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// REGISTER
exports.register = async (req, res) => {

  console.log('\n📝 Registration attempt');

  try {

    const {
      username,
      email,
      password,
      role = 'editor'
    } = req.body;

    // Validate input
    if (!username || !email || !password) {

      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      });
    }

    // Check existing user
    const existing = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });

    if (existing) {

      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      role
    });

    console.log('   ✅ User registered successfully');

    res.json({
      success: true,
      data: {
        id: user.id,
        username,
        email,
        role
      }
    });

  } catch (error) {

    console.error('   ❌ Registration error:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET CURRENT USER
exports.getMe = async (req, res) => {

  try {

    const token =
      req.headers.authorization?.replace(
        'Bearer ',
        ''
      );

    if (!token) {

      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    );

    const user = await User.findById(
      decoded.id
    ).select(
      'id username email role created_at'
    );

    if (!user) {

      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    console.error('Error in getMe:', error);

    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// GET ALL USERS
exports.getAllUsers = async (req, res) => {

  try {

    const users = await User.find().select(
      'id username email role created_at'
    );

    res.json({
      success: true,
      data: users
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      username,
      email,
      password,
      role
    } = req.body;

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (email) {
      updateData.email = email;
    }

    if (password) {
      updateData.password = password;
    }

    if (role) {
      updateData.role = role;
    }

    if (Object.keys(updateData).length === 0) {

      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    await User.findByIdAndUpdate(
      id,
      updateData
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

// DELETE USER
exports.deleteUser = async (req, res) => {

  try {

    const { id } = req.params;

    await User.findByIdAndDelete(id);

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