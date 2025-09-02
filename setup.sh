#!/bin/bash

# Expansion Management System - One-Command Setup
echo "╔══════════════════════════════════════════════════════════════════════════════╗"
echo "║                    EXPANSION MANAGEMENT SYSTEM SETUP                         ║"
echo "║                           One-Command Installer                              ║"
echo "╚══════════════════════════════════════════════════════════════════════════════╝"
echo

echo "🚀 Starting setup process..."

# Check if Git is installed
echo "🔍 Checking for Git..."
if ! command -v git &> /dev/null
then
    echo "❌ Error: Git is not installed."
    echo "   Please install Git and try again."
    echo "   Download from: https://git-scm.com/downloads"
    exit 1
fi
echo "✅ Git found."

# Check if Docker is installed
echo "🔍 Checking for Docker..."
if ! command -v docker &> /dev/null
then
    echo "❌ Error: Docker is not installed."
    echo "   Please install Docker and try again."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi
echo "✅ Docker found."

# Clone the repository
echo "📥 Cloning repository from GitHub..."
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

# Download the simple docker-compose file
echo "📥 Downloading docker-compose configuration..."
curl -o docker-compose.yml https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.simple.yml

# Copy environment file
echo "⚙️  Setting up environment..."
cp .env.example .env

# Start with Docker Compose
echo "🐳 Starting all services with Docker Compose..."
docker-compose up -d

echo
echo "🎉 Setup initiated! Services are starting up..."
echo
echo "⏳ This may take 2-3 minutes for the first time as Docker pulls images."
echo
echo "📋 Once running, access your application at:"
echo "   🔗 API: http://localhost:3000"
echo "   📚 Docs: http://localhost:3000/docs"
echo
echo "👤 Test Accounts:"
echo "   👨‍💼 Admin: admin@expansion.com / admin123"
echo "   👥 Client: englishh7366@gmail.com / password123"
echo
echo "🛑 To stop the services later, run: docker-compose down"
echo
echo "💡 For more details, check the README.md file"
echo
echo "🚀 Enjoy your Expansion Management System!"
echo