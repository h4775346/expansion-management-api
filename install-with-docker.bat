@echo off
title Expansion Management System - Docker Installation

echo 🚀 Starting Expansion Management System Installation with Docker...

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed or not in PATH.
    echo Please install Docker Desktop and make sure it's running.
    echo Visit: https://docs.docker.com/get-docker/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker found.

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    docker compose version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Docker Compose is not installed.
        echo Please install Docker Compose and try again.
        echo Visit: https://docs.docker.com/compose/install/
        echo.
        pause
        exit /b 1
    ) else (
        set DOCKER_COMPOSE_CMD=docker compose
    )
) else (
    set DOCKER_COMPOSE_CMD=docker-compose
)

echo ✅ Docker Compose found.

REM Start all services
echo 🔄 Starting all services...
%DOCKER_COMPOSE_CMD% up -d

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
echo 🛑 To stop the services later, run: %DOCKER_COMPOSE_CMD% down
echo.
pause