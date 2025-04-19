import { gql } from "@apollo/client";

export const CREATE_LOG = gql`
  mutation CreateLog($userId: ID!, $action: String!) {
    createLog(userId: $userId, action: $action) {
      id
    }
  }
`;
