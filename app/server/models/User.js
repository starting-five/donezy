// File: server/models/User.js
// Description: This file contains the Mongoose schema and model for users.

const mongoose = require('mongoose');

// Define the User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: false,
  }
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
