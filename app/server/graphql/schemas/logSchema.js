const { gql } = require('apollo-server-express');

// Define the User GraphQL type
const logSchema = gql`
scalar Date

  type Log {
    id: ID!
    userId: ID!  # Reference to the User ID
    action: String!  # Action performed by the user
    timestamp: Date!  # Timestamp of the action
  }
`;

module.exports = logSchema;