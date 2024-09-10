const express = require('express');
const router = express.Router();
const { admin } = require('../utils/checkadminmw');

router.post('/', async (req, res) => {
  try {
    const newBlog = req.body;
    const blogCollection = db.collection('blogs');
    const existingBlogs = await blogCollection.find({}).toArray();
    const isDuplicate = existingBlogs.find(blog => blog.title === newBlog.title);

    if (isDuplicate) {
      return res.status(400).json({ msg: "Blog title already exists" });
    }

    await blogCollection.insertOne(newBlog);
    return res.status(200).json({ msg: "Blog successfully added" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while adding the blog." });
  }
});

module.exports = router;
