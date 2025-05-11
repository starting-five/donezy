// File: client/src/graphql/mutations/logMutations.js
// Description: This file contains the GraphQL mutation for creating a log entry in the database.

import { gql } from "@apollo/client";

export const CREATE_LOG = gql`
  mutation CreateLog($userId: ID!, $action: String!) {
    createLog(userId: $userId, action: $action) {
      id
    }
  }
`;
