const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const databaseProblem = await db.collection('blogs').find({}).toArray();
  res.json(databaseProblem);
})

module.exports = router;