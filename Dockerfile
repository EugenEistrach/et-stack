# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20
FROM oven/bun:1.2.2 as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install dependencies
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --prod=false

# Build the app
COPY . .
RUN bun run build

# Remove dev dependencies
RUN bun install --frozen-lockfile --prod

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV LOCAL_DATABASE_PATH="/data/sqlite.db"

# Start the app
CMD [ "bun", "run", "start" ]
