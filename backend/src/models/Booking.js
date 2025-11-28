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
          return date >= new Date().setHours(0, 0, 0, 0);
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
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending'
    },
    agreementUrl: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ space: 1, bookingDate: 1 });
bookingSchema.index({ bookingDate: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

