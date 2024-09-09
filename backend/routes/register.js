const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Request received");

    const { email } = req.body;

    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    await db.collection('users').insertOne(req.body);

    return res.status(201).json({ msg: 'User registration successful' });

  } catch (error) {
    console.error("Error in user registration:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
