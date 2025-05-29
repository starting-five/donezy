// File: server/models/Post.js
// Description: This file contains the Mongoose schema and model for posts.

const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // This is the reference to a user
    ref: "User", // Tells Mongoose which collection to reference
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  postTypeId: {
    type: mongoose.Schema.Types.ObjectId, // This is the reference to a post type
    ref: "PostType", // Tells Mongoose which collection to reference
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: String,
    required: false,
  },
  internalMemo: {
    type: String,
    required: false,
  },
});

// Create and export the Post model
module.exports = mongoose.model("Post", postSchema);
