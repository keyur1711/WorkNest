// Centralized JWT configuration
// This ensures the same secret is used for signing and verifying tokens
// IMPORTANT: This file should be imported AFTER dotenv.config() is called in server.js

const JWT_SECRET = process.env.JWT_SECRET || 'worknest_dev_secret';

// Log which secret is being used (first 10 chars only for security)
const secretPreview = JWT_SECRET.length > 10 ? JWT_SECRET.substring(0, 10) + '...' : JWT_SECRET;
const secretSource = process.env.JWT_SECRET ? `From env (${secretPreview})` : 'Using default (worknest_dev_secret)';
console.log('🔑 JWT_SECRET loaded:', secretSource);

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set in environment variables. Using default secret.');
  console.warn('⚠️  This is insecure for production. Please set JWT_SECRET in your .env file.');
} else {
  console.log('✅ JWT_SECRET is properly configured from environment');
}

module.exports = {
  JWT_SECRET
};

