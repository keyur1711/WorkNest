const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

const PLANS = {
  user_basic: {
    forRole: 'user',
    label: 'User Basic',
    durationDays: 30
  },
  user_pro: {
    forRole: 'user',
    label: 'User Pro',
    durationDays: 30
  },
  owner_basic: {
    forRole: 'workspace_owner',
    label: 'Owner Basic',
    durationDays: 30
  },
  owner_pro: {
    forRole: 'workspace_owner',
    label: 'Owner Pro',
    durationDays: 30
  }
};

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

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + plan.durationDays);

    user.subscriptionPlan = planKey;
    user.subscriptionStatus = 'active';
    user.subscriptionForRole = plan.forRole;
    user.subscriptionExpiresAt = expiresAt;

    await user.save();

    const plainUser = user.toJSON();

    return res.json({
      message: 'Subscription updated successfully',
      subscription: {
        plan: user.subscriptionPlan,
        status: user.subscriptionStatus,
        forRole: user.subscriptionForRole,
        expiresAt: user.subscriptionExpiresAt
      },
      user: plainUser
    });
  } catch (error) {
    console.error('Select subscription error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

