const express = require('express');
const Rating = require('../models/Rating');
const auth = require('../middleware/auth');

const router = express.Router();

// ✅ Submit or update a store rating
router.post('/', auth, async (req, res) => {
  const { storeId, rating } = req.body;

  if (!storeId || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid rating input' });
  }

  try {
    const existing = await Rating.findOne({ store: storeId, user: req.user.userId });
    if (existing) {
      existing.rating = rating;
      await existing.save();
    } else {
      await Rating.create({ store: storeId, user: req.user.userId, rating });
    }
    res.status(200).json({ message: 'Rating submitted' });
  } catch (err) {
    console.error('Submit rating failed:', err.message);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
});

module.exports = router;
