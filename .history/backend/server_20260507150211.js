const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');
const connectDB = require('./config/db');
const Page = require('./models/Page');
const Section = require('./models/Section');
const Media = require('./models/Media');
dotenv.config();

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());

// Increase payload size limits
app.use(express.json({
  limit: '50mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {

  fs.mkdirSync(uploadsDir, {
    recursive: true
  });

  console.log('📁 Uploads directory created');
}

// Static uploads
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {

  res.json({
    success: true,
    status: 'OK',
    database: 'MongoDB',
    timestamp: new Date().toISOString()
  });
});
app.get('/create-admin', async (req, res) => {

  try {

    const existing = await User.findOne({
      email: 'admin@gmail.com'
    });

    if (existing) {

      return res.json({
        success: true,
        message: 'Admin already exists'
      });
    }

    const user = await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: '123456',
      role: 'admin'
    });

    res.json({
      success: true,
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.get('/reset-admin', async (req, res) => {

  try {

    // Delete existing admin
    await User.deleteMany({
      email: 'admin@gmail.com'
    });

    // Create fresh admin
    const user = await User.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: '123456',
      role: 'admin'
    });

    res.json({
      success: true,
      message: 'Admin reset successfully',
      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
app.get('/reset-db', async (req, res) => {

  await Page.deleteMany({});
  await Section.deleteMany({});
  await Media.deleteMany({});

  res.json({
    success: true,
    message: 'Database reset complete'
  });
});
// Root route
app.get('/', (req, res) => {

  res.json({
    success: true,
    message: 'Website Builder API Running',
    database: 'MongoDB'
  });
});

// Error handler
app.use((err, req, res, next) => {

  console.error('\n❌ Server Error:');
  console.error(err.stack);

  // File too large
  if (err.type === 'entity.too.large') {

    return res.status(413).json({
      success: false,
      error: 'File too large. Maximum file size is 5MB.'
    });
  }

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {

    return res.status(413).json({
      success: false,
      error: 'File size exceeds limit'
    });
  }

  // Mongo duplicate key
  if (err.code === 11000) {

    return res.status(400).json({
      success: false,
      error: 'Duplicate field value entered'
    });
  }

  // Mongo invalid object id
  if (err.name === 'CastError') {

    return res.status(400).json({
      success: false,
      error: 'Invalid ID format'
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    error: err.message || 'Server Error'
  });
});

// 404 handler
app.use((req, res) => {

  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log('\n🚀 Server running successfully');
  console.log(`📍 Port: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: MongoDB Atlas`);
  console.log(`📁 Uploads: ${uploadsDir}\n`);
});