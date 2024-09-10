const express = require('express');
const router = express.Router();
const { admin } = require('../utils/checkadminmw');

router.post('/', admin, async (req, res) => {
  try {
    const newProblem = req.body;
    const problemCollection = db.collection('problems');
    const existingProblems = await problemCollection.find({}).toArray();
    const isduplicate = existingProblems.find(problem => problem.title === newProblem.title);
    
    if (isduplicate) {
      return res.status(400).json({ msg: "Problem title already exists" });
    }
    await problemCollection.insertOne(newProblem);
    return res.status(200).json({ msg: "Problem successfully added" });

  } catch (error) {
    return res.status(500).json({ error: "An error occurred while adding the problem." });
  }
});

module.exports = router;
