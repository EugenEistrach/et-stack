# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install bun
RUN npm install -g bun

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

RUN apt-get update -qq && \
  apt-get install -y ca-certificates && \
  update-ca-certificates

# Install node modules
COPY package.json ./

# Install dependencies with Bun
RUN bun install

# Copy application code
COPY . .

# Build application
RUN bun run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Setup sqlite3 on a separate volume
RUN mkdir -p /data
VOLUME /data

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
ENV LOCAL_DATABASE_PATH="/data/sqlite.db"

CMD [ "bun", "run", "start" ]
