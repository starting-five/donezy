// File: server/graphql/schemas/userSchema.js
// Description: This file contains the GraphQL schema for users.

const { gql } = require('apollo-server-express');

// Define the User GraphQL type
const userSchema = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
    company: String
  }
`;

module.exports = userSchema;
