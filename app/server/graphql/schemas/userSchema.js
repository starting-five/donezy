// src/graphql/schemas/userSchema.js
const { gql } = require('apollo-server-express');

// Define the User GraphQL type
const userSchema = gql`
  type User {
    id: ID!
    name: String!
    username: String!
    email: String!
  }
`;

module.exports = userSchema;
