const express = require('express');

const cors = require('cors');

const dotenv = require('dotenv');

const path = require('path');

const fs = require('fs');

// MODELS
const User = require('./models/User');

const Page = require('./models/Page');

const Section = require('./models/Section');

const Media = require('./models/Media');

const Website = require('./models/Website');
const mongoose =
require('mongoose');
// DB
const connectDB = require('./config/db');

// MIDDLEWARE
const websiteMiddleware =
  require('./middleware/websiteMiddleware');
const defaultPages =
require('./seed/defaultPages');

const getNextId =
require('./utils/getNextId');
dotenv.config();

const app = express();

// CONNECT MONGODB
connectDB();

// MIDDLEWARE
app.use(cors());

app.use(express.json({
  limit: '50mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// CREATE UPLOADS DIRECTORY
const uploadsDir =
  path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {

  fs.mkdirSync(uploadsDir, {
    recursive: true
  });

  console.log(
    '📁 Uploads directory created'
  );
}

// STATIC FILES
app.use(
  '/uploads',
  express.static(uploadsDir)
);

// ROUTES

// AUTH
app.use(
  '/api/auth',
  require('./routes/auth')
);

// WEBSITES
app.use(
  '/api/websites',
  require('./routes/websites')
);

// MULTI TENANT ROUTES
app.use(
  '/api/pages',
  websiteMiddleware,
  require('./routes/pages')
);

app.use(
  '/api/sections',
  websiteMiddleware,
  require('./routes/sections')
);

app.use(
  '/api/media',
  websiteMiddleware,
  require('./routes/media')
);

app.use(
  '/api/settings',
  websiteMiddleware,
  require('./routes/settings')
);

// HEALTH CHECK
app.get('/api/health', (req, res) => {

  res.json({

    success: true,

    status: 'OK',

    database: 'MongoDB',

    timestamp:
      new Date().toISOString()
  });
});
app.get(
  '/reset-settings-index',
  async (req, res) => {

    try {

      await mongoose.connection
      .collection('settings')
      .dropIndexes();

      res.json({
        success: true,
        message:
          'Indexes dropped'
      });

    } catch (err) {

      res.json({
        success: false,
        error: err.message
      });
    }
  }
);
// CREATE ADMIN
app.get('/create-admin', async (req, res) => {

  try {

    const existing =
      await User.findOne({
        email: 'admin@gmail.com'
      });

    if (existing) {

      return res.json({
        success: true,
        message:
          'Admin already exists'
      });
    }

    const user =
      await User.create({

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

// RESET ADMIN
app.get('/reset-admin', async (req, res) => {

  try {

    await User.deleteMany({
      email: 'admin@gmail.com'
    });

    const user =
      await User.create({

        username: 'admin',

        email: 'admin@gmail.com',

        password: '123456',

        role: 'admin'
      });

    res.json({

      success: true,

      message:
        'Admin reset successfully',

      data: user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// RESET DATABASE
app.get('/reset-db', async (req, res) => {

  try {

    await Website.deleteMany({});

    await Page.deleteMany({});

    await Section.deleteMany({});

    await Media.deleteMany({});

    res.json({

      success: true,

      message:
        'Database reset complete'
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ROOT ROUTE
app.get('/', (req, res) => {

  res.json({

    success: true,

    message:
      'Website Builder API Running',

    database: 'MongoDB Atlas'
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {

  console.error('\n❌ Server Error:');

  console.error(err.stack);

  // PAYLOAD TOO LARGE
  if (err.type === 'entity.too.large') {

    return res.status(413).json({

      success: false,

      error:
        'File too large. Maximum file size is 5MB.'
    });
  }

  // MULTER FILE LIMIT
  if (err.code === 'LIMIT_FILE_SIZE') {

    return res.status(413).json({

      success: false,

      error:
        'File size exceeds limit'
    });
  }

  // DUPLICATE KEY
  if (err.code === 11000) {

    return res.status(400).json({

      success: false,

      error:
        'Duplicate field value entered'
    });
  }

  // INVALID CAST
  if (err.name === 'CastError') {

    return res.status(400).json({

      success: false,

      error:
        'Invalid ID format'
    });
  }

  // DEFAULT ERROR
  res.status(500).json({

    success: false,

    error:
      err.message || 'Server Error'
  });
});

// 404 HANDLER
app.use((req, res) => {

  res.status(404).json({

    success: false,

    error: 'Route not found'
  });
});

// START SERVER
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    '\n🚀 Server running successfully'
  );

  console.log(
    `📍 Port: ${PORT}`
  );

  console.log(
    `🌐 URL: http://localhost:${PORT}`
  );

  console.log(
    `🗄️ Database: MongoDB Atlas`
  );

  console.log(
    `📁 Uploads: ${uploadsDir}\n`
  );
});