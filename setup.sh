#!/bin/bash

# Expansion Management System Setup Script

echo "========================================"
echo "Expansion Management System Setup"
echo "========================================"
echo

echo "This setup will:"
echo "1. Clone the repository"
echo "2. Start all services with Docker Compose"
echo

# Check if Git is installed
echo "Checking for Git..."
if ! command -v git &> /dev/null
then
    echo "Error: Git is not installed."
    echo "Please install Git and try again."
    exit 1
fi
echo "Git found."
echo

# Check if Docker is installed
echo "Checking for Docker..."
if ! command -v docker &> /dev/null
then
    echo "Error: Docker is not installed."
    echo "Please install Docker and try again."
    exit 1
fi
echo "Docker found."
echo

# Clone the repository
echo "Cloning repository..."
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

# Start services with Docker Compose
echo "Starting services with Docker Compose..."
docker-compose up -d

echo
echo "Setup initiated!"
echo
echo "Wait 2-3 minutes for services to fully start, then access:"
echo "API: http://localhost:3000"
echo "Docs: http://localhost:3000/docs"
echo
echo "To initialize the database, run these commands after services are up:"
echo "docker-compose exec api npm run migration:run"
echo "docker-compose exec api npm run seed:run"
echo
echo "To stop services later: docker-compose down"
echo