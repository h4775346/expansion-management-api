@echo off
title Expansion Management System - One Click Setup

echo ========================================
echo Expansion Management System - One Click Setup
echo ========================================

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    echo Please install Docker Desktop and make sure it's running.
    pause
    exit /b 1
)

echo Docker found.

REM Download the docker-compose file directly
echo Downloading docker-compose.full-install.yml...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.full-install.yml' -OutFile 'docker-compose.full-install.yml'"

REM Run the setup
echo Starting one-click setup...
docker-compose -f docker-compose.full-install.yml up -d

echo.
echo One-click setup initiated!
echo.
echo This will take 3-5 minutes for the first run as it:
echo 1. Pulls all required Docker images
echo 2. Builds the application
echo 3. Sets up the databases
echo 4. Runs migrations and seeds
echo 5. Starts the application
echo.
echo Once running, access the application at:
echo API: http://localhost:3000
echo Docs: http://localhost:3000/docs
echo.
echo Sample user credentials:
echo Email: englishh7366@gmail.com
echo Password: password123
echo.
echo To stop the services later, run:
echo docker-compose -f docker-compose.full-install.yml down
echo.
pause