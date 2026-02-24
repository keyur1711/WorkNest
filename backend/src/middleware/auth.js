const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config/jwt');
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth middleware - Request:', {
    path: req.path,
    method: req.method,
    hasAuthHeader: !!authHeader,
    authHeaderPrefix: authHeader?.substring(0, 20)
  });
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('Auth failed: No authorization header or invalid format');
    return res.status(401).json({ message: 'Authorization token missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.error('Auth failed: Token not found in header');
    return res.status(401).json({ message: 'Authorization token missing' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully:', { userId: decoded.id, role: decoded.role });
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.error('Auth failed: User not found in database', { userId: decoded.id });
      return res.status(401).json({ message: 'User not found' });
    }
    console.log('User found:', { userId: user._id, email: user.email, role: user.role });
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName
    };
    return next();
  } catch (error) {
    console.error('Token verification error:', {
      name: error.name,
      message: error.message,
      path: req.path
    });
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
};
const workspaceOwner = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  if (req.user.role !== 'workspace_owner' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Workspace owner or admin access required' });
  }
  return next();
};
module.exports = { auth, admin, workspaceOwner };