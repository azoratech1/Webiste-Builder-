const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({

  id: {
    type: Number,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true,
    unique: true
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model(
  'Website',
  websiteSchema
);