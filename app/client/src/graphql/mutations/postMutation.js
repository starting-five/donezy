// File: client/src/graphql/mutations/postMutation.js
// Description: This file contains the GraphQL mutation for creating a post in the database.

import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($userId: ID!, $postId: String!, $postTypeId: ID!, $comments: String, $internalMemo: String) {
    createPost(userId: $userId, postId: $postId, postTypeId: $postTypeId, comments: $comments, internalMemo: $internalMemo) {
      id
    }
  }
`;
