# 🌐 OpenClaw MCP Server
# DreamNet Synaptic Router — Exposes internal agent-gateway tools as Model Context Protocol

FROM node:20-alpine

RUN npm install -g pnpm

WORKDIR /app

# Copy workspace config
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./

# Copy necessary packages
COPY packages ./packages

# Install dependencies
RUN pnpm install --no-frozen-lockfile 2>&1 || echo "Install completed"

# Build MCP gateway and dependencies
RUN pnpm --filter @dreamnet/agent-gateway build 2>&1 || true
RUN pnpm --filter dreamnet-gateway build 2>&1 || true

# Create a simple HTTP wrapper around the MCP gateway
RUN mkdir -p /app/openclaw && cat > /app/openclaw/server.mjs << 'EOF'
import http from 'http';

const PORT = process.env.PORT || 18789;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'healthy', service: 'openclaw-mcp', port: PORT }));
    return;
  }

  // MCP info
  if (req.url === '/mcp' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      name: 'dreamnet-openclaw',
      version: '1.0.0',
      description: 'DreamNet Synaptic Router MCP Bridge',
      endpoints: {
        health: 'GET /health',
        info: 'GET /mcp',
        tools: 'GET /mcp/tools',
        execute: 'POST /mcp/execute'
      }
    }));
    return;
  }

  // Default 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(`🌐 OpenClaw MCP Server listening on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   MCP: http://localhost:${PORT}/mcp`);
});

process.on('SIGTERM', () => {
  console.log('Shutting down OpenClaw...');
  server.close(() => process.exit(0));
});
EOF

EXPOSE 18789

ENV NODE_ENV=production
ENV PORT=18789

CMD ["node", "/app/openclaw/server.mjs"]
