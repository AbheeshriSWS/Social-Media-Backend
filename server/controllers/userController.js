const User = require("../models/User");
const Post = require("../models/Post");

// FOLLOW USER
const followUser = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ msg: "You cannot follow yourself" });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!user.following) user.following = [];
    if (!targetUser.followers) targetUser.followers = [];

    if (user.following.includes(targetUserId)) {
      return res.status(400).json({ msg: "Already following" });
    }

    user.following.push(targetUserId);
    targetUser.followers.push(currentUserId);

    await user.save();
    await targetUser.save();

    res.json({ msg: "Followed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UNFOLLOW USER
const unfollowUser = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const targetUserId = req.params.id;

    const userToUnfollow = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!userToUnfollow.followers) userToUnfollow.followers = [];
    if (!currentUser.following) currentUser.following = [];

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUserId
    );

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== targetUserId
    );

    await userToUnfollow.save();
    await currentUser.save();

    res.json({ msg: "User unfollowed" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET USER PROFILE
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const posts = await Post.find({ user: userId });

    res.json({
      user,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getUserProfile
};