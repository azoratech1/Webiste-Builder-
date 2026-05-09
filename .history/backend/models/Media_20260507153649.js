const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({

  id: {
    type: Number,
    unique: true
  },
  website_id: {
  type: Number,
  required: true,
  index: true
},

  filename: String,

  original_name: String,

  path: String,

  mime_type: String,

  size: Number

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

module.exports = mongoose.model(
  'Media',
  mediaSchema
);