#!/bin/bash

# Script to run the development environment with Docker
# This will start the API, MySQL, and MongoDB services with automatic seeding

echo "🚀 Starting development environment with Docker..."

# Start all services in development mode
docker compose -f docker-compose.dev.yml up

echo "✅ Development environment started!"
echo "📋 Access your application at: http://localhost:3000"
echo "📚 API Documentation: http://localhost:3000/docs"