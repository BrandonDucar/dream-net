FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

COPY server.mjs .

ENV NODE_ENV=production
ENV PORT=8094

EXPOSE 8094

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -q -O - http://localhost:8094/health || exit 1

CMD ["node", "server.mjs"]
