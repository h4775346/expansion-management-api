# System Design

## Context and Goals

The Expansion Management System is designed to help organizations manage client projects, match them with appropriate vendors, and provide analytics on vendor performance. The system aims to:

1. Provide a centralized platform for project and vendor management
2. Automate vendor-project matching based on business rules
3. Enable research document storage and retrieval
4. Offer analytics on vendor performance
5. Send notifications for important events
6. Ensure data consistency and security

## Architecture Overview

```mermaid
graph TD
    A[Client Applications] --> B[API Gateway]
    B --> C[NestJS Application]
    C --> D[(MySQL Database)]
    C --> E[(MongoDB Database)]
    C --> F[SMTP Server]
    C --> G[Scheduler]
    G --> C
```

### Component Diagram

```mermaid
graph TD
    A[API Layer] --> B[Auth Module]
    A --> C[Client Module]
    A --> D[Project Module]
    A --> E[Vendor Module]
    A --> F[Matching Module]
    A --> G[Research Module]
    A --> H[Analytics Module]
    A --> I[Notification Module]
    A --> J[Scheduler Module]
    
    B --> K[(MySQL)]
    C --> K
    D --> K
    E --> K
    F --> K
    G --> K
    
    H --> K
    H --> L[(MongoDB)]
    
    I --> M[SMTP Server]
    
    J --> F
    J --> I
```

## Data Model

```mermaid
classDiagram
    class Client {
        +id: int
        +name: string
        +email: string
        +password: string
        +created_at: datetime
    }
    
    class Project {
        +id: int
        +client_id: int
        +country: string
        +budget: decimal
        +status: string
        +created_at: datetime
    }
    
    class Vendor {
        +id: int
        +name: string
        +rating: float
        +response_sla_hours: int
        +created_at: datetime
    }
    
    class Service {
        +id: int
        +name: string
    }
    
    class Match {
        +id: int
        +project_id: int
        +vendor_id: int
        +score: float
        +created_at: datetime
    }
    
    class ResearchDoc {
        +_id: ObjectId
        +projectId: string
        +title: string
        +content: string
        +tags: string[]
        +createdAt: datetime
    }
    
    Client "1" -- "0..*" Project
    Project "1" -- "0..*" Match
    Vendor "1" -- "0..*" Match
    Project "0..*" -- "0..*" Service : project_services
    Vendor "0..*" -- "0..*" Service : vendor_services
    Vendor "0..*" -- "0..*" Country : vendor_countries
```

## Sequence Diagrams

### Create Project → Rebuild Matches → Notify Client

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant MatchingService
    participant NotificationService
    participant Database
    
    Client->>API: POST /projects
    API->>Database: Create project
    Database-->>API: Project created
    API-->>Client: 201 Created
    
    Client->>API: POST /projects/{id}/matches/rebuild
    API->>MatchingService: Rebuild matches
    MatchingService->>Database: Get project & vendors
    Database-->>MatchingService: Data retrieved
    MatchingService->>Database: Calculate & store matches
    Database-->>MatchingService: Matches saved
    MatchingService-->>API: Matches result
    API->>NotificationService: Check for high scores
    NotificationService->>Database: Get client email
    Database-->>NotificationService: Client data
    NotificationService->>SMTP: Send email
    SMTP-->>NotificationService: Email sent
    API-->>Client: Matches data
```

### Daily Job → Recalculate → SLA Check

```mermaid
sequenceDiagram
    participant Scheduler
    participant MatchingService
    participant NotificationService
    participant Database
    participant SMTP
    
    Scheduler->>MatchingService: Rebuild active project matches
    MatchingService->>Database: Get active projects
    Database-->>MatchingService: Projects list
    loop For each project
        MatchingService->>Database: Calculate matches
        Database-->>MatchingService: Match data
        MatchingService->>Database: Store matches
        Database-->>MatchingService: Matches saved
    end
    MatchingService-->>Scheduler: Process complete
    
    Scheduler->>NotificationService: Check SLA violations
    NotificationService->>Database: Get projects with SLA issues
    Database-->>NotificationService: Violation data
    NotificationService->>SMTP: Send SLA violation emails
    SMTP-->>NotificationService: Emails sent
    NotificationService-->>Scheduler: Process complete
```

## Matching Algorithm

### Rationale

The matching algorithm is designed to provide relevant vendor recommendations based on:

1. **Geographic proximity**: Vendors must be in the same country as the project
2. **Service alignment**: Vendors must provide at least one service that the project requires
3. **Performance metrics**: Vendor rating and response SLA are factored into the score

### Formula

The matching score is calculated as:

```
Score = (Overlap Count × 2) + Vendor Rating + SLA Weight

Where:
- Overlap Count = Number of services that match between project and vendor
- Vendor Rating = Vendor's rating (0-5 scale)
- SLA Weight = max(0, 10 - response_sla_hours/24)
```

### Complexity

- Time Complexity: O(V × S) where V is the number of vendors in the country and S is the average number of services per vendor
- Space Complexity: O(M) where M is the number of matches generated

### Edge Cases

1. **No matching vendors**: Returns empty result set
2. **No overlapping services**: Score is based only on rating and SLA
3. **Vendors with no rating**: Rating component is zero
4. **Vendors with no SLA**: SLA component is zero

### Idempotency

The matching algorithm is idempotent - running it multiple times with the same inputs will produce the same results. Matches are upserted based on the unique constraint (project_id, vendor_id).

## Security

### Authentication

- JWT tokens for API authentication
- Password hashing with bcrypt
- Role-based access control (client, admin)

### Authorization

- Route-level guards for role-based access
- Data isolation by client ownership
- Admin-only access to certain endpoints

### Validation

- Input validation on all endpoints
- Sanitization of user inputs
- Parameterized database queries

### Rate Limiting

- API rate limiting to prevent abuse
- Brute force protection for login

### CORS

- Configured CORS policies for web applications

## Scalability Considerations

### Read/Write Patterns

- **Read-heavy**: Analytics, vendor listings, project details
- **Write-moderate**: Project creation, vendor matching, research docs

### Indexing Strategy

1. **MySQL**:
   - Primary keys on all ID columns
   - Foreign key indexes
   - Unique constraint on (project_id, vendor_id) in matches
   - Indexes on frequently queried columns (country, status)

2. **MongoDB**:
   - Text index on (title, content) for search
   - Compound index on (projectId, tags) for filtering

### Caching Plan

- Redis caching for:
  - Frequently accessed vendor lists
  - Analytics data
  - User sessions

## Observability

### Logging

- Structured logging with request IDs
- Error logging with stack traces
- Audit trails for important operations

### Request IDs

- Unique request IDs for tracing
- Correlation across services

### Metrics

- API response times
- Database query performance
- Error rates
- System resource usage