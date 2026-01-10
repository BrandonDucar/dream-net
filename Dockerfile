# Multi-Stage Dockerfile for DreamNet
# Stage 1: Build
FROM node:22-slim AS builder

# Install system dependencies
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only workspace-defining files first
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all source code (Nuclear option for monorepo stability)
COPY . .

# Install dependencies (no-frozen-lockfile to handle workspace changes)
RUN pnpm install --no-frozen-lockfile





# -----------------------------------------------------------------------------
# Sovereign Integration: Recursive Topological Build
# -----------------------------------------------------------------------------

# Build everything from foundations up to the server core
RUN pnpm --filter "...@dreamnet/server" build

# Build everything from foundations up to the client core
RUN pnpm --filter "...@dreamnet/client" build

# -----------------------------------------------------------------------------

# Build Frontend
WORKDIR /app/packages/client
ENV VITE_API_URL=/api
RUN pnpm run build

# Build Backend
WORKDIR /app/packages/server
RUN pnpm run build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

# Copy production artifacts from builder
COPY --from=builder /app/packages/server/dist ./server/dist
COPY --from=builder /app/packages/client/dist ./client/dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy package.jsons for runtime resolution if needed
COPY --from=builder /app/packages ./packages

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose Cloud Run port
EXPOSE 8080

# Start server
CMD ["node", "server/dist/index.js"]
