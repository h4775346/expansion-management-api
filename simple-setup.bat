@echo off
title Expansion Management System - Ultra Simple Setup

echo Downloading and starting Expansion Management System...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed.
    echo Please install Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker found. Starting system...

REM Download docker-compose file directly from the repository
echo Downloading docker-compose.full-install.yml...
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.full-install.yml' -OutFile 'docker-compose.full-install.yml'"

REM Start everything
echo Starting all services...
docker-compose -f docker-compose.full-install.yml up -d

echo.
echo System starting... Access at: http://localhost:3000
echo Login: englishh7366@gmail.com / password123
echo To stop: docker-compose -f docker-compose.full-install.yml down
echo.

pause