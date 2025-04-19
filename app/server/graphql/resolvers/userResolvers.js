// src/graphql/resolvers/userResolvers.js
const User = require('../../models/User');  // Import the User Mongoose model

const userResolvers = {
  Query: {
    getUsers: async () => {
      return await User.find();  // Fetch all users
    },

    getUserById: async (_, { id }) => {
      return await User.findById(id);  // Fetch a user by their ID
    },

    getUserByEmail: async (_, { email }) => {
      return await User.findOne({ email });  // Fetch a user by their email
    },
  },

  Mutation: {
    createUser: async (_, { name, username, email }) => {
      const newUser = new User({ name, username, email });  // Create a new user
      return await newUser.save();  // Save the user to the database
    },
  },
};

module.exports = userResolvers;
