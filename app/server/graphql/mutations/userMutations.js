// src/graphql/mutations/userMutations.js
const { gql } = require('apollo-server-express');

// Define GraphQL mutations for creating a user
const userMutations = gql`
  type Mutation {
    createUser(name: String!, username: String!, email: String!): User
  }
`;

module.exports = userMutations;
