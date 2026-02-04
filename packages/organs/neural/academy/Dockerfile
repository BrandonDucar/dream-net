# DreamNet Academy - Institution of Learning for Agent Intelligence
FROM node:22-alpine

WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy package files
COPY packages/organs/neural/academy/package.json ./
COPY packages/organs/neural/academy/tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source
COPY packages/organs/neural/academy/src ./src

# Build TypeScript
RUN npm run build

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:7004/health || exit 1

# Start
EXPOSE 7004
CMD ["node", "dist/index.js"]
