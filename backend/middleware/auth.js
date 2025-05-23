// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes and authenticate users
 */
const auth = (req, res, next) => {
  try {
    // Expect header like: Authorization: Bearer <token>
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to request object
    req.user = decoded; // e.g. { userId, role }
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
