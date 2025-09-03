#!/bin/bash

# Expansion Management System - Simplified Docker Installation
# This script works on Linux and macOS

echo "🚀 Starting Expansion Management System Installation with Docker..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
if ! command_exists docker; then
    echo "❌ Docker is not installed."
    echo "Please install Docker and try again."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

echo "✅ Docker is installed: $(docker --version)"

# Check if Docker Compose is installed
if command_exists docker-compose; then
    echo "✅ Docker Compose is installed: $(docker-compose --version)"
    DOCKER_COMPOSE_CMD="docker-compose"
elif docker compose version &>/dev/null; then
    echo "✅ Docker Compose V2 is available"
    DOCKER_COMPOSE_CMD="docker compose"
else
    echo "❌ Docker Compose is not installed."
    echo "Please install Docker Compose and try again."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

# Start all services with development configuration
echo "🔄 Starting all services with development configuration..."
$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up -d

echo
echo "🎉 Installation completed successfully!"
echo
echo "⏳ This may take 2-3 minutes for the first time as Docker:"
echo "   - Builds the application image"
echo "   - Sets up databases"
echo "   - Runs migrations and seeding"
echo
echo "📋 Once running, access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo
echo "👤 Test Accounts:"
echo "   👨‍💼 Admin: admin@example.com / admin123"
echo "   👥 Client: englishh7366@gmail.com / password123"
echo
echo "🛑 To stop the services later, run: $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down"
echo