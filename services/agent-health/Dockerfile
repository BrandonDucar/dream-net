FROM node:22-alpine

WORKDIR /app

COPY services/agent-health/package.json .
RUN npm install --production

COPY services/agent-health/server.ts .

EXPOSE 3201

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3201/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npx", "tsx", "server.ts"]
