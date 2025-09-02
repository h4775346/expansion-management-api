@echo off
title Expansion Management System Setup

echo ========================================
echo Expansion Management System Setup
echo ========================================
echo.

echo This setup will:
echo 1. Clone the repository
echo 2. Start all services with Docker Compose
echo.

REM Check if Git is installed
echo Checking for Git...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in PATH.
    echo Please install Git and try again.
    pause
    exit /b 1
)

echo Git found.
echo.

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker found.
echo.

REM Clone the repository
echo Cloning repository...
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

echo Starting services with Docker Compose...
docker-compose up -d

echo.
echo Setup initiated!
echo.
echo Wait 2-3 minutes for services to fully start, then access:
echo API: http://localhost:3000
echo Docs: http://localhost:3000/docs
echo.
echo To initialize the database, run these commands after services are up:
echo docker-compose exec api npm run migration:run
echo docker-compose exec api npm run seed:run
echo.
echo To stop services later: docker-compose down
echo.

pause