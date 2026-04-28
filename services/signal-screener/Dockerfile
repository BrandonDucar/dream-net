FROM node:22-alpine

# Install dependencies
RUN apk add --no-cache curl bash

WORKDIR /app

COPY services/signal-screener/package.json .
RUN npm install

# Copy all TypeScript files and schema
COPY services/signal-screener/*.ts .
COPY services/signal-screener/*.sql .

# Install OpenClaw binary (skip for now - use mock)
# RUN curl -fsSL https://github.com/openclaw/openclaw/releases/latest/download/openclaw-linux-x64 -o /usr/local/bin/openclaw && \
#     chmod +x /usr/local/bin/openclaw

# Create OpenClaw mock for now
RUN echo '#!/bin/bash\necho "🦞 OpenClaw v1.0.0 (AI Teammate Edition)"\necho "Command: $@"\necho "Status: Ready to serve as AI teammate"' > /usr/local/bin/openclaw && chmod +x /usr/local/bin/openclaw

# Set up OpenClaw environment
ENV OPENCLAW_HOME=/app/.openclaw
ENV OPENCLAW_MODEL=gpt-4

# Create OpenClaw workspace
RUN mkdir -p /app/.openclaw/workspace && \
    mkdir -p /app/.openclaw/config

# Copy OpenClaw configuration
COPY services/signal-screener/openclaw.json /app/.openclaw/config/

EXPOSE 3203

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3203/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npx", "tsx", "server.ts"]
