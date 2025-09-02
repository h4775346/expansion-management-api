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

REM Create a simple docker-compose file for the complete setup
echo Creating docker-compose setup file...
(
echo version: '3.8'
echo.
echo services:
echo   # Clone the repository
echo   clone:
echo     image: alpine/git
echo     volumes:
echo       - ./repo:/repo
echo     working_dir: /repo
echo     command: clone https://github.com/h4775346/expansion-management-api.git app
echo.
echo   # Setup and run the application
echo   app:
echo     image: node:18
echo     volumes:
echo       - ./repo/app:/app
echo     working_dir: /app
echo     ports:
echo       - "3000:3000"
echo     environment:
echo       - MYSQL_HOST=mysql
echo       - MYSQL_PORT=3306
echo       - MYSQL_DB=expansion_management
echo       - MYSQL_USER=root
echo       - MYSQL_PASSWORD=password
echo       - MONGO_URI=mongodb://mongo:27017/expansion_management
echo       - JWT_SECRET=your_jwt_secret_key
echo       - NODE_ENV=development
echo     depends_on:
echo       mysql:
echo         condition: service_healthy
echo       mongo:
echo         condition: service_healthy
echo       clone:
echo         condition: service_started
echo     command: >
echo       sh -c "
echo       apt-get update &&
echo       apt-get install -y python3 make g++ &&
echo       npm install &&
echo       npm run build &&
echo       npm run migration:run &&
echo       npm run seed:run &&
echo       npm run start:prod
echo       "
echo.
echo   mysql:
echo     image: mysql:8.0
echo     environment:
echo       MYSQL_ROOT_PASSWORD: password
echo       MYSQL_DATABASE: expansion_management
echo     ports:
echo       - "3307:3306"
echo     volumes:
echo       - mysql_data:/var/lib/mysql
echo     healthcheck:
echo       test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
echo       timeout: 20s
echo       retries: 10
echo.
echo   mongo:
echo     image: mongo:5.0
echo     ports:
echo       - "27017:27017"
echo     volumes:
echo       - mongo_data:/data/db
echo     healthcheck:
echo       test: echo 'db.runCommand("ping").ok' ^| mongosh localhost:27017/test --quiet
echo       timeout: 20s
echo       retries: 10
echo.
echo volumes:
echo   mysql_data:
echo   mongo_data:
) > docker-compose-setup.yml

REM Run the setup
echo Starting one-click setup...
docker-compose -f docker-compose-setup.yml up -d

echo.
echo One-click setup initiated!
echo.
echo This will take 3-5 minutes for the first run as it:
echo 1. Clones the repository
echo 2. Installs all dependencies
echo 3. Builds the application
echo 4. Sets up the databases
echo 5. Runs migrations and seeds
echo 6. Starts the application
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
echo docker-compose -f docker-compose-setup.yml down
echo.
pause