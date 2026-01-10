# 🏗️ STAGE 1: THE FORGE (Builder)
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy Configs
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/dreamnet-control-core/package.json ./packages/dreamnet-control-core/
COPY packages/dreamnet-types/package.json ./packages/dreamnet-types/

# Install Dependencies (Frozen for Security)
RUN pnpm install --frozen-lockfile

# Copy Source
COPY packages/dreamnet-types ./packages/dreamnet-types
COPY packages/dreamnet-control-core ./packages/dreamnet-control-core

# Build The Spine (Types First)
WORKDIR /app/packages/dreamnet-types
RUN pnpm build

# Build The Cortex (Control Core)
WORKDIR /app/packages/dreamnet-control-core
RUN pnpm build

# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-alpine AS runner
WORKDIR /app

# Harden System: Run as non-root
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet

# Install Production Deps Only (To keep image small)
# Note: In a monorepo this can be tricky, typically we copy node_modules from builder
# or prune. For stability, we copy the built artifacts and node_modules for now.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/dreamnet-control-core/dist ./packages/dreamnet-control-core/dist
COPY --from=builder /app/packages/dreamnet-control-core/package.json ./packages/dreamnet-control-core/
COPY --from=builder /app/packages/dreamnet-types/dist ./packages/dreamnet-types/dist
COPY --from=builder /app/packages/dreamnet-types/package.json ./packages/dreamnet-types/

# Copy Environment (Will be overridden by Docker Compose / Secret Injection)
# COPY .env .env  <-- NEVER COPY .ENV IN PRODUCTION IMAGE

# Set Permissions
RUN chown -R dreamnet:dreamnet /app

# Switch to Sovereign User
USER dreamnet

# Environment Optimization
ENV NODE_ENV=production
ENV PORT=3000

# Wake the Cortex
WORKDIR /app/packages/dreamnet-control-core
CMD ["node", "dist/server.js"]
