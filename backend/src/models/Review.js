const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewerName: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['published', 'hidden', 'flagged'],
      default: 'published'
    },
    response: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ space: 1, rating: -1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;


