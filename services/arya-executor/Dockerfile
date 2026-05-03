FROM node:22-alpine

RUN apk add --no-cache curl bash

WORKDIR /app

COPY server.mjs ./
COPY package.json ./

RUN npm install redis

EXPOSE 3204

CMD ["node", "server.mjs"]
