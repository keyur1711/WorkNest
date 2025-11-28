const requireRole = (allowedRoles = []) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const normalizedRole = String(req.user.role || '').toLowerCase();
  const isAllowed = allowedRoles.map((role) => role.toLowerCase()).includes(normalizedRole);

  if (!isAllowed) {
    return res.status(403).json({ message: 'You do not have permission to perform this action' });
  }

  next();
};

module.exports = { requireRole };


