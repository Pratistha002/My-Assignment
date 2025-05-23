// backend/middleware/auth.js
const jwt = require('jsonwebtoken');


const auth = (req, res, next) => {
  try {
    
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    const token = authHeader.replace('Bearer ', '').trim();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('JWT Auth Error:', err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = auth;
