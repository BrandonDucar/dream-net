FROM node:22-alpine

WORKDIR /app

COPY services/agent-spawn/package.json .
RUN npm install --production

# Copy TypeScript files and schema
COPY services/agent-spawn/*.ts .
COPY services/agent-spawn/*.sql .

EXPOSE 3200

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3200/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npx", "tsx", "server.ts"]
