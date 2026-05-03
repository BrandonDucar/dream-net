FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY server.mjs ./

ENV NODE_ENV=production
ENV PORT=3210

EXPOSE 3210

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -q -O - http://localhost:3210/health || exit 1

CMD ["node", "server.mjs"]
