# Antigravity - Swarm Orchestration Engine (Standalone)
FROM node:22-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY packages/organs/nervous-subsystem/antigravity-core/package.json ./
COPY packages/organs/nervous-subsystem/antigravity-core/tsconfig.json ./

# Install dependencies (minimal, no workspace)
RUN npm install

# Copy source
COPY packages/organs/nervous-subsystem/antigravity-core/src ./src

# Build TypeScript
RUN npm run build

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7003/health || exit 1

# Start
EXPOSE 7003
CMD ["node", "dist/index.js"]
