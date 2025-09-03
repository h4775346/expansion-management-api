@echo off
title Expansion Management System - Docker Installation

echo 🚀 Starting Expansion Management System Installation with Docker...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker and try again.
    echo Visit: https://docs.docker.com/get-docker/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker is installed: 
docker --version
echo.

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed.
    echo Please install Docker Compose and try again.
    echo Visit: https://docs.docker.com/compose/install/
    echo.
    pause
    exit /b 1
)

echo ✅ Docker Compose is installed:
docker-compose --version
echo.

REM Check if Git is installed (needed for cloning the repository)
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed.
    echo Git is required to download the source code.
    echo Please install Git and try again.
    echo Visit: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

REM Create a temporary directory and clone the repository
echo 📥 Cloning the Expansion Management System repository...
set TIMESTAMP=%date:~10,4%%date:~4,2%%date:~7,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TEMP_DIR=expansion-management-%TIMESTAMP:_=%
git clone https://github.com/h4775346/expansion-management-api.git %TEMP_DIR%

REM Verify clone was successful
if not exist "%TEMP_DIR%\package.json" (
    echo ❌ Failed to clone the repository or locate package.json
    rmdir /S /Q %TEMP_DIR%
    pause
    exit /b 1
)

echo ✅ Repository cloned successfully
echo.

REM Change to the cloned directory
cd %TEMP_DIR%

REM Start all services with development configuration
echo 🔄 Starting all services with development configuration...
docker-compose -f docker-compose.dev.yml up -d

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
echo 🛑 To stop the services later, run: docker-compose -f docker-compose.dev.yml down
echo.
echo 📁 The application is installed in: %cd%
echo.
pause