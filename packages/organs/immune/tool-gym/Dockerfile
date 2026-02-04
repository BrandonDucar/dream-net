# ToolGym - Agent Training & Benchmarking Environment
FROM node:22-alpine

WORKDIR /app

# Install dependencies for agent execution
RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    git

# Copy workspace dependencies
COPY package.json pnpm-lock.yaml ./
COPY packages/organs/immune/tool-gym/package.json ./packages/organs/immune/tool-gym/
COPY packages/organs/skeletal/shared ./packages/organs/skeletal/shared
COPY packages/organs/skeletal/lib ./packages/organs/skeletal/lib

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/organs/immune/tool-gym/src ./packages/organs/immune/tool-gym/src
COPY packages/organs/immune/tool-gym/tsconfig.json ./packages/organs/immune/tool-gym/

# Build
WORKDIR /app/packages/organs/immune/tool-gym
RUN pnpm run build

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7001/health || exit 1

# Start
EXPOSE 7001
CMD ["node", "dist/index.js"]
