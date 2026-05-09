const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// Increase payload size limits (IMPORTANT for file uploads)
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // Increase JSON limit
app.use(express.urlencoded({ extended: true, limit: '50mb' }));  // Increase URL encoded limit

// Create uploads directory if not exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Uploads directory created');
}

// Static files
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/media', require('./routes/media'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  // Handle payload too large error specifically
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      success: false, 
      error: 'File too large. Maximum file size is 5MB.' 
    });
  }
  
  res.status(500).json({ success: false, error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📁 Uploads: ${uploadsDir}\n`);
});