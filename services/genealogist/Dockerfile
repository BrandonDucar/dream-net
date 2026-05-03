FROM node:22-alpine

RUN apk add --no-cache curl bash

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev

COPY server.mjs .

EXPOSE 3400

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget -q -O - http://localhost:3400/health || exit 1

CMD ["node", "server.mjs"]
