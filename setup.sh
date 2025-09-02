#!/bin/bash

# Expansion Management System - One-Command Setup
# This script clones, installs, and starts the entire system

echo "🚀 Starting Expansion Management System Setup..."

# Check if required tools are installed
echo "🔍 Checking prerequisites..."
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git and try again."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker and try again."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again."
    exit 1
fi

echo "✅ All prerequisites found!"

# Clone the repository
echo "📥 Cloning repository..."
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
echo "⚙️  Setting up environment..."
cp .env.example .env

# Start with Docker
echo "🐳 Starting services with Docker..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec api npm run migration:run

# Run seed
echo "🌱 Seeding database..."
docker-compose exec api npm run seed:run

# Final message
echo "🎉 Setup complete!"
echo ""
echo "Your Expansion Management System is now running at:"
echo "🔗 API: http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/docs"
echo ""
echo "To stop the services, run: docker-compose down"
echo ""
echo "Sample user credentials (from seed data):"
echo "📧 Email: englishh7366@gmail.com"
echo "🔑 Password: password123"
echo ""
echo "Enjoy your Expansion Management System! 🚀"