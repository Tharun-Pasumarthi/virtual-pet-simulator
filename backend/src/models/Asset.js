const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'audio', 'animation'],
    required: true
  },
  category: {
    type: String,
    enum: ['idle', 'happy', 'sad', 'sleeping', 'eating', 'playing'],
    required: true
  },
  petType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PetType',
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Asset', assetSchema);