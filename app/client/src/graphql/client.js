import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
    cache: new InMemoryCache(),
});

export default client;
// This code sets up an Apollo Client instance for interacting with a GraphQL server.
// It specifies the server's URI and uses an in-memory cache for storing query results.
// The client can be used to send queries and mutations to the server and manage the application's state.
// The `ApolloClient` is a powerful tool for managing GraphQL data in a React application.
// It allows you to easily fetch, cache, and update data in your application.
// The `InMemoryCache` is a built-in cache implementation that stores query results in memory.
// This is useful for optimizing performance and reducing the number of network requests.
// The `uri` property specifies the URL of the GraphQL server that the client will communicate with.
// In this case, it is set to 'http://localhost:4000/graphql', which is a common URL for local development.
// You can replace this with the actual URL of your GraphQL server in production.
// The `client` instance can be used in your React components to send queries and mutations.            