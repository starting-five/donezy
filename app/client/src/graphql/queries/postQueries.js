import { gql } from "@apollo/client";

export const GET_POSTS_BY_USER_ID = gql`
  query GetPostsByUserId($userId: ID!) {
    getPostsByUserId(userId: $userId) {
      userId
      postId
    }
  }
`;
