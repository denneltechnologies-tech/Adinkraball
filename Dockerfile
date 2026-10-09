FROM node:20-alpine

WORKDIR /app

# Copy package definitions
COPY package*.json ./

# Copy application assets and code
COPY . .

# Ensure storage directory exists
RUN mkdir -p /app/data

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

CMD ["node", "server.js"]
