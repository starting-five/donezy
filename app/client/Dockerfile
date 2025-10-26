# # Build stage
# FROM node:18 AS build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build


# client/Dockerfile
# official build of all files, to serve static content
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Build the production static files
RUN npm run build