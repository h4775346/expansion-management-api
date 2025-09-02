# Expansion Management System API

A production-ready backend system for managing client projects, vendor matching, and analytics using NestJS, MySQL, and MongoDB.

[![Build Status](https://github.com/h4775346/expansion-management-api/workflows/CI/badge.svg)](https://github.com/h4775346/expansion-management-api/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Authentication**: JWT-based authentication with role-based access control (client, admin)
- **Project Management**: Create and manage client projects with country and service requirements
- **Vendor Management**: Maintain vendor database with services and countries
- **Smart Matching**: Automated vendor-project matching based on country and service overlap
- **Research Documents**: Store and search research documents in MongoDB with text indexing
- **Analytics**: Top vendor analytics with research document counts
- **Notifications**: Email notifications for high-score matches
- **Scheduling**: Daily job to rebuild matches and check SLA violations

## Table of Contents

- [One-Command Setup](#one-command-setup)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
  - [With Docker](#with-docker)
  - [Locally](#locally)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Database Seeding](#database-seeding)
- [Testing](#testing)
- [Deployment](#deployment)
- [Documentation](#documentation)
- [CI/CD](#cicd)
- [License](#license)

## One-Command Setup

Want to get started as quickly as possible? Run this single command:

**On Windows:**
```cmd
curl -o setup.bat https://raw.githubusercontent.com/h4775346/expansion-management-api/main/setup.bat && setup.bat
```

**On macOS/Linux:**
```bash
curl -o setup.sh https://raw.githubusercontent.com/h4775346/expansion-management-api/main/setup.sh && chmod +x setup.sh && ./setup.sh
```

This will:
1. Clone the repository
2. Install all dependencies
3. Start MySQL, MongoDB, and the API with Docker
4. Run database migrations
5. Seed the database with sample data
6. Provide you with the final URL to access the system

**Final URL:** http://localhost:3000

## Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- MySQL
- MongoDB

## Quick Start

```bash
# Clone the repository
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api

# Install dependencies
npm install

# Copy environment file and configure
cp .env.example .env
# Edit .env with your configuration

# Start with Docker
docker-compose up -d

# The API will be available at http://localhost:3000
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/h4775346/expansion-management-api.git
cd expansion-management-api
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration.

## Environment Variables

The following environment variables are required:

| Variable | Description | Default |
|----------|-------------|---------|
| MYSQL_HOST | MySQL database host | localhost |
| MYSQL_PORT | MySQL database port | 3307 |
| MYSQL_DB | MySQL database name | expansion_management |
| MYSQL_USER | MySQL username | root |
| MYSQL_PASSWORD | MySQL password | password |
| MONGO_URI | MongoDB connection URI | mongodb://localhost:27017/expansion_management |
| JWT_SECRET | JWT secret key | your_jwt_secret_key |
| SMTP_HOST | SMTP server host | smtp.example.com |
| SMTP_PORT | SMTP server port | 587 |
| SMTP_USER | SMTP username | your_email@example.com |
| SMTP_PASS | SMTP password | your_email_password |

For a complete list of environment variables, see [.env.example](.env.example).

## Running the Application

### With Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Locally

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

## API Documentation

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/openapi.json`
- Postman Collection: Available in `docs/postman_collection.json`

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

## Project Structure

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

## Database Seeding

To seed the database with sample data:

```bash
# Seed the database
npm run seed:run

# Fresh migration and seed
npm run migrate-fresh-seed
```

This will create:
- Sample clients with real email addresses
- Services list
- Sample vendors with services and countries
- Sample projects
- Research documents

## Testing

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

## Deployment

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

```bash
# Build and start all services
docker-compose up -d

# Scale the API service (optional)
docker-compose up -d --scale api=3
```

### Health Checks

The application provides health check endpoints:
- Application health: `GET /health`
- Database connectivity: Checked in health endpoint

## Documentation

- [System Design](docs/SYSTEM_DESIGN.md)
- [System Implementation](docs/SYSTEM_IMPLEMENTATION.md)
- [Runbook](docs/RUNBOOK.md)
- [Architecture Decision Records](docs/ADR/)

## CI/CD

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

## Makefile Commands

The project includes a Makefile with common commands:

```bash
# Build the application
make build

# Start all services
make start

# Start in development mode
make start-dev

# Run unit tests
make test

# Run e2e tests
make test-e2e

# Generate documentation
make docs

# Seed the database
make seed
```

For a complete list of commands, see [Makefile](Makefile).

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you have any questions or need help, please open an issue on GitHub.