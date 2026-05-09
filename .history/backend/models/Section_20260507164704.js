const mongoose =
require('mongoose');

const sectionSchema =
new mongoose.Schema({

  id: {
    type: Number,
    required: true
  },

  website_id: {
    type: Number,
    required: true,
    index: true
  },

  page_id: {
    type: Number,
    required: true
  },

  section_type: {
    type: String,
    default: ''
  },

  title: {
    type: String,
    default: ''
  },

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
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// UNIQUE SECTION ID INSIDE WEBSITE
sectionSchema.index(
  {
    website_id: 1,
    id: 1
  },
  {
    unique: true
  }
);

module.exports =
mongoose.model(
  'Section',
  sectionSchema
);