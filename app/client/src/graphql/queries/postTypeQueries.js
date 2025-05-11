// File: client/src/graphql/queries/postTypeQueries.js
// Description: This file contains the GraphQL query for fetching post types by user ID from the database.

import { gql } from "@apollo/client";

export const GET_POST_TYPES_BY_USER_ID = gql`
  query GetPostTypesByUserId($userId: ID!) {
    getPostTypesByUserId(userId: $userId) {
      id
      title
      sections
    }
  }
`;
