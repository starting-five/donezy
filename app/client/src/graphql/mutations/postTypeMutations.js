// File: client/src/graphql/mutations/postTypeMutations.js
// Description: This file contains the GraphQL mutation for creating a post type in the database.

import { gql } from "@apollo/client";

export const CREATE_POST_TYPE = gql`
  mutation CreatePostType($userId: ID!, $title: String!, $sections: [String]!) {
    createPostType(userId: $userId, title: $title, sections: $sections) {
      id
      userId
      title
      sections
    }
  }
`;
