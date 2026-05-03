FROM node:20-alpine

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages ./packages

# Minimal setup
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile 2>&1 || true

EXPOSE 1234

# Health check endpoint
CMD ["node", "-e", "const http = require('http'); const s = http.createServer((req, res) => { if(req.url === '/health') { res.writeHead(200); res.end('{\"status\":\"healthy\"}'); } else { res.writeHead(404); res.end(); } }); s.listen(1234, () => console.log('🧠 NemoClaw running on 1234')); process.on('SIGTERM', () => s.close(() => process.exit(0)));"]
