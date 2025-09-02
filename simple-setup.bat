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

REM Download docker-compose file
powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml' -OutFile 'docker-compose.yml'"

REM Start everything
docker-compose up -d

echo.
echo System starting... Access at: http://localhost:3000
echo Login: englishh7366@gmail.com / password123
echo To stop: docker-compose down
echo.

pause