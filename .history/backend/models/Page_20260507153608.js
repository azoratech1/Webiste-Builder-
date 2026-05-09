const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema({

  id: {
    type: Number,
    unique: true
  },

  name: String,

  slug: {
    type: String,
    unique: true
  },

  is_active: {
    type: Boolean,
    default: true
  },

  show_in_nav: {
    type: Boolean,
    default: true
  },

  order_position: {
    type: Number,
    default: 0
  },
  

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
  
});

module.exports = mongoose.model(
  'Page',
  pageSchema
);