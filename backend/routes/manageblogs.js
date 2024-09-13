const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');

router.post('/', async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({ msg: "Blog ID is required" });
    }

    const blogCollection = db.collection('blogs');

    const blog = await blogCollection.findOne({ _id: new ObjectId(blogId) });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    await blogCollection.deleteOne({ _id: new ObjectId(blogId) });

    return res.status(200).json({ msg: "Blog successfully deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while deleting the blog." });
  }
});

module.exports = router;
