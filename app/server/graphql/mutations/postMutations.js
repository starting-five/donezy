const { gql } = require("apollo-server-express");

// Define GraphQL mutations for creating a post
const postMutations = gql`
  type Mutation {
    createPost(userId: ID!, postId: String!): Post
  }
`;

module.exports = postMutations;
