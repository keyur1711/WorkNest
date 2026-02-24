const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const envPaths = [
  path.resolve(__dirname, '../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env')
];
let envLoaded = false;
envPaths.some((envPath) => {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    envLoaded = true;
    console.log(`✅ Environment variables loaded from: ${envPath}`);
  }
  return !result.error;
});
if (!envLoaded) {
  console.warn('⚠️  No .env file found. Using default values.');
}
if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET is set in environment');
} else {
  console.warn('⚠️  JWT_SECRET not found in environment. Using default.');
}
const connectDB = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    const server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('❌ Server startup failed');
    process.exit(1);
  }
};
startServer();