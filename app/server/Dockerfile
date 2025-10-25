# server/Dockerfile
FROM node:20
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy source
COPY . .

# Expose the port your server runs on
EXPOSE 4000

# Use environment variables for sensitive config: MONGO_URI, JWT_SECRET, AUTH0_DOMAIN, etc.
CMD ["node", "dist/index.js"]
# or if you run with nodemon in dev: ["npm", "start"]
