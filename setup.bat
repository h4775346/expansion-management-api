@echo off
setlocal enabledelayedexpansion

title Expansion Management System - Setup

echo ========================================
echo Expansion Management System - Setup
echo ========================================
echo.

REM Check if Docker is installed
echo Checking for Docker...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Docker is not installed or not in PATH.
    echo Please install Docker Desktop and make sure it's running.
    echo.
    pause
    exit /b 1
)

echo Docker found.
echo.

echo Please select an option:
echo 1. Simple Setup (Download and run pre-built images)
echo 2. Full Source Setup (Clone repository and build from source)
echo.
echo Press 1 or 2:

choice /c 12 /n
set choice=%errorlevel%

if %choice%==1 (
    echo.
    echo Starting simple setup with pre-built images...
    echo.
    
    REM Download docker-compose.yml
    echo Downloading docker-compose.yml...
    powershell -Command "Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml' -OutFile 'docker-compose.yml'"
    
    REM Run Docker Compose
    echo Starting services...
    docker-compose up -d
    
    echo.
    echo Setup complete! The system is starting up.
    echo.
    echo This may take 2-3 minutes for the first run as it:
    echo - Pulls required Docker images
    echo - Sets up databases
    echo - Runs migrations and seeds data
    echo.
    echo Once running, access your application at:
    echo API: http://localhost:3000
    echo Docs: http://localhost:3000/docs
    echo.
    echo Test Accounts:
    echo Admin: admin@example.com / admin123
    echo Client: englishh7366@gmail.com / password123
    echo.
    echo To stop the services later, run: docker-compose down
    echo.
    pause
) else (
    echo.
    echo Starting full source setup...
    echo.
    
    REM Check if Git is installed
    echo Checking for Git...
    git --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Git is not installed.
        echo Please install Git and try again.
        echo.
        pause
        exit /b 1
    )
    
    echo Git found.
    echo.
    
    REM Clone the repository
    echo Cloning repository...
    git clone https://github.com/h4775346/expansion-management-api.git
    cd expansion-management-api
    
    REM Run Docker Compose with full installation
    echo Starting full installation...
    docker-compose -f docker-compose.full-install.yml up -d
    
    echo.
    echo Full source setup complete!
    echo.
    echo This may take 3-5 minutes for the first run as it:
    echo - Pulls required Docker images
    echo - Builds the application from source
    echo - Sets up databases
    echo - Runs migrations and seeds data
    echo.
    echo Once running, access your application at:
    echo API: http://localhost:3000
    echo Docs: http://localhost:3000/docs
    echo.
    echo Test Accounts:
    echo Admin: admin@example.com / admin123
    echo Client: englishh7366@gmail.com / password123
    echo.
    echo To stop the services later, run: docker-compose -f docker-compose.full-install.yml down
    echo.
    pause
)