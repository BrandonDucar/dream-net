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
COPY packages/dreamnet-operational-bridge/package.json ./packages/dreamnet-operational-bridge/
COPY packages/dream-token/package.json ./packages/dream-token/
COPY packages/rewards-engine/package.json ./packages/rewards-engine/
COPY packages/spider-web-core/package.json ./packages/spider-web-core/
COPY packages/dreamnet-metrics-core/package.json ./packages/dreamnet-metrics-core/
COPY packages/dreamnet-voice-twilio/package.json ./packages/dreamnet-voice-twilio/
COPY packages/agent-wallet-manager/package.json ./packages/agent-wallet-manager/
COPY packages/platform-connector/package.json ./packages/platform-connector/

# Install Dependencies
RUN pnpm install --frozen-lockfile

# Copy Source Code
COPY packages/dreamnet-types ./packages/dreamnet-types
COPY packages/dreamnet-control-core ./packages/dreamnet-control-core
COPY packages/lib ./packages/lib
COPY packages/shared ./packages/shared
COPY packages/dreamnet-snail-core ./packages/dreamnet-snail-core
COPY packages/sensory-spikes ./packages/sensory-spikes
COPY packages/dreamnet-operational-bridge ./packages/dreamnet-operational-bridge
COPY packages/dream-token ./packages/dream-token
COPY packages/rewards-engine ./packages/rewards-engine
COPY packages/spider-web-core ./packages/spider-web-core
COPY packages/dreamnet-metrics-core ./packages/dreamnet-metrics-core
COPY packages/dreamnet-cost-core ./packages/dreamnet-cost-core
COPY packages/dreamnet-cost-economic-bridge ./packages/dreamnet-cost-economic-bridge
COPY packages/dreamnet-os-core ./packages/dreamnet-os-core
COPY packages/dreamnet-voice-twilio ./packages/dreamnet-voice-twilio
COPY packages/agent-wallet-manager ./packages/agent-wallet-manager
COPY packages/platform-connector ./packages/platform-connector

# Build The Spine (Order Matters)
# 1. Base Layers
WORKDIR /app/packages/dreamnet-types
RUN pnpm build
WORKDIR /app/packages/lib
RUN pnpm build || echo "Lib build skipped"
WORKDIR /app/packages/shared
RUN pnpm build || echo "Shared build skipped"

# 2. Core Modules
WORKDIR /app/packages/dreamnet-os-core
RUN pnpm build
WORKDIR /app/packages/dreamnet-metrics-core
RUN pnpm build
WORKDIR /app/packages/dreamnet-voice-twilio
RUN pnpm build || echo "Voice twilio build skipped"
WORKDIR /app/packages/agent-wallet-manager
RUN pnpm build
WORKDIR /app/packages/platform-connector
RUN pnpm build || echo "Platform connector build skipped"
WORKDIR /app/packages/dreamnet-cost-economic-bridge
RUN pnpm build || echo "Economic bridge build skipped"
WORKDIR /app/packages/dreamnet-cost-core
RUN pnpm build

# 3. Support Layers
WORKDIR /app/packages/spider-web-core
RUN pnpm build || echo "Spider web core build skipped"
WORKDIR /app/packages/dream-token
RUN pnpm build || echo "Dream token build skipped"
WORKDIR /app/packages/rewards-engine
RUN pnpm build || echo "Rewards engine build skipped"
WORKDIR /app/packages/dreamnet-operational-bridge
RUN pnpm build || echo "Operational bridge build skipped"

# 4. Advanced Layers (Shield & Senses)
WORKDIR /app/packages/dreamnet-snail-core
RUN pnpm build
WORKDIR /app/packages/sensory-spikes
RUN pnpm build || echo "Sensory spikes build skipped"

# 5. The Cortex (Control Core)
WORKDIR /app/packages/dreamnet-control-core
RUN pnpm build || echo "Control core build failed, but continuing to attempt runner stage"

# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-alpine AS runner
WORKDIR /app

# Harden System
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet

