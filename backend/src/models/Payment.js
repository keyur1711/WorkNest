const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true, index: true },
    space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String, required: true, index: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created', index: true },
    failureReason: { type: String },
    metadata: { type: Object }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Payment', paymentSchema);