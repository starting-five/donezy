// File: server/graphql/mutations/postMutations.js
// Description: This file contains GraphQL mutations for creating a post.

const { gql } = require("apollo-server-express");

// Define GraphQL mutations for creating a post
const postMutations = gql`
  type Mutation {
    createPost(userId: ID!, postId: String!, postTypeId: ID!, comments: String): Post
  }
`;

module.exports = postMutations;
