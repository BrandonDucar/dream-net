FROM node:20-alpine AS base

# 1. Prune the Monorepo
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
# Prune: Generate a minimal subset of the monorepo for @dreamnet/server
RUN turbo prune --scope=@dreamnet/server --docker

# 2. Install Dependencies
FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm

# Copy the pruned lockfiles and package.jsons
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies (frozen lockfile for speed/consistency)
RUN pnpm install --frozen-lockfile

# 3. Build Source
# Copy the pruned source code
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Build only the server and its dependencies
RUN pnpm turbo build --filter=@dreamnet/server...

# 4. Production Runner
FROM base AS runner
WORKDIR /app

# Security: Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 dreamnet
USER dreamnet

# Copy the built application from the installer stage
COPY --from=installer --chown=dreamnet:nodejs /app .

# Expose Port
EXPOSE 8080

# Start command (adjust path if needed based on pruning structure)
CMD ["node", "server/dist/index.js"]
