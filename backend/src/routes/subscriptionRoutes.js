const express = require('express');
const { body, validationResult } = require('express-validator');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const SubscriptionPayment = require('../models/SubscriptionPayment');

const router = express.Router();

const PLANS = {
  user_basic: {
    forRole: 'user',
    label: 'User Basic',
    durationDays: 30,
    amountInRupees: 0
  },
  user_pro: {
    forRole: 'user',
    label: 'User Pro',
    durationDays: 30,
    amountInRupees: 299
  },
  owner_basic: {
    forRole: 'workspace_owner',
    label: 'Owner Basic',
    durationDays: 30,
    amountInRupees: 0
  },
  owner_pro: {
    forRole: 'workspace_owner',
    label: 'Owner Pro',
    durationDays: 30,
    amountInRupees: 499
  }
};

let razorpay = null;
try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Subscription Razorpay initialized successfully');
  } else {
    console.warn('Subscription Razorpay keys not found in environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Subscription Razorpay:', error.message);
}

router.use(auth);

router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'subscriptionPlan subscriptionStatus subscriptionForRole subscriptionExpiresAt role fullName email'
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      subscription: {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        forRole: user.subscriptionForRole,
        expiresAt: user.subscriptionExpiresAt
      },
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

const computeExpiresAt = (durationDays) => {
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + durationDays);
  return expiresAt;
};

const updateUserSubscription = async (userId, planKey, plan) => {
  const user = await User.findById(userId);
  if (!user) return null;

  user.subscriptionPlan = planKey;
  user.subscriptionStatus = 'active';
  user.subscriptionForRole = plan.forRole;
  user.subscriptionExpiresAt = computeExpiresAt(plan.durationDays);
  await user.save();
  return user.toJSON();
};

router.post('/select', async (req, res) => {
  try {
    const { planKey } = req.body;

    if (!planKey || !PLANS[planKey]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }

    const plan = PLANS[planKey];

    if (plan.forRole !== req.user.role && req.user.role !== 'admin') {
      return res.status(403).json({
        message: `This plan is only available for ${plan.forRole} accounts`
      });
    }

    // Only allow free plan selection via this endpoint (unless admin).
    if (plan.amountInRupees > 0 && req.user.role !== 'admin') {
      return res.status(400).json({
        message: 'This plan requires payment. Use the checkout flow in the Pricing page.'
      });
    }

    const plainUser = await updateUserSubscription(req.user.id, planKey, plan);
    if (!plainUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'Subscription updated successfully',
      subscription: {
        plan: plainUser.subscriptionPlan,
        status: plainUser.subscriptionStatus,
        forRole: plainUser.subscriptionForRole,
        expiresAt: plainUser.subscriptionExpiresAt
      },
      user: plainUser
    });
  } catch (error) {
    console.error('Select subscription error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/create-order',
  [
    body('planKey').trim().notEmpty().withMessage('planKey is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { planKey } = req.body;
      if (!PLANS[planKey]) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
      }
      const plan = PLANS[planKey];

      if (plan.amountInRupees <= 0) {
        return res.status(400).json({ message: 'This plan is free. Use /select to activate it.' });
      }

      if (plan.forRole !== req.user.role && req.user.role !== 'admin') {
        return res.status(403).json({
          message: `This plan is only available for ${plan.forRole} accounts`
        });
      }

      if (!razorpay) {
        return res.status(500).json({
          message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
        });
      }

      const amountInPaise = Math.max(Math.round(plan.amountInRupees * 100), 100);
      const rawReceipt = `sub_${req.user.id}_${planKey}`;
      const receipt = rawReceipt.slice(0, 40);
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          userId: req.user.id.toString(),
          planKey,
          forRole: plan.forRole
        }
      };

      const order = await razorpay.orders.create(options);

      const subscriptionPayment = await SubscriptionPayment.create({
        user: req.user.id,
        planKey,
        forRole: plan.forRole,
        amount: plan.amountInRupees,
        currency: 'INR',
        razorpayOrderId: order.id,
        status: 'created',
        metadata: { receipt, notes: options.notes }
      });

      return res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        subscriptionPaymentId: subscriptionPayment._id
      });
    } catch (error) {
      console.error('Create subscription order error:', error);
      return res.status(500).json({ message: 'Failed to create subscription order' });
    }
  }
);

router.post(
  '/verify-payment',
  [
    body('planKey').trim().notEmpty().withMessage('planKey is required'),
    body('razorpay_order_id').notEmpty().withMessage('razorpay_order_id is required'),
    body('razorpay_payment_id').notEmpty().withMessage('razorpay_payment_id is required'),
    body('razorpay_signature').notEmpty().withMessage('razorpay_signature is required')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { planKey, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      if (!PLANS[planKey]) {
        return res.status(400).json({ message: 'Invalid subscription plan' });
      }
      const plan = PLANS[planKey];

      const paymentRecord = await SubscriptionPayment.findOne({
        user: req.user.id,
        planKey,
        razorpayOrderId: razorpay_order_id
      });

      if (!paymentRecord) {
        return res.status(404).json({ message: 'Subscription payment record not found' });
      }

      if (!razorpay) {
        return res.status(500).json({
          message: 'Payment gateway not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
        });
      }

      const text = `${razorpay_order_id}|${razorpay_payment_id}`;
      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(text)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        paymentRecord.status = 'failed';
        paymentRecord.failureReason = 'Invalid signature';
        paymentRecord.razorpayPaymentId = razorpay_payment_id;
        paymentRecord.razorpaySignature = razorpay_signature;
        await paymentRecord.save();
        return res.status(400).json({ message: 'Invalid payment signature' });
      }

      const paymentInfo = await razorpay.payments.fetch(razorpay_payment_id);
      if (paymentInfo.status !== 'captured' && paymentInfo.status !== 'authorized') {
        paymentRecord.status = 'failed';
        paymentRecord.failureReason = `Gateway status: ${paymentInfo.status}`;
        paymentRecord.razorpayPaymentId = razorpay_payment_id;
        paymentRecord.razorpaySignature = razorpay_signature;
        await paymentRecord.save();
        return res.status(400).json({ message: 'Payment not successful' });
      }

      paymentRecord.status = 'paid';
      paymentRecord.razorpayPaymentId = razorpay_payment_id;
      paymentRecord.razorpaySignature = razorpay_signature;
      paymentRecord.failureReason = null;
      await paymentRecord.save();

      const plainUser = await updateUserSubscription(req.user.id, planKey, plan);
      if (!plainUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        success: true,
        message: 'Subscription payment verified and subscription activated',
        subscription: {
          plan: plainUser.subscriptionPlan,
          status: plainUser.subscriptionStatus,
          forRole: plainUser.subscriptionForRole,
          expiresAt: plainUser.subscriptionExpiresAt
        },
        user: plainUser
      });
    } catch (error) {
      console.error('Verify subscription payment error:', error);
      return res.status(500).json({ message: 'Failed to verify subscription payment' });
    }
  }
);

module.exports = router;

