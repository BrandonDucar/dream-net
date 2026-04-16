FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV MCP_TRANSPORT=http
ENV PORT=8090
ENV QDRANT_URL=http://dreamnet_qdrant:6333
EXPOSE 8090
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget -qO- http://localhost:8090/health || exit 1
CMD ["npx", "tsx", "src/index.ts"]
