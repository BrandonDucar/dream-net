# 🏗️ STAGE 1: THE FORGE (Builder)
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy Configs
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy Package Manifests (For Dependency Cache)
COPY packages/dreamnet-types/package.json ./packages/dreamnet-types/
COPY packages/dreamnet-control-core/package.json ./packages/dreamnet-control-core/
COPY packages/lib/package.json ./packages/lib/
COPY packages/shared/package.json ./packages/shared/
COPY packages/dreamnet-snail-core/package.json ./packages/dreamnet-snail-core/
COPY packages/sensory-spikes/package.json ./packages/sensory-spikes/

# Install Dependencies
RUN pnpm install --frozen-lockfile

# Copy Source Code
COPY packages/dreamnet-types ./packages/dreamnet-types
COPY packages/dreamnet-control-core ./packages/dreamnet-control-core
COPY packages/lib ./packages/lib
COPY packages/shared ./packages/shared
COPY packages/dreamnet-snail-core ./packages/dreamnet-snail-core
COPY packages/sensory-spikes ./packages/sensory-spikes

# Build The Spine (Order Matters)
# 1. Base Layers
WORKDIR /app/packages/dreamnet-types
RUN pnpm build
WORKDIR /app/packages/lib
RUN pnpm build || echo "Lib build skipped"
WORKDIR /app/packages/shared
RUN pnpm build || echo "Shared build skipped"

# 2. Advanced Layers (Shield & Senses)
WORKDIR /app/packages/dreamnet-snail-core
RUN pnpm build
WORKDIR /app/packages/sensory-spikes
RUN pnpm build

# 3. The Cortex (Control Core)
WORKDIR /app/packages/dreamnet-control-core
RUN pnpm build

# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-alpine AS runner
WORKDIR /app

# Harden System
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet

# Install Production Deps
COPY --from=builder /app/node_modules ./node_modules

# Copy Artifacts (All Dependencies)
COPY --from=builder /app/packages/dreamnet-types/dist ./packages/dreamnet-types/dist
COPY --from=builder /app/packages/dreamnet-types/package.json ./packages/dreamnet-types/

COPY --from=builder /app/packages/lib/dist ./packages/lib/dist
COPY --from=builder /app/packages/lib/package.json ./packages/lib/

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

COPY --from=builder /app/packages/dreamnet-snail-core/dist ./packages/dreamnet-snail-core/dist
COPY --from=builder /app/packages/dreamnet-snail-core/package.json ./packages/dreamnet-snail-core/

COPY --from=builder /app/packages/sensory-spikes/dist ./packages/sensory-spikes/dist
COPY --from=builder /app/packages/sensory-spikes/package.json ./packages/sensory-spikes/

COPY --from=builder /app/packages/dreamnet-control-core/dist ./packages/dreamnet-control-core/dist
COPY --from=builder /app/packages/dreamnet-control-core/package.json ./packages/dreamnet-control-core/

# Set Permissions
RUN chown -R dreamnet:dreamnet /app

# Switch to Sovereign User
USER dreamnet

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Wake the Cortex
WORKDIR /app/packages/dreamnet-control-core
CMD ["node", "dist/server.js"]
