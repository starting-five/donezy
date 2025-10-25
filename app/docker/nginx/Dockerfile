# docker/nginx/Dockerfile

### Build the React client
FROM node:20 AS client-builder
WORKDIR /client
COPY ../../client/package*.json ./
RUN npm ci
# Copy the rest of the client source
COPY ../../client ./
# Build final production static files into /client/build
RUN npm run build

### Final nginx image
FROM nginx:stable-alpine
# Remove default config and use our config
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built client files into nginx html directory
COPY --from=client-builder /client/build /usr/share/nginx/html

# Expose ports 80 and 443
EXPOSE 80 443

# nginx starts by default
