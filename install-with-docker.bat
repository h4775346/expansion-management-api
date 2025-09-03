@echo off
title Expansion Management System - Docker Installation

echo 🚀 Starting Expansion Management System Installation with Docker...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker and try again.
    echo Visit: https://docs.docker.com/get-docker/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is installed: 
docker --version
echo.

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed.
    echo Please install Docker Compose and try again.
    echo Visit: https://docs.docker.com/compose/install/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Compose is installed:
docker-compose --version
echo.

REM Start all services with development configuration
echo 🔄 Starting all services with development configuration...
docker-compose -f docker-compose.dev.yml up -d

echo.
echo 🎉 Installation completed successfully!
echo.
echo ⏳ This may take 2-3 minutes for the first time as Docker:
echo    - Builds the application image
echo    - Sets up databases
echo    - Runs migrations and seeding
echo.
echo 📋 Once running, access your application at:
echo    🔗 API: http://localhost:3000
echo    📚 Docs: http://localhost:3000/docs
echo.
echo 👤 Test Accounts:
echo    👨‍💼 Admin: admin@example.com / admin123
echo    👥 Client: englishh7366@gmail.com / password123
echo.
echo 🛑 To stop the services later, run: docker-compose -f docker-compose.dev.yml down
echo.
pause