// File: server/graphql/schemas/postTypeSchema.js
// Description: This file contains the GraphQL schema for post types.

const { gql } = require('apollo-server-express');

// Define the Post Type GraphQL type
const postTypeSchema = gql`
scalar Date

  type PostType {
    id: ID!
    userId: ID!  # Reference to the User ID
    title: String! 
    sections: [String]!
    timestamp: Date!  # Timestamp of the action
  }
`;

module.exports = postTypeSchema;