// File: src/graphql/index.js
// Description: This file serves as the entry point for GraphQL schema and resolvers.

const { gql } = require('apollo-server-express');

// Import GraphQL type definitions and resolvers
const commonSchema = require('./schemas/commonSchema');
const userSchema = require('./schemas/userSchema');
const userQueries = require('./queries/userQueries');
const userMutations = require('./mutations/userMutations');
const userResolvers = require('./resolvers/userResolvers');
const logSchema = require('./schemas/logSchema');
const logQueries = require('./queries/logQueries');
const logMutations = require('./mutations/logMutations');
const logResolvers = require('./resolvers/logResolvers');
const postSchema = require('./schemas/postSchema');
const postQueries = require('./queries/postQueries');
const postMutations = require('./mutations/postMutations');
const postResolvers = require('./resolvers/postResolvers')
const postTypeSchema = require('./schemas/postTypeSchema');
const postTypeQueries = require('./queries/postTypeQueries');
const postTypeMutations = require('./mutations/postTypeMutations');
const postTypeResolvers = require('./resolvers/postTypeResolvers');

// Combine schema definitions (types, queries, mutations)
const typeDefs = gql`
  ${commonSchema}
  ${userSchema}
  ${userQueries}
  ${userMutations}
  ${logSchema}
  ${logQueries}
  ${logMutations}
  ${postSchema}
  ${postQueries}
  ${postMutations}
  ${postTypeSchema}
  ${postTypeQueries}
  ${postTypeMutations}
`;

// Combine resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...logResolvers.Query,
    ...postResolvers.Query,
    ...postTypeResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...logResolvers.Mutation,
    ...postResolvers.Mutation,
    ...postTypeResolvers.Mutation
  },
  Post: {
    ...postResolvers.Post
  }
};

module.exports = { typeDefs, resolvers };
