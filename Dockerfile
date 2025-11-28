# DreamNet Cloud Run Dockerfile
# Multi-stage build for optimized production image

# ============================================================================
# Stage 1: Builder - Install dependencies and build all apps
# ============================================================================
# Pinned to SHA256 digest for supply-chain security (prevents image tampering)
FROM node:20-slim@sha256:fbb357f69d05c97333855b0846e4ef65462409728312df3c9ff12c941741c0a5 AS builder

# Install pnpm
RUN npm install -g pnpm@10.21.0

# Set working directory
WORKDIR /app

# Set CI=true for pnpm in Docker (prevents TTY prompts)
ENV CI=true

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/
COPY client/package.json ./client/
COPY apps/admin-dashboard/package.json ./apps/admin-dashboard/

# Install all dependencies (including dev dependencies for building)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Reinstall to ensure workspace links are properly set up after copying source
# CI=true is already set above
RUN pnpm install --frozen-lockfile

# Build Admin Dashboard (skip if fails - not critical for main deployment)
ENV NODE_PATH=/app/node_modules
WORKDIR /app/apps/admin-dashboard
RUN (/app/node_modules/.bin/vite build) || (echo "Admin dashboard build skipped - continuing..." && mkdir -p dist && touch dist/.keep)
WORKDIR /app

# Build main frontend (client) - optional, can be skipped if not needed
# Create dist directory first, then try to build (so directory always exists)
RUN mkdir -p /app/client/dist
RUN (cd /app && pnpm --filter client build) || (echo "Client build skipped - continuing..." && mkdir -p /app/client/dist && touch /app/client/dist/.keep)

# Build backend (optional - we can use tsx in production)
RUN (cd /app && pnpm --filter server build) || echo "Server build skipped, will use tsx"

# ============================================================================
# Stage 2: Runtime - Production image with only necessary files
# ============================================================================
# Pinned to SHA256 digest for supply-chain security (prevents image tampering)
FROM node:20-slim@sha256:fbb357f69d05c97333855b0846e4ef65462409728312df3c9ff12c941741c0a5 AS runtime

# Install pnpm
RUN npm install -g pnpm@10.21.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/

# Copy necessary packages FIRST (workspace dependencies need to exist before install)
COPY packages ./packages

# Install all dependencies (including dev dependencies for tsx)
# Note: We need tsx for running TypeScript directly in production
RUN pnpm install --frozen-lockfile

# Copy built frontend assets from builder
COPY --from=builder /app/apps/admin-dashboard/dist ./apps/admin-dashboard/dist
# Client dist is optional - directory always exists in builder (even if empty)
RUN mkdir -p ./client/dist
COPY --from=builder /app/client/dist ./client/dist

# Copy server source code (we'll use tsx to run TypeScript directly)
COPY server ./server

# Copy shared schema/types from builder
COPY --from=builder /app/shared ./shared/

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Set environment variables for fast startup
ENV NODE_ENV=production
ENV PORT=8080
ENV INIT_SUBSYSTEMS=false
ENV INIT_HEAVY_SUBSYSTEMS=false
ENV MESH_AUTOSTART=false

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server using tsx (runs TypeScript directly, no compilation needanother thing id like to devote some attention rral qed)
# Copy tsconfig files so tsx can resolve @shared/* aliases
COPY --from=builder /app/tsconfig.base.json ./tsconfig.base.json
COPY --from=builder /app/server/tsconfig.json ./server/tsconfig.json
WORKDIR /app
# Use tsx directly with tsconfig - tsx 4.x should resolve paths automatically
CMD ["/app/node_modules/.bin/tsx", "--tsconfig", "tsconfig.base.json", "server/index.ts"]
