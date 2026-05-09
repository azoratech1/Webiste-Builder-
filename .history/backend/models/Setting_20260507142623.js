const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({

  setting_key: {
    type: String,
    unique: true
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

settingSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

settingSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Setting', settingSchema);