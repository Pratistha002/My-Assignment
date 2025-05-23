const express = require('express');
const auth = require('../middleware/auth');
const Store = require('../models/Store');
const Rating = require('../models/Rating');
const router = express.Router();

// ✅ Get all stores + user's ratings + avg rating
router.get('/', auth, async (req, res) => {
  try {
    const stores = await Store.find();
    const ratings = await Rating.find({ user: req.user.userId });
    const allRatings = await Rating.find();

    // Map user ratings
    const userRatings = {};
    ratings.forEach(r => {
      userRatings[r.store] = r.rating;
    });

    // Map average ratings
    const avgMap = {};
    allRatings.forEach(r => {
      if (!avgMap[r.store]) avgMap[r.store] = [];
      avgMap[r.store].push(r.rating);
    });

    const storeData = stores.map(store => {
      const avgList = avgMap[store._id] || [];
      const avg = avgList.length ? avgList.reduce((a, b) => a + b, 0) / avgList.length : null;
      return {
        id: store._id,
        name: store.name,
        address: store.address,
        averageRating: avg,
      };
    });

    res.json({ stores: storeData, userRatings });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stores' });
  }
});

// ✅ Submit or update rating
router.post('/ratings', auth, async (req, res) => {
  const { storeId, rating } = req.body;
  try {
    const existing = await Rating.findOne({ store: storeId, user: req.user.userId });
    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      await Rating.create({ store: storeId, user: req.user.userId, rating });
    }
    res.json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

// ✅ Admin adds a new store
router.post('/', auth, async (req, res) => {
  const { role } = req.user;
  if (role !== 'admin') return res.status(403).json({ message: 'Only admin can add stores' });

  const { name, email, address, owner } = req.body;
  try {
    const store = new Store({ name, email, address, owner });
    await store.save();
    res.status(201).json({ message: 'Store created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create store' });
  }
});

// ✅ Store Owner: View ratings for their store(s)
router.get('/owner', auth, async (req, res) => {
  if (req.user.role !== 'storeOwner') {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const stores = await Store.find({ owner: req.user.userId });
    const data = [];

    for (const store of stores) {
      const ratings = await Rating.find({ store: store._id }).populate('user', 'name email');
      const avg = ratings.length
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : null;

      data.push({
        storeName: store.name,
        averageRating: avg,
        ratings: ratings.map(r => ({
          user: r.user.name,
          email: r.user.email,
          rating: r.rating
        }))
      });
    }

    res.json({ stores: data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load store owner dashboard' });
  }
});

module.exports = router; // ✅ Moved this to the end!
