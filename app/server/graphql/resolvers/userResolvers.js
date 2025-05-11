// File: server/graphql/resolvers/userResolvers.js
// Description: This file contains GraphQL resolvers for user-related queries and mutations.

const User = require('../../models/User');  // Import the User Mongoose model

const userResolvers = {
  Query: {
    getUsers: async () => {
      return await User.find();  // Fetch all users
    },

    getUserById: async (_, { id }) => {
      return await User.findOne(id);  // Fetch a user by their ID
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
    updateUserCompany: async (_, { id, company }) => {
      return await User.findByIdAndUpdate(
        id,
        { company },
        { new: true }  // Return the updated user
      );
    }
  },
};

module.exports = userResolvers;
