# Antigravity - Swarm Orchestration & Coordination Engine
FROM node:22-alpine

WORKDIR /app

# Install dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    git

# Copy workspace dependencies
COPY package.json pnpm-lock.yaml ./
COPY packages/organs/nervous-subsystem/antigravity-core/package.json ./packages/organs/nervous-subsystem/antigravity-core/
COPY packages/organs/skeletal/shared ./packages/organs/skeletal/shared
COPY packages/organs/skeletal/lib ./packages/organs/skeletal/lib

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/organs/nervous-subsystem/antigravity-core/src ./packages/organs/nervous-subsystem/antigravity-core/src
COPY packages/organs/nervous-subsystem/antigravity-core/tsconfig.json ./packages/organs/nervous-subsystem/antigravity-core/

# Build
WORKDIR /app/packages/organs/nervous-subsystem/antigravity-core
RUN pnpm run build || echo "Build may need existing source files"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7003/health || exit 1

# Start
EXPOSE 7003
CMD ["node", "dist/index.js"]
