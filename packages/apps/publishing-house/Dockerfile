FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S dreamnet -u 1001

# Build the app
RUN npm run build

# Expose port
EXPOSE 7005

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7005/health || exit 1

# Switch to non-root user
USER dreamnet

# Start the server
CMD ["npm", "start"]
