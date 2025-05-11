// File: server/graphql/resolvers/logResolvers.js
// Description: This file contains GraphQL resolvers for logs.

const Log = require('../../models/Log');  // Import the Log Mongoose model

const logResolvers = {
  Query: {
    getLogs: async (_, { first = 10, after }) => {
      const query = after ? { timestamp: { $lt: new Date(after) } } : {};
      // Sort by timestamp descending to get the most recent logs first
      const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .limit(first);
      return logs;
    },
  },

  Mutation: {
    createLog: async (_, { userId, action }) => {
      const newLog = new Log({ userId, action });
      return await newLog.save();
    },
  },
};

module.exports = logResolvers;
