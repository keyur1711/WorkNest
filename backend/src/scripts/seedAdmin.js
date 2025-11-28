/* eslint-disable no-console */
const path = require('path');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({
  path: path.resolve(__dirname, '../../.env')
});

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@worknest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Update existing admin to ensure it has admin role and reset password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      existingAdmin.role = 'admin';
      existingAdmin.password = hashedPassword;
      existingAdmin.fullName = adminName;
      await existingAdmin.save();
      console.log(`✅ Updated existing user ${adminEmail} to admin role and reset password.`);
      console.log(`\nAdmin Login Credentials:`);
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      process.exit(0);
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await User.create({
      fullName: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      agreeToTerms: true
    });

    console.log(`\n✅ Default admin user created successfully!`);
    console.log(`\nAdmin Login Credentials:`);
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log(`\n⚠️  Please change the password after first login for security.`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin user:', error);
    process.exit(1);
  }
};

seedAdmin();

