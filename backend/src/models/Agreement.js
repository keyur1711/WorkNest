const mongoose = require('mongoose');

const agreementSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    space: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Space',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    documentType: {
      type: String,
      trim: true
    },
    documentUrl: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'signed', 'archived'],
      default: 'draft'
    },
    effectiveDate: {
      type: Date
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

agreementSchema.index({ space: 1, status: 1 });

const Agreement = mongoose.model('Agreement', agreementSchema);

module.exports = Agreement;


