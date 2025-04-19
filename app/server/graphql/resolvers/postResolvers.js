const Post = require('../../models/Post');  // Import the Post model

const postResolvers = {
  Query: {
    getPostsByUserId: async (_, { userId }) => {
      return await Post.find({ userId });  // Fetch posts by user ID
    },
  },

  Mutation: {
    createPost: async (_, { userId, postId }) => {
      const newPost = new Post({ userId, postId });  // Create a new post
      return await newPost.save();  // Save the post to the database
    },
  },
};

module.exports = postResolvers;
