// File: server/graphql/mutations/postTypeMutations.js
// Description: This file contains GraphQL mutations for creating a post type.

const { gql } = require("apollo-server-express");

// Define GraphQL mutations for creating a post
const postTypeMutations = gql`
  type Mutation {
    createPostType(userId: ID!, title: String!, sections: [String]!): PostType
  }
`;

module.exports = postTypeMutations;
