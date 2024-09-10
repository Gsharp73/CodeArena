const express = require('express');
const router = express.Router();
const { auth } = require('../utils/authenticate');

router.get('/:id', auth, async (req, res) => {
  try {
    const problemsCollection = await db.collection('problems').find({}).toArray();
    const problemId = req.params.id;
    const selectedProblem = problemsCollection.find(problem => problem.title === problemId);
    if (selectedProblem) {
      res.status(200).json(selectedProblem);
    } 
    else {
      res.status(404).send("Problem not found");
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the problem." });
  }
});

module.exports = router;
