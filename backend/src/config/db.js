const mongoose = require('mongoose');
const dns = require('dns');
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('❌ MONGO_URI is not set in .env file');
    throw new Error('MONGO_URI is required');
  }
  try {
    console.log('🔌 Connecting to MongoDB...');
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed');
    if (error.message.includes('ETIMEOUT') || error.message.includes('querySrv')) {
      console.error('\n⚠️  DNS Resolution Timeout');
      console.error('Your network cannot resolve MongoDB Atlas hostname.');
      console.error('\n💡 Solutions:');
      console.error('   1. Check internet connection');
      console.error('   2. Try different network (mobile hotspot)');
      console.error('   3. Check firewall/antivirus settings');
      console.error('   4. Contact network administrator (if on college/office network)');
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
};
module.exports = connectDB;