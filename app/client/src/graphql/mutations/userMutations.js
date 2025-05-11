// File: client/src/graphql/mutations/userMutations.js
// Description: This file contains the GraphQL mutations for creating a user and updating a user's company in the database.

import { gql } from '@apollo/client';

export const CREATE_USER = gql`
  mutation CreateUser($name: String!, $username: String!, $email: String!) {
    createUser(name: $name, username: $username, email: $email) {
      id
      name
      username
      email
    }
  }
`;

export const UPDATE_USER_COMPANY = gql`
  mutation UpdateUserCompany($id: ID!, $company: String!) {
    updateUserCompany(id: $id, company: $company) {
      id
      name
      username
      email
      company
    }
  }
`;