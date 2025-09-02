@echo off
title Expansion Management System - One-Command Setup

echo 🚀 Starting Expansion Management System Setup...

REM Check if required tools are installed
echo 🔍 Checking prerequisites...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed. Please install Git and try again.
    pause
    exit /b 1
)

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker and try again.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    pause
    exit /b 1
)

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) and try again.
    pause
    exit /b 1
)

echo ✅ All prerequisites found!

REM Clone the repository
echo 📥 Cloning repository...
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Copy environment file
echo ⚙️  Setting up environment...
copy .env.example .env

REM Start with Docker
echo 🐳 Starting services with Docker...
docker-compose up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Run migrations
echo 📊 Running database migrations...
docker-compose exec api npm run migration:run

REM Run seed
echo 🌱 Seeding database...
docker-compose exec api npm run seed:run

REM Final message
echo 🎉 Setup complete!
echo.
echo Your Expansion Management System is now running at:
echo 🔗 API: http://localhost:3000
echo 📚 API Documentation: http://localhost:3000/docs
echo.
echo To stop the services, run: docker-compose down
echo.
echo Sample user credentials (from seed data):
echo 📧 Email: englishh7366@gmail.com
echo 🔑 Password: password123
echo.
echo Enjoy your Expansion Management System! 🚀
echo.
pause