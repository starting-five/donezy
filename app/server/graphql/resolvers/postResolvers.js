// File: server/graphql/resolvers/postResolvers.js
// Description: This file contains GraphQL resolvers for handling post-related queries and mutations.

const { get } = require('mongoose');
const Post = require('../../models/Post');  // Import the Post model
const User = require('../../models/User');  // Import the User model
const PostType = require('../../models/PostType');  // Import the Post Type model

const postResolvers = {
  Query: {
    getPostsByUserId: async (_, { userId, first = 10, after }) => {
      const query = { userId };
      if (after) {
        query.timestamp = { $lt: new Date(after) };
      }
      const posts = await Post.find(query)
        .sort({ timestamp: -1 })
        .limit(first);
      return posts;
    },
    getPostByPostId: async (_, { postId }) => {
      const post = await Post.findOne({ postId });
      console.log("getPostByPostId called with", postId, "result:", post);
      return post;
    }
  },

  Mutation: {
    createPost: async (_, { userId, postId, postTypeId, comments }) => {
      const newPost = new Post({ userId, postId, postTypeId, comments });  // Create a new post
      return await newPost.save();  // Save the post to the database
    },
  },

  Post: {
    user: async (post) => {
      console.log("find user by id", post.userId);
      return await User.findById(post.userId);  // Fetch the user associated with the post
    },
    postType: async (post) => {
      return await PostType.findById(post.postTypeId);  // Fetch the post type associated with the post
    }
  }
};

module.exports = postResolvers;
