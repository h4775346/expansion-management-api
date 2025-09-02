@echo off
title Expansion Management System - Simple Setup

echo ========================================
echo Expansion Management System - Simple Setup
echo ========================================

echo This will download and start the complete system.
echo.

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker found.
echo.

echo Starting system with Docker Compose...
docker-compose up -d

echo.
echo System is starting up! This may take 2-3 minutes.
echo.
echo Once ready, access your application at:
echo API: http://localhost:3000
echo Docs: http://localhost:3000/docs
echo.
echo Login with:
echo Email: englishh7366@gmail.com
echo Password: password123
echo.
echo To stop the system later, run: docker-compose down
echo.

pause