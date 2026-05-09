const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({

  id: {
    type: Number,
    unique: true
  },

  page_id: {
    type: Number,
    required: true
  },

  section_type: String,

  title: String,

  content: {
    type: Object,
    default: {}
  },

  order_position: {
    type: Number,
    default: 0
  },

  is_active: {
    type: Boolean,
    default: true
  },
  website_id: {
  type: Number,
  required: true,
  index: true
},

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model(
  'Section',
  sectionSchema
);