#!/bin/bash

# Script to update Docker containers with latest GitHub changes

echo "🔄 Updating Expansion Management System from GitHub..."

# Check if running in the correct directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml not found. Please run this script from the project root directory."
    exit 1
fi

# Stash any local changes
echo "📦 Stashing local changes (if any)..."
git stash push -m "Auto-stash before update $(date)"

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# Determine which docker-compose file to use
if [ -f "docker-compose.full-install.yml" ]; then
    COMPOSE_FILE="docker-compose.full-install.yml"
    echo "🔧 Using $COMPOSE_FILE for update..."
else
    COMPOSE_FILE="docker-compose.yml"
    echo "🔧 Using $COMPOSE_FILE for update..."
fi

# Stop current containers
echo "⏹️ Stopping current containers..."
docker-compose -f $COMPOSE_FILE down

# Pull latest images
echo "📥 Pulling latest Docker images..."
docker-compose -f $COMPOSE_FILE pull

# Rebuild containers (in case Dockerfile changed)
echo "🏗️ Rebuilding containers..."
docker-compose -f $COMPOSE_FILE build --no-cache

# Start containers
echo "🚀 Starting updated containers..."
docker-compose -f $COMPOSE_FILE up -d

# Run database migrations if needed
echo "📋 Running database migrations..."
docker-compose -f $COMPOSE_FILE exec api npm run typeorm migration:run

echo "✅ Update completed successfully!"
echo "🌐 Application available at http://localhost:3000"
echo "📚 API Documentation at http://localhost:3000/docs"