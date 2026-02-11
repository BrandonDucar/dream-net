FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./

# Install dependencies (simplified for standalone, ideally uses pnpm workspace)
RUN npm install

COPY . .

CMD ["npm", "run", "start"]
