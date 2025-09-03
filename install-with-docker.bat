@echo off
setlocal enabledelayedexpansion

echo 🚀 Starting Expansion Management System Installation with Docker...
echo.

:: Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    echo Please install Docker and try again.
    echo Visit: https://docs.docker.com/get-docker/
    exit /b 1
)

echo ✅ Docker is installed: 
for /f "tokens=*" %%i in ('docker --version') do echo %%i

:: Check if Git is installed (needed for cloning the repository)
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed.
    echo Git is required to download the source code.
    echo Please install Git and try again.
    echo Visit: https://git-scm.com/downloads
    exit /b 1
)

echo ✅ Git is installed

:: Create a temporary directory and clone the repository
echo 📥 Cloning the Expansion Management System repository...
set TEMP_DIR=expansion-management-%RANDOM%%RANDOM%
git clone https://github.com/h4775346/expansion-management-api.git "%TEMP_DIR%"

:: Verify clone was successful
if not exist "%TEMP_DIR%\package.json" (
    echo ❌ Failed to clone the repository or locate package.json
    rmdir /s /q "%TEMP_DIR%"
    exit /b 1
)

echo ✅ Repository cloned successfully

:: Change to the cloned directory
cd "%TEMP_DIR%"

:: Start all services with the full installation configuration
echo 🔄 Starting all services with full installation configuration...
echo    This may take 2-3 minutes for the first time as Docker:
echo    - Builds the application image
echo    - Sets up databases
echo    - Runs migrations and seeding
echo.

docker compose -f docker-compose.full-install.yml up -d

:: Check if services started successfully
if %errorlevel% equ 0 (
    echo ✅ Services started successfully!
) else (
    echo ❌ Failed to start services. Check the output above for details.
    exit /b 1
)

echo.
echo 🎉 Installation completed successfully!
echo.
echo 📋 Once running, access your application at:
echo    🔗 API: http://localhost:3000
echo    📚 Docs: http://localhost:3000/docs
echo.
echo 👤 Test Accounts:
echo    👨‍💼 Admin: admin@example.com / admin123
echo    👥 Client: englishh7366@gmail.com / password123
echo.
echo 🛑 To stop the services later, run: docker compose -f docker-compose.full-install.yml down
echo.
echo 📁 The application is installed in: %cd%
echo.