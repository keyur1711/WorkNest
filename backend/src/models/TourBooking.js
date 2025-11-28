const mongoose = require('mongoose');

const tourBookingSchema = new mongoose.Schema(
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
    tourDate: {
      type: Date,
      required: true,
      validate: {
        validator: function(date) {
          return date >= new Date().setHours(0, 0, 0, 0);
        },
        message: 'Tour date cannot be in the past'
      }
    },
    tourTime: {
      type: String,
      required: true
    },
    contactName: {
      type: String,
      required: true
    },
    contactEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    contactPhone: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending'
    },
    notes: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
tourBookingSchema.index({ user: 1, status: 1 });
tourBookingSchema.index({ space: 1, tourDate: 1 });
tourBookingSchema.index({ tourDate: 1 });
tourBookingSchema.index({ status: 1 });

const TourBooking = mongoose.model('TourBooking', tourBookingSchema);

module.exports = TourBooking;

