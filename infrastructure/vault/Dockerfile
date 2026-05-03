# Library Vault Container
# Exposes the DreamNet Library Registry via Cloudflare Tunnels

FROM node:20-alpine

WORKDIR /app

# Copy essential files
COPY package.json pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY shared/ ./shared/
COPY server/ ./server/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Expose registry port
EXPOSE 3333

# Run the librarian service
# This service provides a REST API for the libraries table
CMD ["pnpm", "run", "start:vault"]
