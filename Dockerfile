# DreamNet Dockerfile for Google Cloud Run
# Optimized for serverless deployment

FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm@10.21.0

# Set working directory
WORKDIR /app

# Copy everything first so pnpm can properly resolve workspace packages
COPY . .

# Install dependencies (allow lockfile updates if needed for workspace resolution)
RUN pnpm install --no-frozen-lockfile || pnpm install

# Skip frontend build for now - deploy server-only
# Frontend can be deployed separately or built later
# WORKDIR /app/client
# ENV CI=true
# RUN pnpm build || echo "Frontend build skipped"
# WORKDIR /app

# Build backend (optional - we'll use tsx to run TypeScript directly)
# RUN cd server && pnpm build || echo "Build had errors, using tsx instead"

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

# Start server using tsx (runs TypeScript directly, no compilation needed)
# tsx is installed via pnpm install (devDependencies included)
WORKDIR /app/server
CMD ["pnpm", "start:dev"]

