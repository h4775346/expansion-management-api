@echo off
title Expansion Management System - One-Command Setup

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    EXPANSION MANAGEMENT SYSTEM SETUP                         ║
echo ║                           One-Command Installer                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Starting setup process...

REM Check if Docker is installed
echo 🔍 Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker is not installed or not in PATH.
    echo    Please install Docker Desktop and try again.
    echo    Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo ✅ Docker found.

REM Download necessary files
echo 📥 Downloading necessary files...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.full-install.yml' -OutFile 'docker-compose.full-install.yml'"
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile.prod' -OutFile 'Dockerfile.prod'"

REM Start with Docker Compose
echo 🐳 Starting all services with Docker Compose...
docker-compose -f docker-compose.full-install.yml up -d

echo.
echo 🎉 Setup initiated! Services are starting up...
echo.
echo ⏳ This may take 3-5 minutes for the first time as Docker pulls images and builds the application.
echo.
echo 📋 Once running, access your application at:
echo    🔗 API: http://localhost:3000
echo    📚 Docs: http://localhost:3000/docs
echo.
echo 👤 Test Accounts:
echo    👨‍💼 Admin: admin@expansion.com / admin123
echo    👥 Client: englishh7366@gmail.com / password123
echo.
echo 🛑 To stop the services later, run: docker-compose -f docker-compose.full-install.yml down
echo.
echo 💡 For more details, check the README.md file
echo.
echo 🚀 Enjoy your Expansion Management System!
echo.
pause