@echo off
title Expansion Management System - Local Installation

echo 🚀 Starting Expansion Management System Local Installation...

REM Check if Node.js is installed
echo Checking for Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed.
    echo Please install Node.js (version 18 or higher) and try again.
    echo Visit: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js is installed: %NODE_VERSION%

REM Check if npm is installed
echo Checking for npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed.
    echo Please install npm and try again.
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm is installed: %NPM_VERSION%

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps

REM Build the application
echo 🏗️ Building application...
npm run build

REM Instructions for setting up databases
echo.
echo 📋 Database Setup Instructions:
echo 1. Install and start MySQL server (if not already done)
echo 2. Create a database named 'expansion_management'
echo 3. Update .env file with your database credentials
echo 4. Run migrations: npm run migration:run
echo 5. Seed the database: npm run seed:run
echo.
echo Example MySQL commands:
echo    mysql -u root -p
echo    CREATE DATABASE expansion_management;
echo    exit
echo.
echo Then edit .env file with your database settings:
echo    MYSQL_HOST=localhost
echo    MYSQL_PORT=3306
echo    MYSQL_DB=expansion_management
echo    MYSQL_USER=your_username
echo    MYSQL_PASSWORD=your_password
echo.
echo Start the application with: npm run start:prod
echo.
pause