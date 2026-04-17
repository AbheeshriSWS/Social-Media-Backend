const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
const path = require("path");

const app = express();
// WITH THIS
app.use(cors({
  origin: ["https://social-media-frontend-red.vercel.app", "http://localhost:5173"],
  credentials: true
}));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

const postRoutes = require("./routes/postRoutes");
app.use("/api/posts", postRoutes);

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// DB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.post("/api/test-post", authMiddleware, upload.array("images", 10), (req, res) => {
  res.json({
    body: req.body,
    files: req.files,
    user: req.user
  });
});