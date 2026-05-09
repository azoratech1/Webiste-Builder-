const mongoose = require('mongoose');

const pageSchema =
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

  name: {
    type: String,
    required: true
  },

  slug: {
    type: String,
    required: true
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
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// UNIQUE PAGE ID PER WEBSITE
pageSchema.index(
  {
    website_id: 1,
    id: 1
  },
  {
    unique: true
  }
);

// UNIQUE SLUG PER WEBSITE
pageSchema.index(
  {
    website_id: 1,
    slug: 1
  },
  {
    unique: true
  }
);

pageSchema.virtual('mongo_id')
.get(function () {

  return this._id.toHexString();
});

pageSchema.set('toJSON', {
  virtuals: true
});

module.exports =
mongoose.model(
  'Page',
  pageSchema
);