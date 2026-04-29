FROM node:22-alpine

RUN apk add --no-cache curl bash

WORKDIR /app

COPY services/arya-executor/package.json .
RUN npm install

COPY services/arya-executor/src ./src
# Env variables injected via docker-compose

EXPOSE 3204

CMD ["npm", "run", "start"]
