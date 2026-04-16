# DreamNet Control Core — The Brain
# Avoids ffi-napi by using pure JS alternatives
FROM node:20-alpine

WORKDIR /app

# Install build tools for any native deps (but skip ffi-napi)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json ./
COPY packages/organs/endocrine/dreamnet-control-core/ ./packages/organs/endocrine/dreamnet-control-core/

# Install deps, ignoring optional native modules that fail
RUN npm install --ignore-scripts --omit=optional 2>/dev/null || true

# Copy the rest of the monorepo for shared imports
COPY packages/organs/nervous/runtime-bridge-core/ ./packages/organs/nervous/runtime-bridge-core/
COPY packages/shared/ ./packages/shared/
COPY tsconfig.json ./

# Build TypeScript
RUN npx tsc --skipLibCheck --outDir dist \
    packages/organs/endocrine/dreamnet-control-core/src/index.ts \
    2>/dev/null || true

ENV NODE_ENV=production
ENV PORT=3200

EXPOSE 3200

# Run with ts-node as fallback if tsc build fails
CMD ["node", "--loader", "ts-node/esm", "packages/organs/endocrine/dreamnet-control-core/src/server.ts"]
