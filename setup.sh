#!/bin/bash

# Expansion Management System - Universal One-Command Setup
# This script automatically detects your Linux distribution and installs Docker/Docker Compose if needed

echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    EXPANSION MANAGEMENT SYSTEM SETUP                         ║"
echo "║                        Universal Linux Installer                             ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo

# Function to detect Linux distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$NAME
        VERSION=$VERSION_ID
    elif command -v lsb_release >/dev/null 2>&1; then
        DISTRO=$(lsb_release -si)
        VERSION=$(lsb_release -sr)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        DISTRO=$DISTRIB_ID
        VERSION=$DISTRIB_RELEASE
    elif [ -f /etc/debian_version ]; then
        DISTRO="Debian"
        VERSION=$(cat /etc/debian_version)
    else
        DISTRO=$(uname -s)
        VERSION=$(uname -r)
    fi
    echo "Detected distribution: $DISTRO $VERSION"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Docker based on distribution
install_docker() {
    echo "📦 Installing Docker..."
    
    if [[ "$DISTRO" == *"Ubuntu"* ]] || [[ "$DISTRO" == *"Debian"* ]]; then
        # Ubuntu/Debian
        sudo apt update
        sudo apt install -y apt-transport-https ca-certificates curl gnupg lsb-release
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt update
        sudo apt install -y docker-ce docker-ce-cli containerd.io
    elif [[ "$DISTRO" == *"CentOS"* ]] || [[ "$DISTRO" == *"Red Hat"* ]] || [[ "$DISTRO" == *"RHEL"* ]]; then
        # CentOS/RHEL
        sudo yum install -y yum-utils
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
        sudo yum install -y docker-ce docker-ce-cli containerd.io
    elif [[ "$DISTRO" == *"Fedora"* ]]; then
        # Fedora
        sudo dnf -y install dnf-plugins-core
        sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
        sudo dnf install -y docker-ce docker-ce-cli containerd.io
    else
        # Fallback to generic installation
        echo "Attempting generic Docker installation..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        rm get-docker.sh
    fi
    
    # Start and enable Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Add user to docker group
    if command_exists sudo && command_exists usermod; then
        sudo usermod -aG docker $USER
        echo "Added $USER to docker group. You may need to log out and back in."
    fi
}

# Function to install Docker Compose
install_docker_compose() {
    echo "🔧 Installing Docker Compose..."
    
    # Try to install via package manager first
    if [[ "$DISTRO" == *"Ubuntu"* ]] || [[ "$DISTRO" == *"Debian"* ]]; then
        # Check if docker-compose-plugin is available (newer approach)
        if sudo apt install -y docker-compose-plugin 2>/dev/null; then
            echo "Docker Compose plugin installed"
            return 0
        fi
    elif [[ "$DISTRO" == *"CentOS"* ]] || [[ "$DISTRO" == *"Red Hat"* ]] || [[ "$DISTRO" == *"RHEL"* ]]; then
        if sudo yum install -y docker-compose-plugin 2>/dev/null; then
            echo "Docker Compose plugin installed"
            return 0
        fi
    elif [[ "$DISTRO" == *"Fedora"* ]]; then
        if sudo dnf install -y docker-compose-plugin 2>/dev/null; then
            echo "Docker Compose plugin installed"
            return 0
        fi
    fi
    
    # Fallback to direct download
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    
    # Create symlink if docker-compose command doesn't work
    if ! command -v docker-compose >/dev/null 2>&1; then
        sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose 2>/dev/null || true
    fi
}

# Main setup process
main() {
    echo "🚀 Starting universal setup process..."
    
    # Detect distribution
    detect_distro
    
    # Check for required tools
    if ! command_exists curl; then
        echo "Installing curl..."
        if [[ "$DISTRO" == *"Ubuntu"* ]] || [[ "$DISTRO" == *"Debian"* ]]; then
            sudo apt update && sudo apt install -y curl
        elif [[ "$DISTRO" == *"CentOS"* ]] || [[ "$DISTRO" == *"Red Hat"* ]] || [[ "$DISTRO" == *"RHEL"* ]]; then
            sudo yum install -y curl
        elif [[ "$DISTRO" == *"Fedora"* ]]; then
            sudo dnf install -y curl
        fi
    fi
    
    # Check if Docker is installed
    if ! command_exists docker; then
        echo "🐳 Docker not found. Installing Docker..."
        install_docker
    else
        echo "✅ Docker already installed: $(docker --version)"
    fi
    
    # Check if Docker Compose is installed
    if command_exists docker-compose; then
        echo "✅ Docker Compose already installed: $(docker-compose --version)"
        DOCKER_COMPOSE_CMD="docker-compose"
    elif docker compose version &>/dev/null; then
        echo "✅ Docker Compose V2 available"
        DOCKER_COMPOSE_CMD="docker compose"
    else
        echo "🔧 Docker Compose not found. Installing Docker Compose..."
        install_docker_compose
        if command_exists docker-compose; then
            echo "✅ Docker Compose installed: $(docker-compose --version)"
            DOCKER_COMPOSE_CMD="docker-compose"
        elif docker compose version &>/dev/null; then
            echo "✅ Docker Compose V2 available"
            DOCKER_COMPOSE_CMD="docker compose"
        else
            echo "❌ Failed to install Docker Compose. Please install Docker Compose manually."
            exit 1
        fi
    fi
    
    # Download the simple docker-compose file
    echo "📥 Downloading docker-compose.yml..."
    curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml
    
    # Start with Docker Compose
    echo "