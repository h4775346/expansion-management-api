# System Implementation

## Module-by-Module Responsibilities

### Auth Module

**Responsibilities:**
- User authentication (registration, login)
- JWT token generation and validation
- Password hashing and verification

**Key Components:**
- `AuthService`: Handles authentication logic
- `JwtStrategy`: Validates JWT tokens
- `AuthController`: Exposes authentication endpoints

### Clients Module

**Responsibilities:**
- Client CRUD operations
- Client profile management
- Admin-only client management

**Key Components:**
- `ClientsService`: Client business logic
- `ClientsController`: Client endpoints
- `Client`: TypeORM entity

### Projects Module

**Responsibilities:**
- Project CRUD operations
- Project service management
- Client-owned project isolation

**Key Components:**
- `ProjectsService`: Project business logic
- `ProjectsController`: Project endpoints
- `Project`: TypeORM entity
- `ProjectService`: Junction entity for project-service relationships

### Vendors Module

**Responsibilities:**
- Vendor CRUD operations
- Vendor service and country management
- Vendor search and filtering

**Key Components:**
- `VendorsService`: Vendor business logic
- `VendorsController`: Vendor endpoints
- `Vendor`: TypeORM entity
- `VendorService`: Junction entity for vendor-service relationships
- `VendorCountry`: Junction entity for vendor-country relationships

### Matches Module

**Responsibilities:**
- Vendor-project matching
- Match score calculation
- Match storage and retrieval

**Key Components:**
- `MatchesService`: Matching algorithm implementation
- `MatchingController`: Match endpoints
- `Match`: TypeORM entity

### Research Module

**Responsibilities:**
- Research document storage
- Text search capabilities
- Document tagging

**Key Components:**
- `ResearchService`: Research document logic
- `ResearchController`: Research endpoints
- `ResearchDoc`: Mongoose schema

### Analytics Module

**Responsibilities:**
- Vendor performance analytics
- Top vendor calculations
- Research document statistics

**Key Components:**
- `AnalyticsService`: Analytics calculations
- `AnalyticsController`: Analytics endpoints

### Notifications Module

**Responsibilities:**
- Email notification sending
- High-score match notifications
- SLA violation alerts

**Key Components:**
- `NotificationsService`: Notification logic
- `NotificationsController`: Notification endpoints (if needed)

### Scheduler Module

**Responsibilities:**
- Daily match rebuilding
- SLA violation checking
- Automated tasks

**Key Components:**
- `SchedulerService`: Scheduled task implementation

### Common Module

**Responsibilities:**
- Shared utilities and helpers
- DTOs and validation
- Guards and interceptors
- Exceptions and error handling

**Key Components:**
- DTOs for data transfer
- Guards for authentication/authorization
- Interceptors for request/response handling
- Exception filters for error handling

## DTOs and Validation Rules

### Auth DTOs

**RegisterDto:**
- `email`: Required, valid email format
- `name`: Required, string
- `password`: Required, minimum 6 characters

**LoginDto:**
- `email`: Required, valid email format
- `password`: Required

### Client DTOs

**CreateClientDto:**
- `email`: Required, valid email format, unique
- `name`: Required, string
- `password`: Required, minimum 6 characters

**UpdateClientDto:**
- Same as CreateClientDto but all fields optional

### Project DTOs

**CreateProjectDto:**
- `country`: Required, string
- `budget`: Optional, number
- `status`: Optional, one of 'active', 'completed', 'cancelled'
- `services_needed`: Optional, array of strings

**UpdateProjectDto:**
- Same as CreateProjectDto but all fields optional

### Vendor DTOs

**CreateVendorDto:**
- `name`: Required, string
- `rating`: Optional, number
- `response_sla_hours`: Optional, number
- `services`: Optional, array of strings
- `countries`: Optional, array of strings

**UpdateVendorDto:**
- Same as CreateVendorDto but all fields optional

### Research DTOs

**CreateResearchDocDto:**
- `projectId`: Required, string
- `title`: Required, string
- `content`: Required, string
- `tags`: Optional, array of strings

**SearchResearchDocDto:**
- `text`: Optional, string (for text search)
- `tag`: Optional, string (for tag filtering)
- `projectId`: Optional, string (for project filtering)

## Repositories/Services Patterns

### TypeORM Usage

All MySQL entities use TypeORM with the Repository pattern:

1. **Entities**: Define the database schema
2. **Repositories**: Provide data access methods
3. **Services**: Contain business logic
4. **Controllers**: Handle HTTP requests

### Mongoose Usage

MongoDB documents use Mongoose with the Model pattern:

1. **Schemas**: Define document structure and validation
2. **Models**: Provide data access methods
3. **Services**: Contain business logic
4. **Controllers**: Handle HTTP requests

## Transaction Boundaries

### MySQL Transactions

- **Client creation**: Single transaction for client creation
- **Project creation**: Single transaction for project and project-service relationships
- **Vendor creation**: Single transaction for vendor, vendor-service, and vendor-country relationships
- **Match rebuilding**: Single transaction for match upserts

### MongoDB Operations

- **Research document creation**: Single document operation
- **Research document updates**: Single document operation

## Error Handling Strategy

### Global Exception Filter

A global exception filter handles all uncaught exceptions:

1. **HTTP Exceptions**: Preserved as-is
2. **Validation Exceptions**: Transformed to standardized format
3. **Database Exceptions**: Transformed to user-friendly messages
4. **Unexpected Exceptions**: Logged and returned as 500 errors

### Standardized Error Format

All errors follow the Problem Details RFC 7807 format:

```json
{
  "type": "https://example.com/probs/out-of-credit",
  "title": "You do not have enough credit.",
  "detail": "Your current balance is 30, but that costs 50.",
  "instance": "/account/12345/msgs/abc",
  "balance": 30,
  "accounts": ["/account/12345", "/account/67890"]
}
```

## Configuration Strategy

### ConfigModule

A centralized configuration module manages all environment variables:

1. **Environment Variables**: Loaded from .env file
2. **Validation**: Schema validation for required variables
3. **Defaults**: Sensible defaults for development

### Environment Matrix

| Environment | Database | Logging | Debug |
|-------------|----------|---------|-------|
| Development | Local    | Verbose | Yes   |
| Test        | In-memory| Minimal | Yes   |
| Production  | Remote   | Standard| No    |

## Testing Strategy

### Unit Tests

- **Services**: Test business logic in isolation
- **Utils**: Test utility functions
- **DTOs**: Test validation rules

### Integration Tests

- **Controllers**: Test endpoint behavior with mocked services
- **Services**: Test business logic with real repositories
- **Database**: Test with seeded data

### E2E Tests

- **Full API flows**: Test complete user journeys
- **Authentication**: Test login and protected routes
- **Data consistency**: Verify database state after operations

### Seed Data

Seed scripts provide consistent test data:

1. **Services**: Predefined service types
2. **Clients**: Sample client accounts
3. **Vendors**: Sample vendors with services and countries
4. **Projects**: Sample projects with requirements

## Deployment Notes

### Environment Variables

Required environment variables:

- `MYSQL_HOST`: MySQL database host
- `MYSQL_PORT`: MySQL database port
- `MYSQL_DB`: MySQL database name
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL password
- `MONGO_URI`: MongoDB connection URI
- `JWT_SECRET`: JWT signing secret
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password

### Production vs Development

| Aspect | Development | Production |
|--------|-------------|------------|
| Database | Local Docker | Remote managed |
| Logging | Verbose | Standard |
| Debug | Enabled | Disabled |
| Sync | Auto-sync enabled | Migrations only |
| SSL | None | Required |