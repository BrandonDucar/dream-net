# Pin to Node 20 LTS - DO NOT CHANGE. Node 22 breaks ffi-napi native compilation.
# Railway overrides: set NODE_VERSION=20.18.0 in service env vars as well.
FROM node:20.18-alpine

# Install native build tools required for packages like ffi-napi
RUN apk add --no-cache python3 make g++ libc6-compat

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

EXPOSE 3000

CMD ["pnpm", "start"]
