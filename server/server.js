const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

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