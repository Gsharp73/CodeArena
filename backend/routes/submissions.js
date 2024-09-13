const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const submissions = await db.collection('submissions').find({}).toArray();
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
