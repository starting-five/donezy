const mongoose = require('mongoose');

// Define the Post schema
const postSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // This is the reference to a user
      ref: 'User',  // Tells Mongoose which collection to reference
      required: true,
    },
    postId: { 
      type: String, 
      required: true 
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

// Create and export the Post model
module.exports = mongoose.model('Post', postSchema);
