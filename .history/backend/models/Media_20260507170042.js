const mongoose =
require('mongoose');

const mediaSchema =
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

  filename: String,

  original_name: String,

  path: String,

  mime_type: String,

  size: Number

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// UNIQUE ONLY INSIDE WEBSITE
mediaSchema.index(
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
  'Media',
  mediaSchema
);