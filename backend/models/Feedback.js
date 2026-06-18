const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'resolved'],
    default: 'unread',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
