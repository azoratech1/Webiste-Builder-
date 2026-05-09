const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Login function - plain text password comparison
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
    
    // Get user from database
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    
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
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
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

// Register function
exports.register = async (req, res) => {
  console.log('\n📝 Registration attempt');
  
  try {
    const { username, email, password, role = 'editor' } = req.body;
    
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, email, and password are required' 
      });
    }
    
    // Check if user already exists
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'User with this email or username already exists' 
      });
    }
    
    // Insert user with plain text password
    const [result] = await db.query(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    
    console.log('   ✅ User registered successfully');
    
    res.json({ 
      success: true, 
      data: { 
        id: result.insertId,
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

// Get current user
exports.getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!users[0]) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Error in getMe:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, email, role, created_at FROM users');
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;
    
    let query = 'UPDATE users SET ';
    const updates = [];
    const values = [];
    
    if (username) {
      updates.push('username = ?');
      values.push(username);
    }
    if (email) {
      updates.push('email = ?');
      values.push(email);
    }
    if (password) {
      updates.push('password = ?');
      values.push(password);
    }
    if (role) {
      updates.push('role = ?');
      values.push(role);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No fields to update' 
      });
    }
    
    query += updates.join(', ') + ' WHERE id = ?';
    values.push(id);
    
    const [result] = await db.query(query, values);
    
    res.json({ 
      success: true, 
      data: { affected: result.affectedRows } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      data: { affected: result.affectedRows } 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};