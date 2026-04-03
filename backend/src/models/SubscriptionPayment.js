const mongoose = require('mongoose');

const subscriptionPaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    planKey: { type: String, required: true, index: true },
    forRole: { type: String, required: true, enum: ['user', 'workspace_owner'], index: true },
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

subscriptionPaymentSchema.index({ user: 1, razorpayOrderId: 1 }, { unique: true });

module.exports = mongoose.model('SubscriptionPayment', subscriptionPaymentSchema);

