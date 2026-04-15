const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  followUser,
  unfollowUser, getUserProfile 
} = require("../controllers/userController");

router.get("/profile/:id", authMiddleware, getUserProfile);
router.put("/follow/:id", authMiddleware, followUser);
router.put("/unfollow/:id", authMiddleware, unfollowUser);

module.exports = router;