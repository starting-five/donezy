// File: server/index.js
// Description: This file sets up the Express server and Apollo Server for GraphQL.

// src/index.js
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

// Import the GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./graphql');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

async function startServer() {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Wait for the Apollo Server to start
  await server.start();

  // Apply Apollo Server middleware to Express app
  server.applyMiddleware({ app });
  
  // Health check endpoint
  app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

  // Start the Express server
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

const cors = require('cors');
app.use(cors({ origin: "http://localhost:3000" }));

const s3Routes = require('./routes/s3');
app.use(express.json()); // Needed for JSON body parsing
app.use('/api/s3', s3Routes);

// Start the Apollo Server and Express app
startServer();
