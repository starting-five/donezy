// src/graphql/queries/userQueries.js
const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching logs
const logQueries = gql`
  type Query {
    getLogs: [Log]
  }
`;

module.exports = logQueries;
