FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies - important to do this in the container to get correct architecture binaries
RUN npm install --legacy-peer-deps

# In development with volume mounting, we don't need to copy source files
# They will be mounted from the host

# Expose port
EXPOSE 3000

# Start the application in development mode with hot reloading
CMD ["npm", "run", "start:dev"]