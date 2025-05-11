// File: server/models/Log.js
// Description: This file contains the Mongoose schema and model for logs.

const mongoose = require('mongoose');

// Define the Log schema
const logSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,  // This is the reference to a user
      ref: 'User',  // Tells Mongoose which collection to reference
      required: true,
    },
    action: { 
      type: String, 
      required: true 
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  });

// Create and export the User model
module.exports = mongoose.model('Log', logSchema);
