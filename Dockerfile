# Simple Dockerfile for BlogM
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .sequelizerc ./

# Install dependencies (keep dev dependencies for build)
RUN npm ci

# Copy source code and scripts
COPY . /app/
COPY /scripts/start.sh /app/

# Build the application (TypeScript compilation)
RUN npm run build

# Make start script executable
RUN chmod +x scripts/start.sh

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Expose port
EXPOSE 5000

# Start the application
CMD ["./scripts/start.sh"]
