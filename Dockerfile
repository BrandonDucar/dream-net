# DreamNet Dockerfile for Google Cloud Run
# Optimized for serverless deployment

FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@10.21.0

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY client/package.json ./client/
COPY server/package.json ./server/

# Install root dependencies first
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build frontend (dependencies hoisted to root via .npmrc)
WORKDIR /app/client
ENV CI=true
# Build - dependencies should be available from root node_modules
RUN pnpm build
WORKDIR /app

# Build backend
RUN cd server && pnpm build || true

# Copy vite.ts to dist/vite.js (needed for production static file serving)
# TypeScript may not compile vite.ts due to import.meta.dirname, so we copy it manually
# Node.js ESM will execute .js files directly
RUN mkdir -p server/dist && \
    if [ -f server/vite.ts ]; then \
      cp server/vite.ts server/dist/vite.js; \
      echo "✅ Copied vite.ts to dist/vite.js"; \
    else \
      echo "⚠️ Warning: server/vite.ts not found"; \
    fi

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Start server (serves both frontend and backend)
CMD ["node", "server/dist/index.js"]

