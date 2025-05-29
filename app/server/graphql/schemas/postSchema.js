// File: server/graphql/schemas/postSchema.js
// Description: This file contains the GraphQL schema for posts.

const { gql } = require('apollo-server-express');

// Define the Post GraphQL type
const postSchema = gql`
scalar Date

  type Post {
    id: ID!
    userId: ID!  # Reference to the User ID
    postId: String!  # Reference to the Post ID
    postTypeId: ID!  # Reference to the Post Type ID
    timestamp: Date!  # Timestamp of the action
    comments: String  # Optional comments for the post 
    user: User  # Reference to the User object
    postType: PostType  # Reference to the Post Type object
    internalMemo: String  # Optional internal memo for the post
  }
`;

module.exports = postSchema;