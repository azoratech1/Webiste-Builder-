const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  username: {
    type: String,
    unique: true
  },

  email: {
    type: String,
    unique: true
  },

  password: String,

  role: {
    type: String,
    enum: ['admin', 'editor'],
    default: 'editor'
  }

}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: false
  }
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', userSchema);