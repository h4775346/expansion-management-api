@echo off
REM Script to build and push Docker image to Docker Hub

REM Configuration
set IMAGE_NAME=expansion-management-api
set DOCKER_HUB_USER=abanoubhany
set REPO_NAME=expansion-management-api
set VERSION=v1.0.0
set LATEST=latest

echo 🚀 Starting Docker image build and push process...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Login to Docker Hub
echo 🔐 Logging in to Docker Hub...
docker login
if %errorlevel% neq 0 (
    echo ❌ Docker login failed. Please check your credentials.
    exit /b 1
)

REM Build the image
echo 🏗️ Building Docker image...
docker build -t %IMAGE_NAME% .
if %errorlevel% neq 0 (
    echo ❌ Docker build failed.
    exit /b 1
)

REM Tag the image
echo 🏷️ Tagging Docker image...
docker tag %IMAGE_NAME% %DOCKER_HUB_USER%/%REPO_NAME%:%VERSION%
docker tag %IMAGE_NAME% %DOCKER_HUB_USER%/%REPO_NAME%:%LATEST%

REM Push version tag
echo 📤 Pushing version tag %VERSION%...
docker push %DOCKER_HUB_USER%/%REPO_NAME%:%VERSION%
if %errorlevel% neq 0 (
    echo ❌ Failed to push version tag.
    exit /b 1
)

REM Push latest tag
echo 📤 Pushing latest tag...
docker push %DOCKER_HUB_USER%/%REPO_NAME%:%LATEST%
if %errorlevel% neq 0 (
    echo ❌ Failed to push latest tag.
    exit /b 1
)

echo ✅ Docker image successfully pushed to Docker Hub!
echo Image URLs:
echo   - https://hub.docker.com/r/%DOCKER_HUB_USER%/%REPO_NAME%/tags?page=1&name=%VERSION%
echo   - https://hub.docker.com/r/%DOCKER_HUB_USER%/%REPO_NAME%/tags?page=1&name=%LATEST%

pause