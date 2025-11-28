const mongoose = require('mongoose');

const coordinatesSchema = new mongoose.Schema(
  {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const availabilitySchema = new mongoose.Schema(
  {
    openDays: {
      type: [String],
      default: []
    },
    openHours: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const spaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    locationText: {
      type: String,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    pricePerDay: {
      type: Number,
      required: true,
      min: 0
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    capacity: {
      type: Number,
      default: 0,
      min: 0
    },
    coordinates: coordinatesSchema,
    amenities: {
      type: [String],
      default: []
    },
    images: {
      type: [String],
      default: []
    },
    owner: {
      name: {
        type: String,
        trim: true
      },
      phone: {
        type: String,
        trim: true
      }
    },
    ownerUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    availability: availabilitySchema,
    description: {
      type: String,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better query performance
spaceSchema.index({ city: 1, type: 1 });
spaceSchema.index({ featured: 1 });
spaceSchema.index({ rating: -1 });
spaceSchema.index({ pricePerDay: 1 });
spaceSchema.index({ name: 'text', city: 'text', type: 'text', locationText: 'text' });

const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;

