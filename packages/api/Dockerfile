FROM node:20-alpine

WORKDIR /app

# Copy package manifests from the correct context
COPY packages/api/package.json ./

# Install dependencies
RUN npm install --include=dev

# Copy source and config
COPY packages/api/src ./src
COPY packages/api/tsconfig.json ./

# Skip Prisma generation for now - it's causing build issues with Prisma 7
# The service doesn't actually use Prisma yet, it uses Redis for memory
# COPY packages/api/prisma ./prisma
# RUN npx prisma generate

# Skip build for now, use tsx directly
EXPOSE 3100
CMD ["npx", "tsx", "--experimental-specifier-resolution=node", "src/index.ts"]
