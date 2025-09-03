#!/bin/bash

# Expansion Management System - Local Installation (without Docker)
# This script works on Linux and macOS

echo "🚀 Starting Expansion Management System Local Installation..."

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
if ! command_exists node; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js (version 18 or higher) and try again."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js is installed: $NODE_VERSION"

# Check if npm is installed
if ! command_exists npm; then
    echo "❌ npm is not installed."
    echo "Please install npm and try again."
    exit 1
fi

echo "✅ npm is installed: $(npm -v)"

# Check if MySQL client is installed
if ! command_exists mysql; then
    echo "⚠️  MySQL client is not installed."
    echo "You'll need to install MySQL server separately and configure it manually."
    echo "Visit: https://dev.mysql.com/downloads/mysql/"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Build the application
echo "🏗️ Building application..."
npm run build

# Instructions for setting up databases
echo
echo "📋 Database Setup Instructions:"
echo "1. Install and start MySQL server (if not already done)"
echo "2. Create a database named 'expansion_management'"
echo "3. Update .env file with your database credentials"
echo "4. Run migrations: npm run migration:run"
echo "5. Seed the database: npm run seed:run"
echo
echo "Example MySQL commands:"
echo "   mysql -u root -p"
echo "   CREATE DATABASE expansion_management;"
echo "   exit"
echo
echo "Then edit .env file with your database settings:"
echo "   MYSQL_HOST=localhost"
echo "   MYSQL_PORT=3306"
echo "   MYSQL_DB=expansion_management"
echo "   MYSQL_USER=your_username"
echo "   MYSQL_PASSWORD=your_password"
echo
echo "Start the application with: npm run start:prod"
echo