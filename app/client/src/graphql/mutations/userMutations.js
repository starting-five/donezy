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