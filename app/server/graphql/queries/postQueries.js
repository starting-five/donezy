// File: server/graphql/queries/postQueries.js
// Description: This file contains GraphQL queries for fetching posts.

const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching posts
const postQueries = gql`
  type Query {
    getPostsByUserId(userId: ID!, first: Int, after: String): [Post]
    getPostByPostId(postId: ID!): Post
  }
`;

module.exports = postQueries;
