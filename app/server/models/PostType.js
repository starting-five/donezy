// File: server/models/PostType.js
// Description: This file contains the Mongoose schema and model for post types.

const mongoose = require('mongoose');

// Define the PostType schema
const postTypeSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // This is the reference to a user
      ref: 'User',  // Tells Mongoose which collection to reference
      required: true,
    },
    title: { 
      type: String, 
      required: true 
    },
    sections: {
        type: [String],
        required: true,
        default: []
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

// Create and export the Post Type model
module.exports = mongoose.model('PostType', postTypeSchema);
