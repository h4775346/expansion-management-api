#!/bin/bash

# Update Expansion Management System using Docker Compose
# This script works on Linux and macOS and supports both docker-compose and docker compose

echo "🔄 Updating Expansion Management System using Docker Compose..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
    echo "❌ Docker is not installed."
    echo "Please install Docker and try again."
    exit 1
fi

# Determine which Docker Compose command to use
if command_exists docker-compose; then
    echo "✅ Using docker-compose command"
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &>/dev/null; then
    echo "✅ Using docker compose command"
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose and try again."
    exit 1
fi

# Pull latest images
echo "📥 Pulling latest images..."
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml pull

# Rebuild and restart services
echo "🏗️ Rebuilding and restarting services..."
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up -d --build

echo
echo "✅ Update completed successfully!"
echo "Your Expansion Management System is now running with the latest images."
echo
echo "📋 Access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo