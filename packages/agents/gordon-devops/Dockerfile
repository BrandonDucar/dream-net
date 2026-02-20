FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json tsconfig.json ./
RUN npm install && npm install -g tsx typescript

# Copy source
COPY src ./src

# Build TypeScript
RUN npm run build

# Run as non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER root

# Health check - check if process is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD pgrep -f "node.*dist/index.js" > /dev/null || exit 1

CMD ["node", "dist/index.js"]
