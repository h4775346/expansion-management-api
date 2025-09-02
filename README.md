# Expansion Management System

A production-ready backend system for managing client projects, vendor matching, and analytics using NestJS, MySQL, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with role-based access control (client, admin)
- **Project Management**: Create and manage client projects with country and service requirements
- **Vendor Management**: Maintain vendor database with services and countries
- **Smart Matching**: Automated vendor-project matching based on country and service overlap
- **Research Documents**: Store and search research documents in MongoDB with text indexing
- **Analytics**: Top vendor analytics with research document counts
- **Notifications**: Email notifications for high-score matches
- **Scheduling**: Daily job to rebuild matches and check SLA violations

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Docker and Docker Compose
- MySQL
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expansion-management
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

### Running with Docker

```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

### Running locally

1. Start the databases:
```bash
docker-compose up mysql mongo
```

2. Run the application:
```bash
npm run start:dev
```

## API Documentation

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI JSON: `http://localhost:3000/docs/openapi.json`

## Environment Variables

See [.env.example](.env.example) for required environment variables.

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

## Documentation

- [System Design](docs/SYSTEM_DESIGN.md)
- [System Implementation](docs/SYSTEM_IMPLEMENTATION.md)
- [Runbook](docs/RUNBOOK.md)
- [Architecture Decision Records](docs/ADR/)

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run tests with coverage
npm run test:cov
```

## License

MIT