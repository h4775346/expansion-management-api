# Docker Configuration Changes

This document summarizes the changes made to the Docker configuration to support volume mounting instead of pre-installing project files in the image.

## Changes Made

### 1. New Dockerfiles
- **Dockerfile.dev**: Development Dockerfile that supports volume mounting
- **Dockerfile.prod**: Production Dockerfile that builds the application into the image

### 2. Updated Docker Compose Files
- **docker-compose.yml**: Updated to use development approach with volume mounting (default)
- **docker-compose.dev.yml**: Development configuration with volume mounting
- **docker-compose.prod.yml**: Production configuration using pre-built images
- **docker-compose.git.yml**: Kept as is for git-based deployments

### 3. Updated Scripts
- **push-image.bat**: Modified to use Dockerfile.prod for building production images
- **push-image.sh**: Added shell script equivalent for Unix systems

### 4. Documentation Updates
- **README.md**: Updated to explain the different Docker deployment approaches
- **PROJECT_DETAILS.md**: Updated to document the Docker configuration changes
- **Makefile**: Updated to include new targets for different deployment modes

## Deployment Options

### Development Mode (Volume Mounting)
```bash
docker-compose up -d
```
This approach mounts your local source code into the container, allowing for live code changes without rebuilding.

### Production Mode (Pre-built Images)
```bash
docker-compose -f docker-compose.prod.yml up -d
```
Uses pre-built images from Docker Hub for faster startup.

### Building from Source
```bash
docker-compose -f docker-compose.full-install.yml up -d
```
Builds the images from source code.

## Benefits of Volume Mounting Approach

1. **Faster Development**: Changes to source code are immediately reflected in the running container
2. **Reduced Build Times**: No need to rebuild the image for every code change
3. **Easier Debugging**: Direct access to source files in the container
4. **Consistent Environment**: Development and production environments can be configured differently

## How It Works

1. The development Dockerfile (Dockerfile.dev) sets up the environment with all dependencies
2. The docker-compose.yml file mounts the current directory to /app in the container
3. A named volume for node_modules ensures dependencies are isolated from the host
4. The application runs in development mode with hot reloading enabled

This approach provides a better developer experience while maintaining the ability to deploy with pre-built images in production.