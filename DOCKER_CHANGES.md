# Docker Configuration Changes

This document summarizes the changes made to simplify the Docker configuration.

## Changes Made

### 1. Multi-stage Dockerfile
- **[Dockerfile](file:///d:/job/expansion-management/Dockerfile)**: Multi-stage Dockerfile that supports both development and production builds with optimized production image

### 2. Separated Docker Compose Configurations
- **[docker-compose.yml](file:///d:/job/expansion-management/docker-compose.yml)**: Production configuration that uses the production stage of the multi-stage Dockerfile
- **[docker-compose.dev.yml](file:///d:/job/expansion-management/docker-compose.dev.yml)**: Development configuration that uses volume mounting for development and includes all necessary setup steps

### 3. Simplified Installation Scripts
- **[install-with-docker.bat](file:///d:/job/expansion-management/install-with-docker.bat)**: Windows installation script for Docker-based setup
- **[install-with-docker.sh](file:///d:/job/expansion-management/install-with-docker.sh)**: Unix/Linux/macOS installation script for Docker-based setup
- **[install-local.bat](file:///d:/job/expansion-management/install-local.bat)**: Windows installation script for local setup (without Docker)
- **[install-local.sh](file:///d:/job/expansion-management/install-local.sh)**: Unix/Linux/macOS installation script for local setup (without Docker)

### 4. Removed Unnecessary Files
- Removed multiple Docker Compose files (dev, prod, git, autoupdate, full-install, volume)
- Removed multiple Dockerfiles (dev, prod, git, prebuilt, multistage)
- Removed complex setup scripts (setup.bat, setup.sh, simple-setup.bat, etc.)

## New Simplified Approach

### Docker Installation (Recommended)
```bash
# Windows:
.\install-with-docker.bat

# macOS/Linux:
./install-with-docker.sh
```

This approach:
1. Uses Docker Compose with volume mounting for development
2. Automatically builds the application inside the container
3. Sets up all dependencies (MySQL, MongoDB)
4. Runs migrations and seeds the database
5. Starts the application with hot reloading

### Production Deployment
```bash
# Using Docker Compose:
docker compose up -d
```

This approach:
1. Uses the multi-stage Dockerfile to build an optimized production image
2. Runs the application as a non-root user for security
3. Includes only production dependencies
4. Uses the compiled application code

### Local Installation (Without Docker)
```bash
# Windows:
.\install-local.bat

# macOS/Linux:
./install-local.sh
```

This approach:
1. Installs Node.js dependencies locally
2. Builds the application locally
3. Provides instructions for setting up databases manually

## Benefits of the Simplified Approach

1. **Reduced Complexity**: Only one Docker Compose file and one Dockerfile to maintain
2. **Cross-Platform Compatibility**: Same installation process works on Windows, macOS, and Linux
3. **Clear Options**: Users can choose between Docker-based or local installation
4. **Faster Development**: Volume mounting allows for hot reloading without rebuilding images
5. **Production Ready**: Multi-stage Dockerfile creates optimized production images
6. **Easier Maintenance**: Fewer files to keep in sync

## How It Works

1. The Dockerfile uses multi-stage builds to create optimized production images
2. The docker-compose.dev.yml file mounts the current directory to /app in the container for development
3. A named volume for node_modules ensures dependencies are isolated from the host
4. The application runs in development mode with hot reloading enabled
5. Database migrations and seeding are automatically run when the container starts