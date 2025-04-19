// src/graphql/resolvers/userResolvers.js
const Log = require('../../models/Log');  // Import the User Mongoose model
const User = require('../../models/User');  // Import the User Mongoose model

const logResolvers = {
  Query: {
    getLogs: async () => {
      return await Log.find();  // Fetch all logs
    },
  },

  Mutation: {
    createLog: async (_, { userId, action }) => {
      const newLog = new Log({ userId, action });  // Create a new log
      return await newLog.save();  // Save the log to the database
    },
  },
};

module.exports = logResolvers;