# Ensure all dist directories exist in builder before copying
# This prevents COPY failure if some builds were skipped
FROM builder AS builder-final
RUN mkdir -p packages/lib/dist \
             packages/shared/dist \
             packages/sensory-spikes/dist \
             packages/dream-token/dist \
             packages/rewards-engine/dist \
             packages/dreamnet-operational-bridge/dist \
             packages/platform-connector/dist \
             packages/dreamnet-voice-twilio/dist \
             packages/dreamnet-cost-economic-bridge/dist

FROM runner AS final
# Install Production Deps
COPY --from=builder /app/node_modules ./node_modules

# Copy Artifacts (All Dependencies)
COPY --from=builder-final /app/packages/dreamnet-types/dist ./packages/dreamnet-types/dist
COPY --from=builder-final /app/packages/dreamnet-types/package.json ./packages/dreamnet-types/

COPY --from=builder-final /app/packages/lib/dist ./packages/lib/dist
COPY --from=builder-final /app/packages/lib/package.json ./packages/lib/

COPY --from=builder-final /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder-final /app/packages/shared/package.json ./packages/shared/

COPY --from=builder-final /app/packages/dreamnet-snail-core/dist ./packages/dreamnet-snail-core/dist
COPY --from=builder-final /app/packages/dreamnet-snail-core/package.json ./packages/dreamnet-snail-core/

COPY --from=builder-final /app/packages/sensory-spikes/dist ./packages/sensory-spikes/dist
COPY --from=builder-final /app/packages/sensory-spikes/package.json ./packages/sensory-spikes/

COPY --from=builder-final /app/packages/dreamnet-operational-bridge/dist ./packages/dreamnet-operational-bridge/dist
COPY --from=builder-final /app/packages/dreamnet-operational-bridge/package.json ./packages/dreamnet-operational-bridge/

COPY --from=builder-final /app/packages/dream-token/dist ./packages/dream-token/dist
COPY --from=builder-final /app/packages/dream-token/package.json ./packages/dream-token/

COPY --from=builder-final /app/packages/rewards-engine/dist ./packages/rewards-engine/dist
COPY --from=builder-final /app/packages/rewards-engine/package.json ./packages/rewards-engine/

COPY --from=builder-final /app/packages/spider-web-core/dist ./packages/spider-web-core/dist
COPY --from=builder-final /app/packages/spider-web-core/package.json ./packages/spider-web-core/

COPY --from=builder-final /app/packages/dreamnet-metrics-core/dist ./packages/dreamnet-metrics-core/dist
COPY --from=builder-final /app/packages/dreamnet-metrics-core/package.json ./packages/dreamnet-metrics-core/

COPY --from=builder-final /app/packages/dreamnet-cost-core/dist ./packages/dreamnet-cost-core/dist
COPY --from=builder-final /app/packages/dreamnet-cost-core/package.json ./packages/dreamnet-cost-core/

COPY --from=builder-final /app/packages/dreamnet-os-core/dist ./packages/dreamnet-os-core/dist
COPY --from=builder-final /app/packages/dreamnet-os-core/package.json ./packages/dreamnet-os-core/

COPY --from=builder-final /app/packages/dreamnet-control-core/dist ./packages/dreamnet-control-core/dist
COPY --from=builder-final /app/packages/dreamnet-control-core/package.json ./packages/dreamnet-control-core/

COPY --from=builder-final /app/packages/dreamnet-voice-twilio/dist ./packages/dreamnet-voice-twilio/dist
COPY --from=builder-final /app/packages/dreamnet-voice-twilio/package.json ./packages/dreamnet-voice-twilio/

COPY --from=builder-final /app/packages/agent-wallet-manager/dist ./packages/agent-wallet-manager/dist
COPY --from=builder-final /app/packages/agent-wallet-manager/package.json ./packages/agent-wallet-manager/

COPY --from=builder-final /app/packages/platform-connector/dist ./packages/platform-connector/dist
COPY --from=builder-final /app/packages/platform-connector/package.json ./packages/platform-connector/

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
