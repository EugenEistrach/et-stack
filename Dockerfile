# syntax = docker/dockerfile:1

# Use the official Bun image
FROM oven/bun:1 as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
  apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

RUN apt-get update -qq && \
  apt-get install -y ca-certificates && \
  update-ca-certificates

# Install node modules
COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile --production=false

# Copy application code
COPY . .

# Build application
RUN bun run build

# Remove development dependencies
RUN bun install --production


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
