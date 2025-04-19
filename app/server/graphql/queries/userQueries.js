// src/graphql/queries/userQueries.js
const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching users
const userQueries = gql`
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User,
    getUserByEmail(email: String!): User
  }
`;

module.exports = userQueries;
