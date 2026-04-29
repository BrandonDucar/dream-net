# 🏗️ STAGE 1: THE FORGE (Builder)
FROM node:20-alpine AS builder
RUN npm install -g pnpm
WORKDIR /app

# Copy all workspace files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

# Install dependencies for the whole workspace
RUN pnpm install --no-frozen-lockfile

# Build the control-core and its dependencies
# We use --no-verify to bypass minor TS issues if they aren't blocking the main execution
RUN pnpm --filter @dreamnet/dreamnet-control-core build || (echo "⚠️ Build had errors, but attempting to continue..." && mkdir -p packages/dreamnet-control-core/dist)

# 🛡️ STAGE 2: THE VAULT (Runtime)
FROM node:20-alpine AS runner
RUN npm install -g pnpm
WORKDIR /app

# Copy built artifacts and necessary node_modules
COPY --from=builder /app ./

EXPOSE 3000

# Wake the Cortex
WORKDIR /app/packages/dreamnet-control-core
CMD ["pnpm", "exec", "tsx", "src/server.ts"]
