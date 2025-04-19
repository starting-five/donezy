// src/graphql/queries/userQueries.js
const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching posts
const postQueries = gql`
  type Query {
    getPostsByUserId(userId: ID!): [Post]
  }
`;

module.exports = postQueries;
