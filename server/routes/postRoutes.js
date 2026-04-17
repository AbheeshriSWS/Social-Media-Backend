const express = require("express");
const router = express.Router();

const {
  createPost,
  getPosts,
  likePost,
  deletePost
} = require("../controllers/postController");

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

// Models (IMPORTANT for feed)
const User = require("../models/User");
const Post = require("../models/Post");

// create post (protected)
router.post("/", authMiddleware, upload.array("images", 10), createPost);
// get all posts
router.get("/", getPosts);

// like post
router.put("/like/:id", authMiddleware, likePost);

// delete post
router.delete("/:id", authMiddleware, deletePost);

router.get("/feed", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const following = user.following || [];

    const posts = await Post.find({
      user: { $in: [...following, userId] }
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const formattedPosts = posts.map(post => ({
      _id: post._id,
      content: post.content,
      images: post.images,   
      user: post.user,
      likesCount: post.likes.length,
      createdAt: post.createdAt
    }));

    // ✅ ONLY ONE RESPONSE
    res.json(formattedPosts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;