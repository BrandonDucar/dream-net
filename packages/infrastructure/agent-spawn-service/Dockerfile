FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --production

COPY src ./src
COPY tsconfig.json ./

EXPOSE 7010

CMD ["npm", "start"]
