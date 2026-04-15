const Comment = require("../models/Comment");

// ADD COMMENT
exports.addComment = async (req, res) => {
  try {
    const comment = new Comment({
      user: req.user.userId,
      post: req.params.postId,
      text: req.body.text
    });

    await comment.save();

    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments); // 🔥 IMPORTANT
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET COMMENTS OF A POST
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: "Comment not found" });
    }

    // optional: only owner can delete
    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await comment.deleteOne();

    res.json({ msg: "Comment deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};