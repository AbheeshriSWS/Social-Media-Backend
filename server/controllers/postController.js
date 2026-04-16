const Post = require("../models/Post");

// ================= CREATE POST =================
exports.createPost = async (req, res) => {
  console.log("CREATE POST HIT");

  try {
    const { content } = req.body;

    const post = await Post.create({
      user: req.user.userId,
      content: req.body.content,
      images: req.files ? req.files.map(file => `/uploads/${file.filename}`) : []
    });

    // 🔥 IMPORTANT: populate so frontend gets full user object
    await post.populate("user", "name email");

    res.json(post);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= GET ALL POSTS =================
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= LIKE / UNLIKE POST =================
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    post.likes = post.likes || [];

    const likes = post.likes.map(id => id.toString());
    const index = likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json({
      msg: index === -1 ? "Liked" : "Unliked",
      likesCount: post.likes.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ================= DELETE POST =================
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // 🔥 OWNER CHECK
    if (post.user.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await post.deleteOne();

    res.json({ msg: "Post deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};