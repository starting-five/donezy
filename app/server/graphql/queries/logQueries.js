// File: server/graphql/queries/logQueries.js
// Description: This file contains GraphQL queries for fetching logs.

const { gql } = require('apollo-server-express');

// Define GraphQL queries for fetching logs
const logQueries = gql`
  type Query {
    getLogs(first: Int, after: String): [Log]
  }
`;

module.exports = logQueries;
