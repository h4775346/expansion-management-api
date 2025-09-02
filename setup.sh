#!/bin/bash

# Expansion Management System - One-Command Setup
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    EXPANSION MANAGEMENT SYSTEM SETUP                         ║"
echo "║                           One-Command Installer                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo

echo "🚀 Starting setup process..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
echo "🔍 Checking for Docker..."
if ! command_exists docker; then
    echo "❌ Error: Docker is not installed."
    echo "   Please install Docker and try again."
    echo "   For Ubuntu/Debian: sudo apt update && sudo apt install docker.io"
    echo "   For CentOS/RHEL: sudo yum install docker"
    echo "   For Fedora: sudo dnf install docker"
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo "✅ Docker found."

# Check if Docker Compose is installed
echo "🔍 Checking for Docker Compose..."
if ! command_exists docker-compose; then
    echo "❌ Error: Docker Compose is not installed."
    echo "   Please install Docker Compose and try again."
    echo "   For Ubuntu/Debian: sudo apt install docker-compose"
    echo "   For CentOS/RHEL: sudo yum install docker-compose"
    echo "   For Fedora: sudo dnf install docker-compose"
    exit 1
fi
echo "✅ Docker Compose found."

# Check if user is in docker group (Linux only)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    if ! groups $USER | grep -q '\bdocker\b'; then
        echo "⚠️  Warning: You are not in the docker group."
        echo "   You may need to run with sudo or add yourself to the docker group:"
        echo "   sudo usermod -aG docker $USER"
        echo "   Then log out and log back in."
        echo
    fi
fi

# Download necessary files
echo "📥 Downloading necessary files..."
if ! command_exists curl; then
    echo "❌ Error: curl is not installed. Please install curl and try again."
    exit 1
fi

echo "   Downloading docker-compose.full-install.yml..."
if ! curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.full-install.yml; then
    echo "❌ Error: Failed to download docker-compose.full-install.yml"
    exit 1
fi

echo "   Downloading Dockerfile.prod..."
if ! curl -o Dockerfile.prod https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile.prod; then
    echo "❌ Error: Failed to download Dockerfile.prod"
    exit 1
fi

echo "✅ Files downloaded successfully."

# Start with Docker Compose
echo "🐳 Starting all services with Docker Compose..."
if ! docker-compose -f docker-compose.full-install.yml up -d; then
    echo "❌ Error: Failed to start services with Docker Compose"
    echo "   Please check the error message above and try again."
    exit 1
fi

echo
echo "🎉 Setup initiated! Services are starting up..."
echo
echo "⏳ This may take 3-5 minutes for the first time as Docker:"
echo "   - Pulls required images"
echo "   - Builds the application"
echo "   - Sets up databases"
echo "   - Runs migrations and seeding"
echo
echo "📋 Once running, access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo
echo "👤 Test Accounts:"
echo "   👨‍💼 Admin: admin@expansion.com / admin123"
echo "   👥 Client: englishh7366@gmail.com / password123"
echo
echo "🛑 To stop the services later, run: docker-compose -f docker-compose.full-install.yml down"
echo
echo "💡 For more details, check the README.md file"
echo
echo "🔄 You can check the status of services with: docker-compose -f docker-compose.full-install.yml ps"
echo "📝 You can view logs with: docker-compose -f docker-compose.full-install.yml logs -f"
echo
echo "🚀 Enjoy your Expansion Management System!"
echo