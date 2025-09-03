#!/bin/bash

# Update Expansion Management System from GitHub and rebuild Docker containers
# This script works on Linux and macOS

echo "🔄 Updating Expansion Management System from GitHub..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Git is installed
if ! command_exists git; then
    echo "❌ Git is not installed."
    echo "Please install Git and try again."
    exit 1
fi

# Check if Docker is installed
if ! command_exists docker; then
    echo "❌ Docker is not installed."
    echo "Please install Docker and try again."
    exit 1
fi

# Check if Docker Compose is installed
if command_exists docker-compose; then
    echo "✅ Docker Compose is installed"
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &>/dev/null; then
    echo "✅ Docker Compose V2 is available"
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose and try again."
    exit 1
fi

# Pull latest changes from GitHub (master branch)
echo "📥 Pulling latest changes from GitHub (master branch)..."
git pull origin master

# Rebuild and restart services with development configuration
echo "🏗️ Rebuilding and restarting services..."
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up -d --build

echo
echo "✅ Update completed successfully!"
echo "Your Expansion Management System is now running the latest version."
echo
echo "📋 Access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo