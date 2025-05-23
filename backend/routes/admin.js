const express = require('express');
const User = require('../models/User');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');

const router = express.Router();

// ✅ Only allow admin users
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};

// ✅ Dashboard stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// ✅ Get users with optional filters
router.get('/users', auth, isAdmin, async (req, res) => {
  const { name, email, address, role } = req.query;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (email) filter.email = { $regex: email, $options: 'i' };
  if (address) filter.address = { $regex: address, $options: 'i' };
  if (role) filter.role = role;

  try {
    const users = await User.find(filter).select('-password'); // hide password
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// ✅ Get stores with optional filters
router.get('/stores', auth, isAdmin, async (req, res) => {
  const { name, email, address } = req.query;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: 'i' };
  if (email) filter.email = { $regex: email, $options: 'i' };
  if (address) filter.address = { $regex: address, $options: 'i' };

  try {
    const stores = await Store.find(filter);
    const ratings = await Rating.aggregate([
      { $group: { _id: '$store', avgRating: { $avg: '$rating' } } }
    ]);

    const ratingMap = {};
    ratings.forEach(r => (ratingMap[r._id] = r.avgRating));

    const storeList = stores.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      address: s.address,
      averageRating: ratingMap[s._id] || null
    }));

    res.json(storeList);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
});

// ✅ Add a new user (admin or normal)
router.post('/users', auth, isAdmin, async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (!['admin', 'user', 'storeOwner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, address, role });
    await newUser.save();

    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user' });
  }
});

// ✅ EXPORT the router to fix crash!
module.exports = router;
