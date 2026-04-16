FROM node:22-alpine

WORKDIR /app

COPY services/message-bus/package.json .
RUN npm install --production

COPY services/message-bus/server.ts .

EXPOSE 3202

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD node -e "fetch('http://localhost:3202/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["npx", "tsx", "server.ts"]
