// File: server/graphql/schemas/commonSchema.js
// Description: This file contains common GraphQL schema definitions used across the application.

const { gql } = require('apollo-server-express');

const commonSchema = gql`
    scalar Date
`;

module.exports = commonSchema;