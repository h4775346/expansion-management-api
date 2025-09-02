FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - important to do this in the container to get correct architecture binaries
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Remove any existing node_modules to ensure clean build
RUN rm -rf node_modules

# Reinstall dependencies in container
RUN npm install --legacy-peer-deps

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]