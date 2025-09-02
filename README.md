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
# Download and run the setup script
curl -o setup.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/master/setup.bat
.\setup.bat
```

### 🐧 macOS/Linux (One-Command Universal Setup)
# Single command that handles everything including Docker installation if needed
```bash
curl -sSL https://raw.githubusercontent.com/h4775346/expansion-management-api/master/setup.sh | bash
```

### 🐳 Docker-Only Approach (Most Efficient)
```bash
# For systems with Docker and Docker Compose
curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml
docker-compose up -d

# For systems with only Docker (no Docker Compose)
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=expansion_management -p 3307:3306 mysql:8.0
docker run -d --name mongo -p 27017:27017 mongo:5.0
docker run -d --name api -p 3000:3000 --link mysql --link mongo \
  -e MYSQL_HOST=mysql -e MYSQL_PORT=3306 -e MYSQL_DB=expansion_management \
  -e MYSQL_USER=root -e MYSQL_PASSWORD=password \
  -e MONGO_URI=mongodb://mongo:27017/expansion_management \
  -e JWT_SECRET=your_jwt_secret_key \
  -v $(pwd):/app \
  expansion-api:dev
```

That's it! The system will automatically:
- 📦 Install Docker and Docker Compose if needed (Linux only)
- 📥 Download all required files
- 🗄️ Set up MySQL and MongoDB
- 🔄 Run database migrations
- 🌱 Seed the database
- ▶️ Start the application

🎯 **Access at: http://localhost:3000**

### 🐧 Linux Universal Installation (Detailed)

For Linux users who want to understand what happens under the hood:

1. **The Universal Setup Script Automatically Handles**:
   - Detection of your Linux distribution (Ubuntu, Debian, CentOS, RHEL, Fedora, etc.)
   - Docker installation if not present
   - Docker Compose installation if not present
   - Download of all required files
   - Complete system setup and startup

2. **Manual Installation Options** (if you prefer step-by-step):

   **Option A: Install Docker and Docker Compose First**
   ```bash
   # Ubuntu/Debian
   sudo apt update
   sudo apt install docker.io docker-compose
   
   # CentOS/RHEL
   sudo yum install docker docker-compose
   
   # Fedora
   sudo dnf install docker docker-compose
   
   # Start Docker service
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   ```

   **Option B: Use the Universal Script**
   ```bash
   # This single command does everything:
   curl -sSL https://raw.githubusercontent.com/h4775346/expansion-management-api/master/setup.sh | bash
   ```

### 🐧 Linux Detailed Installation

For Linux users who prefer manual control or troubleshooting, here's a step-by-step approach:

1. **Prerequisites Check**:
```bash
# Verify Docker is installed
docker --version

# Check if Docker Compose is installed
if command -v docker-compose &> /dev/null; then
    echo "Docker Compose found: $(docker-compose --version)"
else
    echo "Docker Compose not found - we'll install it or use alternative methods"
fi

# If Docker is not installed, install it:
# Ubuntu/Debian:
sudo apt update
sudo apt install docker.io

# CentOS/RHEL:
# sudo yum install docker

# Fedora:
# sudo dnf install docker

# Start and enable Docker service
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER  # Add current user to docker group
```

2. **Option 1: Install Docker Compose (Recommended)**:
```bash
# Install Docker Compose
# Method 1: Using pip (if python3 and pip are available)
sudo apt install python3-pip  # Ubuntu/Debian
pip3 install docker-compose

# Method 2: Direct download
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker-compose --version
```

3. **Option 2: Use Docker Compose V2 (Built into Docker)**:
```bash
# Many modern Docker installations include Compose V2
docker compose version

# If available, use docker compose instead of docker-compose
curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.full-install.yml
curl -o Dockerfile.prod https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile.prod
docker compose -f docker-compose.full-install.yml up -d
```

4. **Option 3: Manual Docker Commands (No Compose Required)**:
```bash
# Download the Dockerfile
curl -o Dockerfile.prod https://raw.githubusercontent.com/h4775346/expansion-management-api/master/Dockerfile.prod

# Build the API image
docker build -t expansion-api -f Dockerfile.prod .

# Run the databases
docker run -d --name mysql-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=expansion_management \
  -p 3307:3306 \
  mysql:8.0

docker run -d --name mongo-db \
  -p 27017:27017 \
  mongo:5.0

# Wait for databases to be ready
echo "Waiting for databases to start..."
sleep 30

# Run the API (it will automatically run migrations and seeding)
docker run -d --name expansion-api \
  --link mysql-db:mysql \
  --link mongo-db:mongo \
  -p 3000:3000 \
  -e MYSQL_HOST=mysql \
  -e MYSQL_PORT=3306 \
  -e MYSQL_DB=expansion_management \
  -e MYSQL_USER=root \
  -e MYSQL_PASSWORD=password \
  -e MONGO_URI=mongodb://mongo:27017/expansion_management \
  -e JWT_SECRET=your_jwt_secret_key \
  expansion-api
```

5. **Verify Installation**:
```bash
# Wait 2-3 minutes for the first-time setup to complete
# Then check if the API is running
curl http://localhost:3000/health

# Access API documentation
xdg-open http://localhost:3000/docs  # On Ubuntu/Debian
# or
open http://localhost:3000/docs      # On macOS
```

6. **Stop the System**:
```bash
# Stop all services
docker-compose -f docker-compose.full-install.yml down

# Stop services and remove volumes (WARNING: This will delete all data)
docker-compose -f docker-compose.full-install.yml down -v
```

### 🐧 Linux Troubleshooting

**Common Issues and Solutions**:

1. **Permission Denied with Docker**:
```bash
# Solution: Add your user to the docker group
sudo usermod -aG docker $USER
# Then log out and log back in, or run:
newgrp docker
```

2. **Port Already in Use**:
```bash
# Check what's using the ports
sudo lsof -i :3000  # API port
sudo lsof -i :3307  # MySQL port
sudo lsof -i :27017 # MongoDB port

# Kill the processes if needed
sudo kill -9 <PID>
```

3. **Insufficient Memory**:
```bash
# Check system resources
free -h
df -h

# If low on memory, stop other services or increase swap space
```

4. **Docker Build Issues**:
```bash
# Clean up Docker cache
docker system prune -a

# Rebuild with no cache
docker-compose -f docker-compose.full-install.yml build --no-cache
```

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **MySQL**
- **MongoDB**

## ⚡ Quick Start

```bash
# Option 1: Use pre-built Docker images (recommended for quick start)
curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml
docker-compose up -d

# Option 2: Clone the repository and build from source
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api
docker-compose -f docker-compose.full-install.yml up -d

# The API will be available at http://localhost:3000
```

## ⚙️ Installation

1. Clone the repository:
```bash
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

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

### 🐳 With Docker (Pre-built Images - Recommended)

```bash
# Start all services using pre-built images
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 🐳 With Docker (Build from Source)

```bash
# Start all services and build from source
docker-compose -f docker-compose.full-install.yml up -d

# View logs
docker-compose -f docker-compose.full-install.yml logs -f

# Stop services
docker-compose -f docker-compose.full-install.yml down
```

### 💻 Locally

1. Start the databases:
```bash
docker-compose up mysql mongo -d
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