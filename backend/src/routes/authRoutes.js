const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { JWT_SECRET } = require('../config/jwt');

const router = express.Router();

const generateToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

router.post(
  '/register',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom((value, { req }) => {
      if (value && value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
    body('role')
      .exists({ checkFalsy: true })
      .withMessage('Role is required')
      .isIn(['user', 'workspace_owner'])
      .withMessage('Role must be either user or workspace owner'),
    body('agreeToTerms').custom((value) => {
      if (value !== true && value !== 'true') {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    }),
    body('phone').optional().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, email, password, phone, role, agreeToTerms } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already registered' });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Set role: use provided role or default to 'user'
      // Admin role cannot be set during registration
      const userRole = role;

      const user = await User.create({
        fullName,
        email,
        password: hashedPassword,
        phone,
        role: userRole,
        agreeToTerms: agreeToTerms === true || agreeToTerms === 'true'
      });

      const token = generateToken(user);

      console.log('User registered:', {
        email: user.email,
        role: user.role,
        fullName: user.fullName
      });

      return res.status(201).json({
        user: user.toJSON(),
        token
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    body('role')
      .optional()
      .isIn(['user', 'workspace_owner'])
      .withMessage('Invalid role selection')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Role-based validation (only for user and workspace_owner, admin doesn't need role selection)
      if (user.role === 'admin') {
        console.log('Admin login detected, bypassing role match check');
      } else {
        if (!role) {
          return res.status(400).json({
            message: 'Please select your role (User or Workspace Owner) to sign in.'
          });
        }

        if (user.role !== role) {
          return res.status(403).json({
            message: `Invalid role. This account is registered as ${user.role.replace('_', ' ')}, but you selected ${role.replace('_', ' ')}. Please select the correct role or contact support.`
          });
        }
      }

      const token = generateToken(user);
      const userJSON = user.toJSON();
      
      // Debug logging
      console.log('Login successful for:', user.email);
      console.log('User role from database:', user.role);
      console.log('Selected role:', role);
      console.log('User JSON role:', userJSON.role);

      return res.json({
        user: userJSON,
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ user });
  } catch (error) {
    console.error('Fetch user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.patch(
  '/me',
  auth,
  [
    body('fullName').optional().trim().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').optional().trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { fullName, email, phone } = req.body;
      const updateData = {};

      if (fullName) updateData.fullName = fullName;
      if (email) updateData.email = email;
      if (phone !== undefined) updateData.phone = phone;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password -__v');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({ user });
    } catch (error) {
      console.error('Update user error:', error);
      if (error.code === 11000) {
        return res.status(409).json({ message: 'Email already in use' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;

