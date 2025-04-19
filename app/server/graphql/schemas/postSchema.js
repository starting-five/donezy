const { gql } = require('apollo-server-express');

// Define the User GraphQL type
const postSchema = gql`
scalar Date

  type Post {
    id: ID!
    userId: ID!  # Reference to the User ID
    postId: String!  # Reference to the Post ID
    timestamp: Date!  # Timestamp of the action
  }
`;

module.exports = postSchema;