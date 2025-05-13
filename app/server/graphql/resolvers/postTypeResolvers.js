// File: server/graphql/resolvers/postTypeResolvers.js
// Description: This file contains GraphQL resolvers for post types.

const PostType = require('../../models/PostType');  // Import the Post Type model

const postTypeResolvers = {
  Query: {
    getPostTypesByUserId: async (_, { userId }, context) => {
      if (!context.user) throw new Error("Not authenticated");
      return await PostType.find({ userId });  // Fetch post types by user ID
    },
  },

  Mutation: {
    createPostType: async (_, { userId, title, sections }, context) => {
      if (!context.user) throw new Error("Not authenticated");
      const newPostType = new PostType({ userId, title, sections });  // Create a new post type
      return await newPostType.save();  // Save the post type to the database
    },
  },
};

module.exports = postTypeResolvers;
