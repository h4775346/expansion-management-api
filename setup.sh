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

# Check for Docker Compose options
echo "🔍 Checking for Docker Compose..."
if command_exists docker-compose; then
    DOCKER_COMPOSE_CMD="docker-compose"
    echo "✅ Found docker-compose command"
elif docker compose version &>/dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    echo "✅ Found Docker Compose V2 (docker compose)"
else
    echo "⚠️  Docker Compose not found. We'll install it or use alternative methods."
    
    # Try to install Docker Compose
    echo "📥 Attempting to install Docker Compose..."
    
    # Check if we can install via package manager
    if command_exists apt; then
        echo "   Installing via apt..."
        sudo apt update
        sudo apt install -y docker-compose || {
            echo "   Failed to install via apt, trying direct download..."
            install_docker_compose_direct
        }
    elif command_exists yum; then
        echo "   Installing via yum..."
        sudo yum install -y docker-compose || {
            echo "   Failed to install via yum, trying direct download..."
            install_docker_compose_direct
        }
    else
        echo "   Package manager not found, trying direct download..."
        install_docker_compose_direct
    fi
    
    # Check again after installation attempt
    if command_exists docker-compose; then
        DOCKER_COMPOSE_CMD="docker-compose"
        echo "✅ Docker Compose installed successfully"
    elif docker compose version &>/dev/null; then
        DOCKER_COMPOSE_CMD="docker compose"
        echo "✅ Docker Compose V2 available"
    else
        echo "❌ Failed to install Docker Compose. Using manual Docker commands."
        use_manual_docker_approach
        exit 0
    fi
fi

# Function to install Docker Compose directly
install_docker_compose_direct() {
    echo "   Downloading Docker Compose directly..."
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose 2>/dev/null || {
        echo "   ❌ Failed to download Docker Compose"
        return 1
    }
    sudo chmod +x /usr/local/bin/docker-compose
}

# Function for manual Docker approach (when Compose is not available)
use_manual_docker_approach() {
    echo "🔄 Using manual Docker approach (no Compose required)..."
    
    # Download the Dockerfile
    echo "📥 Downloading Dockerfile.prod..."
    if ! curl -o Dockerfile.prod https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile.prod; then
        echo "❌ Error: Failed to download Dockerfile.prod"
        exit 1
    fi
    
    echo "🏗️ Building API image..."
    if ! docker build -t expansion-api -f Dockerfile.prod .; then
        echo "❌ Error: Failed to build API image"
        exit 1
    fi
    
    echo "🗄️ Starting databases..."
    docker run -d --name mysql-db \
      -e MYSQL_ROOT_PASSWORD=password \
      -e MYSQL_DATABASE=expansion_management \
      -p 3307:3306 \
      mysql:8.0 >/dev/null 2>&1
    
    docker run -d --name mongo-db \
      -p 27017:27017 \
      mongo:5.0 >/dev/null 2>&1
    
    echo "⏳ Waiting for databases to start (30 seconds)..."
    sleep 30
    
    echo "🚀 Starting API service..."
    docker run -d --name expansion-api \
      --link mysql-db:mysql \
      --link mongo-db:mongo \
      -p 3000:3000 \
      -e MYSQL_HOST=mysql \
      -e MYSQL_PORT=3306 \
      -e MYSQL_DB=expansion_management \
      -e MYSQL_USER=root \
      -e MYSQL_PASSWORD=password \
      -e MONGO_URI=mongodb://mongo:27017/expansion_management \
      -e JWT_SECRET=your_jwt_secret_key \
      expansion-api >/dev/null 2>&1
    
    echo
    echo "🎉 Setup completed using manual Docker commands!"
    echo
    echo "📋 Access your application at:"
    echo "   🔗 API: http://localhost:3000"
    echo "   📚 Docs: http://localhost:3000/docs"
    echo
    echo "👤 Test Accounts:"
    echo "   👨‍💼 Admin: admin@expansion.com / admin123"
    echo "   👥 Client: englishh7366@gmail.com / password123"
    echo
    echo "🛑 To stop the services later:"
    echo "   docker stop expansion-api mysql-db mongo-db"
    echo "   docker rm expansion-api mysql-db mongo-db"
    echo
    return 0
}

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
if ! $DOCKER_COMPOSE_CMD -f docker-compose.full-install.yml up -d; then
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
echo "🛑 To stop the services later, run: $DOCKER_COMPOSE_CMD -f docker-compose.full-install.yml down"
echo
echo "💡 For more details, check the README.md file"
echo
echo "🔄 You can check the status of services with: $DOCKER_COMPOSE_CMD -f docker-compose.full-install.yml ps"
echo "📝 You can view logs with: $DOCKER_COMPOSE_CMD -f docker-compose.full-install.yml logs -f"
echo
echo "🚀 Enjoy your Expansion Management System!"
echo