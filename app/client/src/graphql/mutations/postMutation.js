import { gql } from "@apollo/client";

export const CREATE_POST = gql`
  mutation CreatePost($userId: ID!, $postId: String!) {
    createPost(userId: $userId, postId: $postId) {
      id
    }
  }
`;
