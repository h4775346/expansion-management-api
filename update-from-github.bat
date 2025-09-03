@echo off
REM Script to update Docker containers with latest GitHub changes

echo 🔄 Updating Expansion Management System from GitHub...

REM Check if running in the correct directory
if not exist "docker-compose.yml" (
    echo ❌ Error: docker-compose.yml not found. Please run this script from the project root directory.
    exit /b 1
)

REM Stash any local changes
echo 📦 Stashing local changes (if any)...
git stash push -m "Auto-stash before update %date% %time%"

REM Pull latest changes from GitHub
echo 📥 Pulling latest changes from GitHub...
git pull origin main

REM Determine which docker-compose file to use
if exist "docker-compose.full-install.yml" (
    set COMPOSE_FILE=docker-compose.full-install.yml
    echo 🔧 Using %COMPOSE_FILE% for update...
) else (
    set COMPOSE_FILE=docker-compose.yml
    echo 🔧 Using %COMPOSE_FILE% for update...
)

REM Stop current containers
echo ⏹️ Stopping current containers...
docker-compose -f %COMPOSE_FILE% down

REM Pull latest images
echo 📥 Pulling latest Docker images...
docker-compose -f %COMPOSE_FILE% pull

REM Rebuild containers (in case Dockerfile changed)
echo 🏗️ Rebuilding containers...
docker-compose -f %COMPOSE_FILE% build --no-cache

REM Start containers
echo 🚀 Starting updated containers...
docker-compose -f %COMPOSE_FILE% up -d

REM Run database migrations if needed
echo 📋 Running database migrations...
docker-compose -f %COMPOSE_FILE% exec api npm run typeorm migration:run

echo ✅ Update completed successfully!
echo 🌐 Application available at http://localhost:3000
echo 📚 API Documentation at http://localhost:3000/docs

pause