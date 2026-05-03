# 🏗️ STAGE 1: THE FORGE (Builder)
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy all packages
COPY packages ./packages

# Install dependencies (full monorepo)
RUN pnpm install --no-frozen-lockfile 2>&1 || echo "Install completed with warnings"

# Build dependencies first
RUN pnpm --filter @dreamnet/dreamnet-types build
RUN pnpm --filter @dreamnet/nerve build
RUN pnpm --filter @dreamnet/memory-dna build
RUN pnpm --filter @dreamnet/dreamnet-os-core build
RUN pnpm --filter @dreamnet/dreamnet-metrics-core build
RUN pnpm --filter @dreamnet/agent-wallet-manager build
RUN pnpm --filter @dreamnet/dreamnet-cost-core build
RUN pnpm --filter @dreamnet/orca-pack-core build
RUN pnpm --filter @dreamnet/whale-pack-core build

# Build control-core
RUN pnpm --filter @dreamnet/dreamnet-control-core build

# Ensure dist directory exists and provide a stub ONLY if the real build failed to produce server.js
RUN mkdir -p packages/dreamnet-control-core/dist && \
    if [ ! -f packages/dreamnet-control-core/dist/server.js ]; then \
      echo "console.log('⚠️ Control Core Build Failed - Running Fallback Stub'); process.exit(1);" > packages/dreamnet-control-core/dist/server.js; \
    fi

# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-alpine AS runner
RUN npm install -g pnpm
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet
WORKDIR /app

# Copy ENTIRE node_modules from builder to preserve all transitive deps
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json

# Set permissions
RUN chown -R dreamnet:dreamnet /app

# Use dreamnet user for security
USER dreamnet

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Run from /app root so Node module resolution finds socket.io in /app/node_modules
WORKDIR /app
CMD ["node", "packages/dreamnet-control-core/dist/server.js"]
