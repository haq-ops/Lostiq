const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: [true, 'Type is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['electronics', 'wallet', 'keys', 'bag', 'documents', 'jewelry', 'clothing', 'pets', 'other'],
    required: true
  },
  images: [{
    type: String
  }],
  location: {
    city: { type: String, required: true },
    area: { type: String, default: '' },
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);