const mongoose = require('mongoose');

const settingSchema =
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

  setting_key: {
    type: String,
    required: true
  },

  setting_value: {
    type: Object,
    default: {}
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// UNIQUE PER WEBSITE
settingSchema.index({
  website_id: 1,
  setting_key: 1
}, {
  unique: true
});

settingSchema.virtual('mongo_id')
.get(function () {

  return this._id.toHexString();
});

settingSchema.set('toJSON', {
  virtuals: true
});

module.exports =
mongoose.model(
  'Setting',
  settingSchema
);