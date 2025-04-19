// src/graphql/mutations/userMutations.js
const { gql } = require("apollo-server-express");

// Define GraphQL mutations for creating a user
const logMutations = gql`
  type Mutation {
    createLog(userId: ID!, action: String!): Log
  }
`;

module.exports = logMutations;
