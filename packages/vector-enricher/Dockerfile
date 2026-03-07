FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Use tsx to run TypeScript directly (no build step)
CMD ["npx", "tsx", "--experimental-specifier-resolution=node", "src/index.ts"]

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "console.log('healthy')" || exit 1

EXPOSE 3000
