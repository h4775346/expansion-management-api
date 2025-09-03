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

# Download required Docker Compose files if they don't exist
echo "📥 Downloading required configuration files..."

# Check if we're running from the repository directory or a temporary location
if [ -f "docker-compose.dev.yml" ] && [ -f "docker-compose.yml" ]; then
    echo "✅ Docker Compose files already exist locally"
else
    echo "📥 Downloading Docker Compose files from repository..."
    if command_exists curl; then
        curl -s -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.dev.yml
        curl -s -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml
        curl -s -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile
    elif command_exists wget; then
        wget -q https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.dev.yml
        wget -q https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml
        wget -q https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile
    else
        echo "❌ Neither curl nor wget is available to download required files."
        exit 1
    fi
    
    # Verify files were downloaded
    if [ ! -f "docker-compose.dev.yml" ] || [ ! -f "docker-compose.yml" ] || [ ! -f "Dockerfile" ]; then
        echo "❌ Failed to download required configuration files."
        exit 1
    fi
    
    echo "✅ Docker Compose files downloaded successfully"
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