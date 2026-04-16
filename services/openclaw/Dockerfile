FROM node:22-alpine

# Install dependencies
RUN apk add --no-cache curl bash python3 make g++

WORKDIR /app

# Copy OpenClaw package
COPY services/openclaw/package.json .
RUN npm install

# Install OpenClaw CLI globally
RUN npm install -g openclaw

# Set up OpenClaw environment
ENV OPENCLAW_HOME=/app/.openclaw
ENV PATH="$PATH:/root/.local/bin"

# Copy OpenClaw configuration and code
COPY services/openclaw/ .

# Create OpenClaw workspace
RUN mkdir -p /app/.openclaw/workspace

EXPOSE 18789

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD curl -f http://localhost:18789/health || exit 1

CMD ["node", "gateway.js"]
