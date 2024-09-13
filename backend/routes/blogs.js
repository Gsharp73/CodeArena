const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const publicBlogs = await db.collection('blogs').find({
      $or: [{ visibility: 'public' }, { visibility: { $exists: false } }]
    }).toArray();
    res.json(publicBlogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ error: 'An error occurred while fetching blogs' });
  }
});

module.exports = router;
