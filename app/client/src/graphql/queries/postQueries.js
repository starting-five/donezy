// File: client/src/graphql/queries/postQueries.js
// Description: This file contains the GraphQL queries for fetching posts by user ID and fetching a post by post ID from the database.

import { gql } from "@apollo/client";

export const GET_POSTS_BY_USER_ID = gql`
  query GetPostsByUserId($userId: ID!, $first: Int, $after: String) {
    getPostsByUserId(userId: $userId, first: $first, after: $after) {
      userId
      postId
      timestamp
      postType {
        id
        title
        sections
      }
    }
  }
`;

export const GET_POST_BY_POST_ID = gql`
  query GetPostByPostId($postId: ID!) {
    getPostByPostId(postId: $postId) {
      userId
      postTypeId
      comments
      user {
        id
        name
        email
      }
      postType {
        id
        title
        sections
      }
      timestamp
    }
  }
`;
