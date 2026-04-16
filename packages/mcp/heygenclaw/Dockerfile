FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build
EXPOSE 8093
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://localhost:8093/health || exit 1
CMD ["node", "dist/index.js"]
