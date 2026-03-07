# Railway overrides: pinned to Node 18 for ffi-napi compatibility
FROM node:18-alpine


RUN apk add --no-cache python3 make g++ libc6-compat curl

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages

RUN pnpm install --filter ./packages/api...

WORKDIR /app/packages/api

RUN pnpm run build

HEALTHCHECK --interval=15s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

  EXPOSE 3000

  CMD ["pnpm", "start"]
  
