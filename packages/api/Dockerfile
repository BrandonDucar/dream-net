FROM node:20-alpine

# Install native build tools required for packages like ffi-napi or other native addons
RUN apk add --no-cache python3 make g++ libc6-compat curl

RUN npm install -g pnpm

WORKDIR /app

# Copy root workspace files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy all packages for workspace dependency resolution (@dreamnet/nerve, shared, etc.)
COPY packages ./packages

# Install dependencies for the specific package
RUN pnpm install --filter ./packages/api...

WORKDIR /app/packages/api

RUN pnpm run build

# Add health check
HEALTHCHECK --interval=15s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 3000

CMD ["pnpm", "start"]
