# Runbook

## How to Run Locally with Docker Compose

### Prerequisites

1. Docker and Docker Compose installed
2. Node.js (v16 or higher) for local development
3. Git

### Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd expansion-management
```

2. Copy and configure environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start all services:
```bash
docker-compose up
```

The API will be available at `http://localhost:3000`

### Development Mode

To run in development mode with hot reloading:

```bash
docker-compose up mysql mongo
npm install
npm run start:dev
```

## Common Commands

### Database Migrations

Run migrations:
```bash
npm run migration:run
```

Generate a new migration:
```bash
npm run migration:generate -- src/common/database/migrations/<MigrationName>
```

### Seed Data

Run seed scripts:
```bash
npm run seed:run
```

### Testing

Run unit tests:
```bash
npm run test
```

Run e2e tests:
```bash
npm run test:e2e
```

Run tests with coverage:
```bash
npm run test:cov
```

### Code Quality

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

### Documentation

Export OpenAPI specification:
```bash
npm run export:openapi
```

Export Postman collection:
```bash
npm run export:postman
```

## Rotating Secrets / .env Management

### Environment Variables

The application uses the following environment variables:

```bash
# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DB=expansion_management
MYSQL_USER=root
MYSQL_PASSWORD=password

MONGO_URI=mongodb://localhost:27017/expansion_management

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# SMTP Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=your_email_password

# Node Environment
NODE_ENV=development
```

### Rotating Secrets

1. Update the `.env` file with new values
2. Restart the application:
```bash
docker-compose down
docker-compose up
```

For production environments, use your platform's secret management system (e.g., Kubernetes secrets, AWS Secrets Manager).

## Backup & Restore

### MySQL Backup

Create a backup:
```bash
docker exec expansion-management-mysql-1 mysqldump -u root -p expansion_management > backup.sql
```

Restore from backup:
```bash
docker exec -i expansion-management-mysql-1 mysql -u root -p expansion_management < backup.sql
```

### MongoDB Backup

Create a backup:
```bash
docker exec expansion-management-mongo-1 mongodump --db expansion_management --out /tmp/backup
docker cp expansion-management-mongo-1:/tmp/backup ./mongo-backup
```

Restore from backup:
```bash
docker cp ./mongo-backup expansion-management-mongo-1:/tmp/backup
docker exec expansion-management-mongo-1 mongorestore --db expansion_management /tmp/backup/expansion_management
```

## Troubleshooting

### Health Checks

Check API health:
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "service": "expansion-management-api"
}
```

### Logs

View Docker logs:
```bash
docker-compose logs api
docker-compose logs mysql
docker-compose logs mongo
```

View logs for a specific service:
```bash
docker-compose logs -f api
```

### Common Issues

#### Database Connection Issues

1. Ensure Docker containers are running:
```bash
docker-compose ps
```

2. Check database connectivity:
```bash
docker-compose exec mysql mysql -u root -p expansion_management
docker-compose exec mongo mongosh expansion_management
```

3. Verify environment variables in `.env` file

#### Migration Errors

1. Check if migrations have been run:
```bash
npm run typeorm migration:show
```

2. Run pending migrations:
```bash
npm run migration:run
```

#### Authentication Issues

1. Verify JWT secret in `.env` file
2. Check if user exists in database:
```sql
SELECT * FROM clients WHERE email = 'user@example.com';
```

3. Reset user password if needed

#### Performance Issues

1. Check database indexes:
```sql
SHOW INDEX FROM matches;
SHOW INDEX FROM projects;
```

2. Monitor slow queries in MySQL logs

3. Check MongoDB performance with:
```bash
docker-compose exec mongo mongosh expansion_management
db.currentOp()
```

### Debugging

Enable debug mode:
```bash
npm run start:debug
```

This will start the application with the debugger listening on port 9229.

Connect with a debugger (e.g., Chrome DevTools, VS Code debugger) to `localhost:9229`.