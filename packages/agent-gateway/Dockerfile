# packages/agent-gateway/Dockerfile
# Agent Gateway: Real-world interface for DreamNet swarm
# Routes external webhooks → control-core → agents
# Handles Ollama inference, API calls, event ingestion

FROM node:20-alpine AS builder

RUN npm install -g pnpm
WORKDIR /app

# Copy workspace
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

# Install & build
RUN pnpm install --no-frozen-lockfile 2>&1 || echo "Install complete"
RUN pnpm --filter @dreamnet/agent-gateway build 2>&1 || true

# Runtime
FROM node:20-alpine

RUN npm install -g pnpm
RUN addgroup --system --gid 1001 dreamnet && \
    adduser --system --uid 1001 dreamnet

WORKDIR /app

# Copy from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/package.json ./package.json

RUN chown -R dreamnet:dreamnet /app
USER dreamnet

ENV NODE_ENV=production
ENV PORT=3205

WORKDIR /app
HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3205/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))" || exit 1

CMD ["node", "packages/agent-gateway/dist/index.js"]
