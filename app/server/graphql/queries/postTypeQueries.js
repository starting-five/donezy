// File: server/graphql/queries/postTypeQueries.js
// Description: This file contains GraphQL queries for fetching post types.

const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching post types
const postTypeQueries = gql`
  type Query {
    getPostTypesByUserId(userId: ID!): [PostType]
  }
`;

module.exports = postTypeQueries;
