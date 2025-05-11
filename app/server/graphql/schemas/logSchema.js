// File: server/graphql/schemas/logSchema.js
// Description: This file contains the GraphQL schema for logs.

const { gql } = require('apollo-server-express');

// Define the Log GraphQL type
const logSchema = gql`
  type Log {
    id: ID!
    userId: ID!  # Reference to the User ID
    action: String!  # Action performed by the user
    timestamp: Date!  # Timestamp of the action
  }
`;

module.exports = logSchema;