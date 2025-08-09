# Simple Dockerfile for BlogM
FROM node:18-alpine

# Create app user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .sequelizerc ./

# Install dependencies (keep dev dependencies for build)
RUN npm ci

# Copy source code and scripts
COPY src/ ./src/
COPY scripts/ ./scripts/

# Build the application (TypeScript compilation)
RUN npm run build

# Make start script executable
RUN chmod +x scripts/start.sh

# Set ownership of the app directory to nodejs user
# RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Start the application
CMD ["./scripts/start.sh"]
