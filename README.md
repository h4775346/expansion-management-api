# 🚀 Expansion Management System API

A **production-ready backend system** for managing client projects, vendor matching, and analytics using **NestJS, MySQL, and MongoDB**.

[![Build Status](https://github.com/h4775346/expansion-management-api/workflows/CI/badge.svg)](https://github.com/h4775346/expansion-management-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)

## 📖 Table of Contents

- [🌟 Overview](#-overview)
  - [Key Features](#key-features)
  - [Smart Matching Algorithm](#smart-matching-algorithm)
- [⚡ Quick Start](#-quick-start)
  - [Simplest Setup](#simplest-setup)
  - [Prerequisites](#prerequisites)
- [⚙️ Installation](#️-installation)
  - [Local Installation (Without Docker)](#local-installation-without-docker)
  - [Docker Installation](#docker-installation)
- [🔐 Configuration](#-configuration)
  - [Environment Variables](#environment-variables)
- [🚀 Running the Application](#-running-the-application)
  - [With Docker (Recommended)](#with-docker-recommended)
  - [Locally](#locally)
- [📘 API Documentation](#-api-documentation)
  - [Authentication](#authentication)
- [📂 Project Structure](#-project-structure)
- [🌱 Database](#-database)
  - [Seeding](#seeding)
  - [Test Data & Accounts](#test-data--accounts)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
  - [Production Deployment](#production-deployment)
  - [Docker Deployment](#docker-deployment)
  - [Health Checks](#health-checks)
- [📚 Documentation](#-documentation)
- [🔄 CI/CD](#-cicd)
- [🛠️ Development Tools](#️-development-tools)
  - [Makefile Commands](#makefile-commands)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)
- [🆘 Support](#-support)

## 🌟 Overview

### Key Features

- **🔐 Authentication**: JWT-based authentication with role-based access control (client, admin)
- **📋 Project Management**: Create and manage client projects with country and service requirements
- **🏢 Vendor Management**: Maintain vendor database with services and countries
- **🤖 Smart Matching**: Automated vendor-project matching based on country and service overlap
- **📚 Research Documents**: Store and search research documents in MongoDB with text indexing
- **📊 Analytics**: Top vendor analytics with research document counts
- **📧 Notifications**: Email notifications for high-score matches
- **⏰ Scheduling**: Daily job to rebuild matches and check SLA violations

### Smart Matching Algorithm

The Expansion Management System uses an intelligent matching algorithm to connect clients with suitable vendors based on project requirements. Here's how it works:

#### How Matching Works

1. **Project Creation**: Clients create projects specifying required services and target countries
2. **Vendor Database**: Vendors register their capabilities including offered services and serviceable countries
3. **Automated Matching**: The system automatically matches projects with vendors based on:
   - **Service Overlap**: Projects and vendors must have matching service capabilities
   - **Country Overlap**: Projects and vendors must operate in the same countries
   - **Scoring System**: Each match is scored based on the percentage of service and country overlap

#### Matching Formula

The matching score is calculated using the following formula:

```
Match Score = (Service Match % + Country Match %) / 2
```

Where:
- **Service Match %** = (Number of matching services / Total project services) × 100
- **Country Match %** = (Number of matching countries / Total project countries) × 100

#### Example

A project requiring:
- Services: Web Development, Mobile App Development
- Countries: USA, Canada

A vendor offering:
- Services: Web Development, UI/UX Design, Mobile App Development
- Countries: USA, UK, Canada

Matching calculation:
- Service Match % = (2 matching services / 2 project services) × 100 = 100%
- Country Match % = (2 matching countries / 2 project countries) × 100 = 100%
- Final Score = (100% + 100%) / 2 = 100%

#### High-Score Notifications

When a match scores above a certain threshold (configurable), the system:
1. Automatically notifies the client via email
2. Provides details about the matched vendor
3. Includes the match score and overlapping services/countries

#### Daily Rebuilding

The matching system runs daily to:
- Rebuild all matches for existing projects
- Incorporate newly added vendors
- Update matches when project or vendor details change
- Check for SLA violations (projects without sufficient matches)

## ⚡ Quick Start

### Simplest Setup

Get started in seconds with our one-command setup:

#### 🪟 Windows (PowerShell)
```powershell
curl -s -o install-with-docker.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.bat; .\install-with-docker.bat
```

#### 🪟 Windows (CMD)
``cmd
curl -s -o install-with-docker.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.bat && .\install-with-docker.bat
```

#### 🐧 macOS/Linux
```
curl -s https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.sh | sh
```

That's it! The system will automatically:
- 📦 Clone the repository to a new directory
- 🏗️ Build and start all services with Docker
- 🗄️ Set up MySQL and MongoDB
- 🔄 Run database migrations
- 🌱 Seed the database
- ▶️ Start the application

🎯 **Access at: http://localhost:3000**

### Prerequisites

#### For Docker Installation (Recommended)
- **Docker** and **Docker Compose**
- **Git** (to clone the repository)

#### For Local Installation
- **Node.js** (v20 or higher)
- **npm**
- **MySQL** server
- **MongoDB** server

## ⚙️ Installation

### Local Installation (Without Docker)

#### 🪟 Windows (PowerShell)
```powershell
curl -s -o install-local.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-local.bat; .\install-local.bat
```

#### 🪟 Windows (CMD)
```cmd
curl -s -o install-local.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-local.bat && .\install-local.bat
```

#### 🐧 macOS/Linux
```bash
curl -s https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-local.sh | sh
```

### Docker Installation

#### 🪟 Windows (PowerShell)
```powershell
curl -s -o install-with-docker.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.bat; .\install-with-docker.bat
```

#### 🪟 Windows (CMD)
``cmd
curl -s -o install-with-docker.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.bat && .\install-with-docker.bat
```

#### 🐧 macOS/Linux
```bash
curl -s https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.sh | sh
```

## 🔐 Configuration

### Environment Variables

The following environment variables are required:

| Variable | Description | Default |
|----------|-------------|---------|
| `MYSQL_HOST` | MySQL database host | localhost |
| `MYSQL_PORT` | MySQL database port | 3307 |
| `MYSQL_DB` | MySQL database name | expansion_management |
| `MYSQL_USER` | MySQL username | root |
| `MYSQL_PASSWORD` | MySQL password | password |
| `MONGO_URI` | MongoDB connection URI | mongodb://localhost:27017/expansion_management |
| `JWT_SECRET` | JWT secret key | your_jwt_secret_key |
| `SMTP_HOST` | SMTP server host | smtp.example.com |
| `SMTP_PORT` | SMTP server port | 587 |
| `SMTP_USER` | SMTP username | your_email@example.com |
| `SMTP_PASS` | SMTP password | your_email_password |

For a complete list of environment variables, see [.env.example](.env.example).

**Important**: You must update the `JWT_SECRET` in your `.env` file with a strong secret key. Using the default placeholder value will cause authentication to fail with "secretOrPrivateKey must have a value" error.

### Common Configuration Issues

#### JWT Secret Not Set
If you encounter the error "secretOrPrivateKey must have a value", it means the JWT_SECRET environment variable is not properly configured:

1. Check that you have a `.env` file in the root directory
2. Ensure `JWT_SECRET` is set to a strong secret key (not the placeholder value)
3. Restart the application after making changes

Example of a proper `.env` configuration:
```bash
# JWT Configuration
JWT_SECRET=your_strong_secret_key_here_change_this_in_production
```

## 🚀 Running the Application

### With Docker (Recommended)

```bash
# Start all services in development mode (with live reloading and auto-seeding)
docker compose -f docker-compose.dev.yml up

# Start all services in production mode
docker compose up

# Start all services with automatic database setup (migrations + seeding)
docker compose -f docker-compose.full-install.yml up

# Run development environment with helper script
./run-dev-docker.sh  # Linux/macOS
run-dev-docker.bat   # Windows

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop services
docker compose -f docker-compose.dev.yml down
```

The development mode (`docker-compose.dev.yml`) provides:
- Live code reloading (changes to your source code are reflected immediately)
- Automatic database migrations and seeding on startup
- Development environment variables
- Volume mounting for real-time code changes

### Locally

1. Start the databases:
```bash
# You need to start MySQL and MongoDB manually
# Make sure they're running on the ports specified in your .env file
```

2. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## 📘 API Documentation

- **Swagger UI**: `http://localhost:3000/docs`
- **OpenAPI JSON**: `http://localhost:3000/docs/openapi.json`
- **Postman Collection**: Available in `docs/postman_collection.json`

### Authentication

Most endpoints require authentication. To authenticate:

1. Register a new user: `POST /auth/register`
2. Login to get a JWT token: `POST /auth/login`
3. Use the token in the Authorization header: `Bearer <your-token>`

Example:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "englishh7366@gmail.com", "password": "password123"}'
```

## 📂 Project Structure

```
src/
├── auth/          # Authentication module
├── clients/       # Client management
├── projects/      # Project management
├── vendors/       # Vendor management
├── matches/       # Match entities
├── matching/      # Matching logic and endpoints
├── research/      # Research document management
├── analytics/     # Analytics endpoints
├── notifications/ # Notification system
├── scheduler/     # Scheduled jobs
└── common/        # Shared utilities, DTOs, guards
```

## 🌱 Database

### Seeding

To seed the database with sample data:

```bash
# Seed the database
npm run seed:run

# Fresh migration and seed
npm run migrate-fresh-seed
```

### Test Data & Accounts

After seeding, the following test data will be available:

#### 👨‍💼 Admin Account
```
Email: admin@example.com
Password: admin123
Role: admin
```

#### 👥 Client Accounts
```
1. Protik Service
   Email: englishh7366@gmail.com
   Password: password123
   Role: client

2. Abanoub Hany
   Email: sw.abanoub.hany@gmail.com
   Password: password123
   Role: client

3. Ali Hany
   Email: a10979516@gmail.com
   Password: password123
   Role: client

4. Yahoo User
   Email: englishh7366@yahoo.com
   Password: password123
   Role: client
```

#### 🏢 Sample Vendors
- **Tech Solutions Inc.** (USA) - Web Development, Mobile App Development, UI/UX Design
- **Cloud Experts LLC** (UK, Germany, France) - Cloud Infrastructure, Data Analytics
- **Security First Ltd.** (USA, UK, Australia) - Cybersecurity, AI/Machine Learning
- **Innovate Tech Co.** (Japan, South Korea, Singapore) - Web Development, DevOps, Blockchain
- **Global IT Services** (India, Brazil, Mexico) - Mobile App Development, Data Analytics, IoT Solutions

#### 📋 Sample Projects
- **USA Web Project** for Protik Service (USA) - Web Development, UI/UX Design
- **UK Mobile Project** for Abanoub Hany (UK) - Mobile App Development, DevOps, Cloud Infrastructure
- **German Data Project** for Ali Hany (Germany) - Data Analytics, Cybersecurity
- **Japanese AI Project** for Yahoo User (Japan) - AI/Machine Learning, Blockchain

#### 📚 Research Documents
- Market analysis for USA expansion
- Competitor research for Tech Solutions Inc.
- UK mobile app market trends
- German cybersecurity regulations
- Japanese AI market opportunities

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov

# Run linter
npm run lint
```

## 📦 Deployment

### Production Deployment

1. Set up your production environment variables in `.env`
2. Build the application:
```bash
npm run build
```

3. Start the application:
```bash
npm run start:prod
```

### Docker Deployment

The system supports multiple Docker deployment approaches:

#### Development Mode (with Volume Mounting)
This approach mounts your local source code into the container, allowing for live code changes without rebuilding:

```bash
# Build and start all services with volume mounting for development
docker compose -f docker-compose.dev.yml up

# Changes to your source code will be reflected immediately
```

The development configuration uses a specialized Dockerfile.dev that:
- Skips the build step for faster startup
- Uses volume mounting for real-time code changes
- Automatically runs database migrations and seeding
- Starts the application in development mode with live reloading

#### Full Installation Mode (Recommended for First-Time Setup)
This approach automatically handles database setup including migrations and seeding:

```bash
# Build and start all services with automatic database setup
docker compose -f docker-compose.full-install.yml up

# The system will automatically:
# 1. Run database migrations
# 2. Seed the database with sample data
# 3. Start the application
```

#### Production Mode
For production deployment, the system uses a multi-stage Dockerfile to create optimized images:

```bash
# Start all services using the production configuration
docker compose up
```

### Health Checks

The application provides health check endpoints:
- Application health: `GET /health`
- Database connectivity: Checked in health endpoint

## 📚 Documentation

- [System Design](docs/SYSTEM_DESIGN.md)
- [System Implementation](docs/SYSTEM_IMPLEMENTATION.md)
- [Runbook](docs/RUNBOOK.md)
- [Architecture Decision Records](docs/ADR/)

## 🔄 CI/CD

This project includes GitHub Actions for continuous integration:

- Code linting
- Unit tests
- Security scanning

To set up CI/CD:

1. Fork this repository
2. Enable GitHub Actions in your fork
3. Configure secrets in your repository settings:
   - `DOCKER_USERNAME` - Your Docker Hub username
   - `DOCKER_PASSWORD` - Your Docker Hub password/token

The CI/CD pipeline is defined in [.github/workflows/ci.yml](.github/workflows/ci.yml).

### Fixing CI/CD Dependency Issues

If you encounter dependency conflicts in CI/CD (such as "lock file's @nestjs/schedule@6.0.0 does not satisfy @nestjs/schedule@4.1.2"), 
regenerate the package-lock.json file:

```bash
# Run the regeneration script
./regenerate-lockfile.sh

# Or on Windows
regenerate-lockfile.bat
```

This will:
1. Remove the outdated package-lock.json
2. Regenerate it with proper dependency resolution using --legacy-peer-deps flag
3. Fix version mismatches that cause CI/CD failures

After running the script, commit the updated package-lock.json file.

## 🛠️ Development Tools

### Makefile Commands

The project includes a Makefile with common commands:

```bash
# Build the application (requires source code)
make build

# Start all services in development mode
make start

# Start all services in production mode
make start-prod

# Run unit tests (requires source code)
make test

# Run e2e tests (requires source code)
make test-e2e

# Generate documentation (requires source code)
make docs

# Seed the database (requires source code)
make seed
```

For a complete list of commands, see [Makefile](Makefile).

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue on GitHub.