FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    python3 \
    make \
    g++ \
    cairo-dev \
    giflib-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose ports
EXPOSE 3001 3010

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start the application
CMD ["npm", "start"]
