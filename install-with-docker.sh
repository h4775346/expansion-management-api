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

# Check if Git is installed (needed for cloning the repository)
if command_exists git; then
    echo "✅ Git is installed"
else
    echo "❌ Git is not installed."
    echo "Git is required to download the source code."
    echo "Please install Git and try again."
    echo "Visit: https://git-scm.com/downloads"
    exit 1
fi

# Create a temporary directory and clone the repository
echo "📥 Cloning the Expansion Management System repository..."
TEMP_DIR="expansion-management-$(date +%s)"
git clone https://github.com/h4775346/expansion-management-api.git "$TEMP_DIR"

# Verify clone was successful
if [ ! -f "$TEMP_DIR/package.json" ]; then
    echo "❌ Failed to clone the repository or locate package.json"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "✅ Repository cloned successfully"

# Change to the cloned directory
cd "$TEMP_DIR"

# Set UID and GID for Docker container to match host user
export UID=$(id -u)
export GID=$(id -g)

# Start all services with development configuration
echo "🔄 Starting all services with development configuration..."
echo "   This may take 2-3 minutes for the first time as Docker:"
echo "   - Builds the application image"
echo "   - Sets up databases"
echo "   - Runs migrations and seeding"
echo ""

$DOCKER_COMPOSE_CMD -f docker-compose.dev.yml up -d

# Check if services started successfully
if [ $? -eq 0 ]; then
    echo "✅ Services started successfully!"
else
    echo "❌ Failed to start services. Check the output above for details."
    exit 1
fi

echo ""
echo "🎉 Installation completed successfully!"
echo ""
echo "📋 Once running, access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo ""
echo "👤 Test Accounts:"
echo "   👨‍💼 Admin: admin@example.com / admin123"
echo "   👥 Client: englishh7366@gmail.com / password123"
echo ""
echo "🛑 To stop the services later, run: $DOCKER_COMPOSE_CMD -f docker-compose.dev.yml down"
echo ""
echo "📁 The application is installed in: $(pwd)"
echo ""