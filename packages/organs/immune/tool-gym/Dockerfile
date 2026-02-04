# ToolGym - Agent Training & Benchmarking Environment (Standalone)
FROM node:22-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY packages/organs/immune/tool-gym/package.json ./
COPY packages/organs/immune/tool-gym/tsconfig.json ./

# Install dependencies (minimal, no workspace)
RUN npm install

# Copy source
COPY packages/organs/immune/tool-gym/src ./src

# Build TypeScript
RUN npm run build

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7001/health || exit 1

# Start
EXPOSE 7001
CMD ["node", "dist/index.js"]
