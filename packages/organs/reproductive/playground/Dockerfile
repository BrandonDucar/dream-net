# Playground - Agent Experimentation & Prototyping Environment
FROM node:22-alpine

WORKDIR /app

# Install dependencies for experimentation
RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    git

# Copy workspace dependencies
COPY package.json pnpm-lock.yaml ./
COPY packages/organs/reproductive/playground/package.json ./packages/organs/reproductive/playground/
COPY packages/organs/skeletal/shared ./packages/organs/skeletal/shared
COPY packages/organs/skeletal/lib ./packages/organs/skeletal/lib

# Install pnpm
RUN npm install -g pnpm@9.15.4

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY packages/organs/reproductive/playground/src ./packages/organs/reproductive/playground/src
COPY packages/organs/reproductive/playground/tsconfig.json ./packages/organs/reproductive/playground/

# Build
WORKDIR /app/packages/organs/reproductive/playground
RUN pnpm run build

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7002/health || exit 1

# Start
EXPOSE 7002
CMD ["node", "dist/index.js"]
