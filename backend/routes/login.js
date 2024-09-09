require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretToken = process.env.SECRET_TOKEN;

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await db.collection('users').find({}).toArray();
    const admins = await db.collection('admins').find({}).toArray();

    const foundAdmin = admins.find(admin => admin.email === email);
    if (foundAdmin && foundAdmin.password === password) {
      const token = jwt.sign({ id: email, access: "admin" }, secretToken);
      return res.status(200).json({ token });
    }

    const foundUser = users.find(user => user.email === email);
    if (foundUser && foundUser.password === password) {
      const token = jwt.sign({ id: email, access: "user" }, secretToken);
      return res.status(200).json({ token });
    }
    res.status(401).json({ msg: "User Not Found or Incorrect Password" });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;