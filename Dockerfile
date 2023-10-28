# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/engine/reference/builder/

ARG NODE_VERSION=19.1.0

################################################################################
# Use node image for base image for all stages.
FROM node:${NODE_VERSION}-alpine as base

ARG DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres

# Set DATABASE_URL as an environment variable
ENV DATABASE_URL=$DATABASE_URL

# Set working directory for all build stages.
WORKDIR /usr/src/app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.yarn to speed up subsequent builds.
# Leverage bind mounts to package.json and yarn.lock to avoid having to copy them
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production=false --frozen-lockfile

# Copy the rest of the source files into the image.
COPY . .

# Prisma commands
RUN yarn prisma generate


# Run the start script.
CMD ["yarn", "start:dev"]