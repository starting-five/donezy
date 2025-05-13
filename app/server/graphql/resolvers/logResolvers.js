// File: server/graphql/resolvers/logResolvers.js
// Description: This file contains GraphQL resolvers for logs.

const Log = require('../../models/Log');  // Import the Log Mongoose model

const logResolvers = {
  Query: {
    getLogs: async (parent, { first = 10, after }, context) => {
      if (!context.user) throw new Error("Not authenticated");
      const query = after ? { timestamp: { $lt: new Date(after) } } : {};
      // Sort by timestamp descending to get the most recent logs first
      const logs = await Log.find(query)
        .sort({ timestamp: -1 })
        .limit(first);
      return logs;
    },
  },

  Mutation: {
    createLog: async (parent, { userId, action }, context) => {
      if (!context.user) throw new Error("Not authenticated");

      // Save the log with userId and action 
      const log = await Log.create({ userId, action, timestamp: new Date() });
      return log;
    },
  },
};

module.exports = logResolvers;
