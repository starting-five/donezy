// File: server/index.js
// Description: This file sets up the Express server and Apollo Server for GraphQL.

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const jwt = require("jsonwebtoken");
const jwksRsa = require("jwks-rsa");
const path = require('path');

// Import the GraphQL type definitions and resolvers
const { typeDefs, resolvers } = require('./graphql');

// Initialize Express app
const app = express();

// CORS and JSON middleware
app.use(cors());
app.use(express.json()); // Needed for JSON body parsing

// S3 routes
const s3Routes = require('./routes/s3');
app.use('/api/s3', s3Routes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const jwksClient = jwksRsa({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
});

function getKey(header, callback) {
  jwksClient.getSigningKey(header.kid, function (err, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function startServer() {
  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const auth = req.headers.authorization || "";
      let user = undefined;
      if (auth.startsWith("Bearer ")) {
        const token = auth.replace("Bearer ", "");
        try {
          user = await new Promise((resolve, reject) => {
            jwt.verify(
              token,
              getKey,
              {
                audience: process.env.AUTH0_AUDIENCE,
                issuer: `https://${process.env.AUTH0_DOMAIN}/`,
                algorithms: ["RS256"],
              },
              (err, decoded) => {
                if (err) return resolve(undefined);
                resolve(decoded);
              }
            );
          });
        } catch (e) {
          user = undefined;
        }
      }
      return { user };
    },
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

// Start the Apollo Server and Express app
startServer();
