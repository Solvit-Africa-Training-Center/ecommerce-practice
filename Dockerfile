# Simple Dockerfile for ecommerce-practice
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install netcat for health checks
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .sequelizerc ./

# Install dependencies (keep dev dependencies for build)
RUN npm ci

# Copy source code and scripts
COPY . /app/

# Debug: Check what was copied
RUN echo "=== After copying everything ==="
RUN ls -la
RUN echo "=== Scripts directory ==="
RUN ls -la scripts/ || echo "Scripts directory not found"

# Fix line endings and make start script executable
RUN sed -i 's/\r$//' scripts/start.sh
RUN chmod +x scripts/start.sh

# Build the application (TypeScript compilation)
RUN npm run build

# Verify scripts still exist after build
RUN echo "=== After build ==="
RUN ls -la scripts/
RUN ls -la scripts/start.sh

# Create logs directory and set permissions
RUN mkdir -p /app/logs && chmod 777 /app/logs

# Expose port
EXPOSE 5500

# Start the application
CMD ["./scripts/start.sh"]
