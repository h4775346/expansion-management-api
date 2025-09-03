@echo off
title Update Expansion Management System from GitHub

echo 🔄 Updating Expansion Management System from GitHub...
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed.
    echo Please install Git and try again.
    echo.
    pause
    exit /b 1
)

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker and try again.
    echo.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed.
    echo Please install Docker Compose and try again.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Compose is installed:
docker-compose --version
echo.

REM Pull latest changes from GitHub
echo 📥 Pulling latest changes from GitHub...
git pull origin main

REM Rebuild and restart services with development configuration
echo 🏗️ Rebuilding and restarting services...
docker-compose -f docker-compose.dev.yml up -d --build

echo.
echo ✅ Update completed successfully!
echo Your Expansion Management System is now running the latest version.
echo.
echo 📋 Access your application at:
echo    🔗 API: http://localhost:3000
echo    📚 Docs: http://localhost:3000/docs
echo.
pause