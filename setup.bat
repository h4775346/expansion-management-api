@echo off
title Expansion Management System - One-Command Setup

echo ╔══════════════════════════════════════════════════════════════════════════════╗
echo ║                    EXPANSION MANAGEMENT SYSTEM SETUP                         ║
echo ║                           One-Command Installer                              ║
echo ╚══════════════════════════════════════════════════════════════════════════════╝
echo.

echo 🚀 Starting setup process...

REM Check if Git is installed
echo 🔍 Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Git is not installed or not in PATH.
    echo    Please install Git and try again.
    echo    Download from: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git found.

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

REM Clone the repository
echo 📥 Cloning repository from GitHub...
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

REM Copy environment file
echo ⚙️  Setting up environment...
copy .env.example .env >nul

REM Start with Docker Compose
echo 🐳 Starting all services with Docker Compose...
docker-compose up -d

echo.
echo 🎉 Setup initiated! Services are starting up...
echo.
echo ⏳ This may take 2-3 minutes for the first time as Docker pulls images.
echo.
echo 📋 Once running, access your application at:
echo    🔗 API: http://localhost:3000
echo    📚 Docs: http://localhost:3000/docs
echo.
echo 👤 Test Accounts:
echo    👨‍💼 Admin: admin@expansion.com / admin123
echo    👥 Client: englishh7366@gmail.com / password123
echo.
echo 🛑 To stop the services later, run: docker-compose down
echo.
echo 💡 For more details, check the README.md file
echo.
echo 🚀 Enjoy your Expansion Management System!
echo.
pause