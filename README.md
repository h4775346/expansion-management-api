# 🚀 Expansion Management System API

A **production-ready backend system** for managing client projects, vendor matching, and analytics using **NestJS, MySQL, and MongoDB**.

[![Build Status](https://github.com/h4775346/expansion-management-api/workflows/CI/badge.svg)](https://github.com/h4775346/expansion-management-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![NestJS](https://img.shields.io/badge/NestJS-v10-red.svg)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)

## 🌟 Key Features

- **🔐 Authentication**: JWT-based authentication with role-based access control (client, admin)
- **📋 Project Management**: Create and manage client projects with country and service requirements
- **🏢 Vendor Management**: Maintain vendor database with services and countries
- **🤖 Smart Matching**: Automated vendor-project matching based on country and service overlap
- **📚 Research Documents**: Store and search research documents in MongoDB with text indexing
- **📊 Analytics**: Top vendor analytics with research document counts
- **📧 Notifications**: Email notifications for high-score matches
- **⏰ Scheduling**: Daily job to rebuild matches and check SLA violations

## 📖 Table of Contents

- [✨ Simplest Setup](#-simplest-setup)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [⚙️ Installation](#️-installation)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Running the Application](#-running-the-application)
  - [🐳 With Docker](#-with-docker)
  - [💻 Locally](#-locally)
- [📘 API Documentation](#-api-documentation)
- [📂 Project Structure](#-project-structure)
- [🌱 Database Seeding](#-database-seeding)
- [🧪 Testing](#-testing)
- [📦 Deployment](#-deployment)
- [📚 Documentation](#-documentation)
- [🔄 CI/CD](#-cicd)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

## ✨ Simplest Setup

Get started in seconds with our one-command setup:

### 🪟 Windows
```
# Download and run the Docker installation script
curl -o install-with-docker.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.bat
.\install-with-docker.bat
```

### 🐧 macOS
```bash
# Download and run the Docker installation script
curl -o install-with-docker.sh https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.sh
chmod +x install-with-docker.sh
./install-with-docker.sh
```

### 🐧 Linux (Ubuntu/Debian)
```bash
# Install Docker and Docker Compose if not already installed
sudo apt update
sudo apt install docker.io docker-compose

# Add current user to docker group
sudo usermod -aG docker $USER
# Log out and back in for this to take effect

# Download and run the Docker installation script
curl -o install-with-docker.sh https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.sh
chmod +x install-with-docker.sh
./install-with-docker.sh
```

### 🐧 Linux (CentOS/RHEL/Fedora)
```
# Install Docker and Docker Compose if not already installed
# CentOS/RHEL
sudo yum install docker docker-compose

# Fedora
sudo dnf install docker docker-compose

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group
sudo usermod -aG docker $USER
# Log out and back in for this to take effect

# Download and run the Docker installation script
curl -o install-with-docker.sh https://raw.githubusercontent.com/h4775346/expansion-management-api/master/install-with-docker.sh
chmod +x install-with-docker.sh
./install-with-docker.sh
```

That's it! The system will automatically:
- 📦 Build and start all services with Docker
- 🗄️ Set up MySQL and MongoDB
- 🔄 Run database migrations
- 🌱 Seed the database
- ▶️ Start the application

🎯 **Access at: http://localhost:3000**

## 📋 Prerequisites

### For Docker Installation (Recommended)
- **Docker** and **Docker Compose**

### For Local Installation
- **Node.js** (v18 or higher)
- **npm**
- **MySQL** server
- **MongoDB** server

## ⚡ Quick Start

### With Docker (Recommended)
```bash
# Option 1: Use the installation script
# Windows:
.\install-with-docker.bat

# macOS/Linux:
./install-with-docker.sh

# Option 2: Manual Docker setup
docker-compose up -d

# The API will be available at http://localhost:3000
```

### Without Docker (Local Installation)
```bash
# Option 1: Use the installation script
# Windows:
.\install-local.bat

# macOS/Linux:
./install-local.sh

# Option 2: Manual local setup
npm install --legacy-peer-deps
npm run build
# Set up databases manually (see instructions in scripts)
npm run start:prod
```

## ⚙️ Installation

### Docker Installation (Recommended)
1. Make sure Docker and Docker Compose are installed
2. Run the installation script:
   - **Windows**: `.\install-with-docker.bat`
   - **macOS/Linux**: `./install-with-docker.sh`

### Local Installation (Without Docker)
1. Install prerequisites (Node.js, MySQL, MongoDB)
2. Run the installation script:
   - **Windows**: `.\install-local.bat`
   - **macOS/Linux**: `./install-local.sh`
3. Follow the database setup instructions provided by the script

## 🔑 Environment Variables

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

## 🚀 Running the Application

### 🐳 With Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 💻 Locally

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

### 🔐 Authentication

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

## 🌱 Database Seeding

To seed the database with sample data:

```bash
# Seed the database
npm run seed:run

# Fresh migration and seed
npm run migrate-fresh-seed
```

### 🧪 Test Data & Accounts

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

```
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

### 🏭 Production Deployment

1. Set up your production environment variables in `.env`
2. Build the application:
```bash
npm run build
```

3. Start the application:
```bash
npm run start:prod
```

### 🐳 Docker Deployment

The system supports multiple Docker deployment approaches:

#### Development Mode (with Volume Mounting)
This approach mounts your local source code into the container, allowing for live code changes without rebuilding:

```bash
# Build and start all services with volume mounting for development
docker-compose up -d

# Changes to your source code will be reflected immediately
```

#### Production Mode (Pre-built Images)
For production deployment, you can use pre-built images:

```bash
# Start all services using pre-built images
docker-compose -f docker-compose.prod.yml up -d

# Scale the API service (optional)
docker-compose -f docker-compose.prod.yml up -d --scale api=3
```

#### Building from Source
If you prefer to build the images from source:

```bash
# Build and start all services from source
docker-compose -f docker-compose.full-install.yml up -d
```

#### Development with Hot Reloading
For active development with hot reloading:

```bash
# Start in development mode with volume mounting
docker-compose -f docker-compose.dev.yml up -d
```

### 🩺 Health Checks

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

## 🛠️ Makefile Commands

The project includes a Makefile with common commands:

``bash
# Build the application (requires source code)
make build

# Start all services (using pre-built images)
make start

# Start in development mode (requires source code)
make start-dev

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