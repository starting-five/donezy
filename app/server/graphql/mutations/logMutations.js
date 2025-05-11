// File: server/graphql/mutations/logMutations.js
// Description: This file contains GraphQL mutations for creating a log.

const { gql } = require("apollo-server-express");

// Define GraphQL mutations for creating a user
const logMutations = gql`
  type Mutation {
    createLog(userId: ID!, action: String!): Log
  }
`;

module.exports = logMutations;
