const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    content: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      default: []
    },
    likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
]
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);