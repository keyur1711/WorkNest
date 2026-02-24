const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true
    },
    spaceName: {
      type: String,
      required: true
    },
    spaceLocation: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Hot Desk', 'Dedicated Desk', 'Private Office', 'Meeting Room'],
      required: true
    },
    bookingDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const bookingDate = new Date(date);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= today;
        },
        message: 'Booking date cannot be in the past'
      }
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending'
    },
    userRating: {
      type: Number,
      min: 1,
      max: 5
    },
    userReviewComment: {
      type: String,
      trim: true
    },
    userReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    },
    paidAt: {
      type: Date
    },
    agreementUrl: {
      type: String
    },
    agreementAccepted: {
      type: Boolean,
      default: false
    },
    agreementAcceptedAt: {
      type: Date
    },
    agreementVersion: {
      type: String,
      trim: true
    },
    agreementTextSnapshot: {
      type: String,
      trim: true
    },
    agreementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agreement'
    }
  },
  {
    timestamps: true
  }
);
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ space: 1, bookingDate: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;