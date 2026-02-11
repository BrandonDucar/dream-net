FROM node:18

WORKDIR /app

# Copy package manifests from the correct context
COPY packages/organs/nervous/voice/package.json ./

# Install dependencies
RUN npm install

# Copy source and config
COPY packages/organs/nervous/voice/src ./src
COPY packages/organs/nervous/voice/tsconfig.json ./

# Skip build for now, use tsx directly
CMD ["npx", "tsx", "--experimental-specifier-resolution=node", "src/index.ts"]
