const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const username = req.username;

  try {
    const privateNotes = await db.collection('blogs').find({
      username: username,
      visibility: 'private'
    }).toArray();
    res.json(privateNotes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'An error occurred while fetching notes' });
  }
});

module.exports = router;
