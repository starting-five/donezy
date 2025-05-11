// File: server/graphql/mutations/userMutations.js
// Description: This file contains GraphQL mutations for creating a user.

const { gql } = require('apollo-server-express');

// Define GraphQL mutations for creating a user
const userMutations = gql`
  type Mutation {
    createUser(name: String!, username: String!, email: String!): User
    updateUserCompany(id: ID!, company: String!): User
  }
`;

module.exports = userMutations;
