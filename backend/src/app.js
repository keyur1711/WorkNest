const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const spaceRoutes = require('./routes/spaceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.get('/api/reset-admin', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@worknest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin.role = 'admin';
      admin.password = hashedPassword;
      admin.fullName = adminName;
      await admin.save();
      const verifyAdmin = await User.findOne({ email: adminEmail });
      console.log('Admin user after update:', {
        email: verifyAdmin.email,
        role: verifyAdmin.role,
        fullName: verifyAdmin.fullName
      });
      return res.json({
        message: 'Admin password reset successfully',
        email: adminEmail,
        password: adminPassword,
        role: verifyAdmin.role,
        user: verifyAdmin.toJSON()
      });
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin = await User.create({
        fullName: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        agreeToTerms: true
      });
      return res.json({
        message: 'Admin user created successfully',
        email: adminEmail,
        password: adminPassword,
        role: admin.role,
        user: admin.toJSON()
      });
    }
  } catch (error) {
    console.error('Reset admin error:', error);
    return res.status(500).json({ message: 'Failed to reset admin password', error: error.message });
  }
});
app.post('/api/reset-admin', async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@worknest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin.role = 'admin';
      admin.password = hashedPassword;
      admin.fullName = adminName;
      await admin.save();
      const verifyAdmin = await User.findOne({ email: adminEmail });
      console.log('Admin user after update:', {
        email: verifyAdmin.email,
        role: verifyAdmin.role,
        fullName: verifyAdmin.fullName
      });
      return res.json({
        message: 'Admin password reset successfully',
        email: adminEmail,
        password: adminPassword,
        role: verifyAdmin.role,
        user: verifyAdmin.toJSON()
      });
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      admin = await User.create({
        fullName: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        agreeToTerms: true
      });
      return res.json({
        message: 'Admin user created successfully',
        email: adminEmail,
        password: adminPassword,
        role: admin.role,
        user: admin.toJSON()
      });
    }
  } catch (error) {
    console.error('Reset admin error:', error);
    return res.status(500).json({ message: 'Failed to reset admin password', error: error.message });
  }
});
app.get('/api/check-admin/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password -__v');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({
      email: user.email,
      role: user.role,
      fullName: user.fullName,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return res.status(500).json({ message: 'Failed to check admin', error: error.message });
  }
});
app.use('/api/auth', authRoutes);
app.use('/api/spaces', spaceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error' });
});
module.exports = app;