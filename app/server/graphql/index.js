// src/graphql/index.js
const { gql } = require('apollo-server-express');

// Import GraphQL type definitions and resolvers
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

// Combine schema definitions (types, queries, mutations)
const typeDefs = gql`
  ${userSchema}
  ${userQueries}
  ${userMutations}
  ${logSchema}
  ${logQueries}
  ${logMutations}
  ${postSchema}
  ${postQueries}
  ${postMutations}
`;

// Combine resolvers
const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...logResolvers.Query,
    ...postResolvers.Query
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...logResolvers.Mutation,
    ...postResolvers.Mutation
  }
};

module.exports = { typeDefs, resolvers };
