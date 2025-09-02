# System Design

## Context and Goals

The Expansion Management System is designed to streamline client project management, vendor matching, and analytics for business expansion operations. The system enables organizations to efficiently match vendors with client projects based on geographic and service capabilities, improving operational efficiency and decision-making.

### Business Goals

1. Automate vendor-client matching processes based on country and service overlap
2. Centralize vendor and project data in a single system
3. Scale matching logic across multiple countries and services
4. Provide analytics and notification systems for high-potential matches
5. Enable research document storage and full-text search capabilities

### Technical Goals

1. Build a maintainable and scalable backend using NestJS
2. Implement dual-database strategy for optimal data modeling
3. Provide comprehensive API documentation with examples
4. Ensure security with JWT authentication and role-based access control
5. Implement automated testing and CI/CD pipelines

## Architecture Overview

```mermaid
graph TD
    A[Client Applications] --> B[API Gateway/Nginx]
    B --> C[NestJS Application]
    C --> D[(MySQL Database)]
    C --> E[(MongoDB Database)]
    C --> F[SMTP Server]
    C --> G[Scheduled Jobs]
    
    subgraph "Application Layer"
        C
    end
    
    subgraph "Data Layer"
        D
        E
    end
    
    subgraph "External Services"
        F
        G
    end
```

### Component Diagram

```mermaid
graph LR
    A[Frontend Clients] --> B[Auth Module]
    A --> C[Client Module]
    A --> D[Project Module]
    A --> E[Vendor Module]
    A --> F[Matching Module]
    A --> G[Research Module]
    A --> H[Analytics Module]
    
    B --> I[(MySQL)]
    C --> I
    D --> I
    E --> I
    F --> I
    F --> J[(MongoDB)]
    G --> J
    H --> I
    H --> J
    
    F --> K[Notification Service]
    K --> L[SMTP Server]
    
    M[Scheduler] --> F
    M --> N[SLA Monitor]
```

## Data Model

### MySQL Schema (ERD)

```mermaid
erDiagram
    CLIENTS ||--o{ PROJECTS : has
    PROJECTS ||--o{ PROJECT_SERVICES : requires
    PROJECT_SERVICES }|--|| SERVICES : uses
    VENDORS ||--o{ VENDOR_SERVICES : provides
    VENDORS ||--o{ VENDOR_COUNTRIES : operates_in
    VENDOR_SERVICES }|--|| SERVICES : uses
    PROJECTS ||--o{ MATCHES : matched
    VENDORS ||--o{ MATCHES : matched

    CLIENTS {
        int id PK
        string name
        string email
        string password
        string role
        datetime created_at
    }
    
    PROJECTS {
        int id PK
        int client_id FK
        string country
        int budget
        string status
        datetime created_at
    }
    
    VENDORS {
        int id PK
        string name
        float rating
        int response_sla_hours
        datetime created_at
    }
    
    SERVICES {
        int id PK
        string name
    }
    
    PROJECT_SERVICES {
        int project_id PK
        int service_id PK
    }
    
    VENDOR_SERVICES {
        int vendor_id PK
        int service_id PK
    }
    
    VENDOR_COUNTRIES {
        int vendor_id PK
        string country PK
    }
    
    MATCHES {
        int id PK
        int project_id FK
        int vendor_id FK
        float score
        datetime created_at
    }
```

### MongoDB Schema

```mermaid
classDiagram
    class ResearchDoc {
        +ObjectId _id
        +string projectId
        +string title
        +string content
        +string[] tags
        +Date createdAt
    }
    
    class ResearchDocIndexes {
        +text title
        +text content
        +string projectId
        +string[] tags
    }
    
    ResearchDoc --> ResearchDocIndexes : has
```

## Matching Algorithm

The core of the system is the vendor-project matching algorithm that scores potential matches based on:

1. **Service Overlap**: Number of services that match between vendor and project
2. **Vendor Rating**: Quality score of the vendor
3. **SLA Weight**: Response time factor

### Scoring Formula

```
score = (overlapCount * 2) + vendor.rating + SLA_weight
SLA_weight = max(0, 10 - response_sla_hours/24)
```

### Sequence Diagram: Matching Process

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant MatchingService
    participant Database
    participant NotificationService

    Client->>API: POST /projects/{id}/matches/rebuild
    API->>MatchingService: rebuildMatches(projectId)
    MatchingService->>Database: Get project with services
    Database-->>MatchingService: Project data
    MatchingService->>Database: Get vendors in same country
    Database-->>MatchingService: Vendor list
    loop For each vendor
        MatchingService->>Database: Get vendor services
        Database-->>MatchingService: Vendor services
        MatchingService->>MatchingService: Calculate overlap
        MatchingService->>MatchingService: Compute score
        MatchingService->>Database: Upsert match
        Database-->>MatchingService: Match saved
    end
    alt High score match found
        MatchingService->>NotificationService: sendHighScoreMatchNotification()
        NotificationService->>SMTP: Send email
        SMTP-->>NotificationService: Email sent
    end
    MatchingService-->>API: Matches list
    API-->>Client: 200 OK + matches
```

### Sequence Diagram: Daily Job

```mermaid
sequenceDiagram
    participant Scheduler
    participant MatchingService
    participant Database
    participant NotificationService

    Scheduler->>MatchingService: handleDailyMatchesRebuild()
    MatchingService->>Database: Get active projects
    Database-->>MatchingService: Project list
    loop For each project
        MatchingService->>MatchingService: rebuildMatches(project.id)
        MatchingService->>Database: Update matches
        alt New high score match
            MatchingService->>NotificationService: send notification
        end
    end
    MatchingService-->>Scheduler: Job completed
```

## Security

### Authentication

- JWT-based authentication with role-based access control
- Two roles: `client` and `admin`
- Password hashing with bcrypt
- Secure token expiration

### Authorization

- Route-level guards for role-based access
- Admin-only endpoints for sensitive operations
- Client-scoped data access

### Data Protection

- Environment variables for secrets
- Input validation and sanitization
- SQL injection prevention through ORM
- Rate limiting to prevent abuse

## Scalability Considerations

### Read/Write Patterns

- High read frequency for project and vendor data
- Moderate write frequency for matches and research docs
- Periodic batch processing for analytics

### Indexing Strategy

- Primary keys on all entity IDs
- Foreign key indexes for relationships
- Composite indexes for frequent query patterns
- Text indexes for MongoDB research documents

### Caching Plan

- In-memory caching for frequently accessed data
- Redis integration for distributed caching
- Cache invalidation on data updates

## Observability

### Logging

- Structured logging with request IDs
- Error logging with stack traces
- Performance monitoring logs

### Metrics

- API response times
- Database query performance
- Match computation statistics
- Email delivery metrics

### Health Checks

- Database connectivity
- External service availability
- Application responsiveness

## Deployment Architecture

```mermaid
graph LR
    A[Load Balancer] --> B[API Instance 1]
    A --> C[API Instance 2]
    A --> D[API Instance 3]
    
    B --> E[(MySQL Primary)]
    C --> E
    D --> E
    
    E --> F[(MySQL Replica)]
    
    B --> G[(MongoDB)]
    C --> G
    D --> G
    
    H[Cron Jobs] --> E
    H --> G
```

This deployment architecture supports horizontal scaling of the API layer while maintaining consistent data access patterns.