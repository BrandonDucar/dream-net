# DreamNet Backend Dockerfile
# Optimized for Google Cloud Run and AWS App Runner/ECS

FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@10.21.0

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY server/package.json ./server/

# Install dependencies (production only)
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build backend
RUN cd server && pnpm build

# Expose port (Cloud Run uses PORT env var, AWS uses container port)
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "server/dist/index.js"]

