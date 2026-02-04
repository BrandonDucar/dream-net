# 🏗️ STAGE 1: THE FORGE (Builder)
FROM node:20-slim AS builder
RUN npm install -g pnpm && apt-get update && apt-get install -y python3 make g++ libffi-dev
WORKDIR /app

# Copy Configs
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy Package Manifests (For Dependency Cache)
COPY packages/organs/skeletal/dreamnet-types/package.json ./packages/organs/skeletal/dreamnet-types/
COPY packages/organs/endocrine/dreamnet-control-core/package.json ./packages/organs/endocrine/dreamnet-control-core/
COPY packages/organs/skeletal/lib/package.json ./packages/organs/skeletal/lib/
COPY packages/organs/skeletal/shared/package.json ./packages/organs/skeletal/shared/
COPY packages/organs/immune/dreamnet-snail-core/package.json ./packages/organs/immune/dreamnet-snail-core/
COPY packages/organs/nervous/sensory-spikes/package.json ./packages/organs/nervous/sensory-spikes/


# Install Dependencies
RUN pnpm install --frozen-lockfile

# Copy Source Code
COPY packages/organs/skeletal/dreamnet-types ./packages/organs/skeletal/dreamnet-types
COPY packages/organs/endocrine/dreamnet-control-core ./packages/organs/endocrine/dreamnet-control-core
COPY packages/organs/skeletal/lib ./packages/organs/skeletal/lib
COPY packages/organs/skeletal/shared ./packages/organs/skeletal/shared
COPY packages/organs/immune/dreamnet-snail-core ./packages/organs/immune/dreamnet-snail-core
COPY packages/organs/nervous/sensory-spikes ./packages/organs/nervous/sensory-spikes


# Build The Spine (Order Matters)
# 1. Base Layers
WORKDIR /app/packages/organs/skeletal/dreamnet-types
RUN pnpm build
WORKDIR /app/packages/organs/skeletal/lib
RUN pnpm build || echo "Lib build skipped"
WORKDIR /app/packages/organs/skeletal/shared
RUN pnpm build || echo "Shared build skipped"


# 2. Advanced Layers (Shield & Senses)
WORKDIR /app/packages/organs/immune/dreamnet-snail-core
RUN pnpm build
WORKDIR /app/packages/organs/nervous/sensory-spikes
RUN pnpm build
WORKDIR /app/packages/organs/endocrine/dreamnet-control-core
RUN pnpm build


# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-slim AS runner

WORKDIR /app

# Harden System
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet

# Install Production Deps
COPY --from=builder /app/node_modules ./node_modules

# Copy Artifacts (All Dependencies)
COPY --from=builder /app/packages/organs/skeletal/dreamnet-types/dist ./packages/organs/skeletal/dreamnet-types/dist
COPY --from=builder /app/packages/organs/skeletal/dreamnet-types/package.json ./packages/organs/skeletal/dreamnet-types/

COPY --from=builder /app/packages/organs/skeletal/lib/dist ./packages/organs/skeletal/lib/dist
COPY --from=builder /app/packages/organs/skeletal/lib/package.json ./packages/organs/skeletal/lib/

COPY --from=builder /app/packages/organs/skeletal/shared/dist ./packages/organs/skeletal/shared/dist
COPY --from=builder /app/packages/organs/skeletal/shared/package.json ./packages/organs/skeletal/shared/

COPY --from=builder /app/packages/organs/immune/dreamnet-snail-core/dist ./packages/organs/immune/dreamnet-snail-core/dist
COPY --from=builder /app/packages/organs/immune/dreamnet-snail-core/package.json ./packages/organs/immune/dreamnet-snail-core/

COPY --from=builder /app/packages/organs/nervous/sensory-spikes/dist ./packages/organs/nervous/sensory-spikes/dist
COPY --from=builder /app/packages/organs/nervous/sensory-spikes/package.json ./packages/organs/nervous/sensory-spikes/

COPY --from=builder /app/packages/organs/endocrine/dreamnet-control-core/dist ./packages/organs/endocrine/dreamnet-control-core/dist
COPY --from=builder /app/packages/organs/endocrine/dreamnet-control-core/package.json ./packages/organs/endocrine/dreamnet-control-core/


# Set Permissions
RUN chown -R dreamnet:dreamnet /app

# Switch to Sovereign User
USER dreamnet

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Wake the Cortex
WORKDIR /app/packages/organs/endocrine/dreamnet-control-core

CMD ["node", "dist/server.js"]
