You are a senior software engineer. Build a production-ready backend project using **NestJS**, **MySQL (TypeORM + migrations)**, and **MongoDB (Mongoose)**. The app must be easy to run with **Docker Compose** and follow clean modular architecture.

## Scope (Business)
- Roles: `client`, `admin` via JWT auth + role guards.
- MySQL: clients, projects, vendors, matches + normalized services & vendor_countries.
- MongoDB: research_docs collection (projectId, title, content, tags[], createdAt) with text index.
- Matching: POST /projects/:id/matches/rebuild
  - Vendor matches project if same country AND ≥1 overlapping service.
  - Score = (overlapCount * 2) + vendor.rating + SLA_weight
  - SLA_weight = max(0, 10 - response_sla_hours/24)
  - Idempotent upsert on (project_id, vendor_id).
- Analytics: GET /analytics/top-vendors
  - Top 3 vendors per country (last 30 days) by avg score
  - Include count of research_docs related to projects (country-linked).
- Notifications: send email to project owner on new/updated high score match (configurable threshold). Use Nodemailer (SMTP creds through env).
- Scheduling: daily job to rebuild matches for active projects and flag SLA violations.

## Architecture & Modules
Create Nest modules:
- auth/ (JWT, guards, decorators, strategies)
- clients/
- projects/
- vendors/
- matches/
- research/ (Mongo models + service + controller)
- matching/ (rule engine + rebuild endpoint)
- analytics/
- notifications/
- scheduler/
- common/ (utils, interceptors, pipes, exceptions)

## Data Model (MySQL)
- clients(id PK, name, email unique, password, created_at)
- projects(id PK, client_id FK→clients, country, budget, status, created_at)
- vendors(id PK, name, rating float, response_sla_hours int, created_at)
- matches(id PK, project_id FK, vendor_id FK, score float, created_at, UNIQUE(project_id, vendor_id))
- services(id PK, name unique)
- project_services(PK(project_id, service_id))
- vendor_services(PK(vendor_id, service_id))
- vendor_countries(PK(vendor_id, country))
Add proper indexes, FKs, and TypeORM migrations + seed scripts.

## Data Model (Mongo)
- research_docs: { _id, projectId(string→projects.id), title, content, tags[string], createdAt }
- Index: text index on (title, content), index on (projectId, tags)

## Endpoints (non-exhaustive)
- Auth: POST /auth/register, POST /auth/login (returns JWT), GET /auth/me
- Clients: CRUD (admin), self-profile (client)
- Projects: CRUD (client owns), filter by status/country/services_needed
- Vendors: CRUD (admin), query by country/service
- Research: POST /research (upload/save), GET /research/search?text=&tag=&projectId=
- Matching: POST /projects/:id/matches/rebuild (idempotent), GET /projects/:id/matches
- Analytics: GET /analytics/top-vendors?sinceDays=30
- Health: GET /health (db checks)

## API Documentation (REQUIRED)
- Add **Swagger/OpenAPI** at `/docs` with:
  - Schemas for all DTOs
  - Auth (Bearer JWT)
  - Error responses (standardized problem details)
  - Examples for requests/responses
- Export **openapi.json** automatically on build to `docs/openapi.json`.
- Generate a **Postman collection** at `docs/postman_collection.json`.

## System Docs (REQUIRED)
Create these markdown docs under `/docs`:

1) `SYSTEM_DESIGN.md`
   - Context + goals
   - Architecture overview with **Mermaid diagrams**:
     - Component diagram (API, modules, MySQL, Mongo, SMTP, Scheduler, optional Redis)
     - Sequence diagrams for: “Create Project → Rebuild Matches → Notify Client”, and “Daily Job → Recalculate → SLA check”
   - Data model (ERD) with Mermaid class diagram
   - Matching algorithm (rationale, complexity, edge cases, idempotency)
   - Security (JWT, RBAC, validation, rate-limits, CORS)
   - Scalability considerations (read/write patterns, indexes, caching plan)
   - Observability (logging, request IDs, basic metrics)

2) `SYSTEM_IMPLEMENTATION.md`
   - Module-by-module responsibilities
   - DTOs and validation rules
   - Repositories/services patterns (TypeORM/Mongoose usage)
   - Transaction boundaries (where needed)
   - Error handling strategy (global filter)
   - Configuration strategy (ConfigModule, env schema)
   - Testing strategy (unit/integration + seed data)
   - Deployment notes (env matrix, prod vs dev)

3) `RUNBOOK.md`
   - How to run locally with Docker Compose
   - Common commands (migrations, seeds)
   - Rotating secrets / .env management
   - Backup & restore (MySQL & Mongo)
   - Troubleshooting (health checks, logs)

4) `ADR/` (Architecture Decision Records)
   - ADR-001: Choose TypeORM over Prisma
   - ADR-002: Mongo for research_docs
   - ADR-003: Matching formula choices & idempotency

Also update `README.md` to include:
- Quick start
- Docker compose up
- .env.example
- Links to `/docs`
- Example cURL or HTTPie usage
- Screenshots (Swagger) if possible

## Quality & Testing
- Use class-validator/transformer + global validation pipe
- E2E tests for auth, projects, vendors, matching, analytics
- Unit tests for matching service scoring + idempotent upsert
- Lint + format scripts (eslint, prettier)
- Seed datasets for demo flows

## Config & DevEx
- `.env.example` including:
  MYSQL_HOST, MYSQL_PORT, MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD
  MONGO_URI
  JWT_SECRET
  SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- Docker Compose:
  - api (Node 20), mysql, mongo (optional redis if using BullMQ)
  - volumes for data persistence
  - healthchecks for api/mysql/mongo
- Expose Swagger at `/docs`
- Makefile or npm scripts:
  - build, start:dev, start:prod, test, test:e2e, lint, migration:run, seed:run, export:openapi, export:postman
- Add GitHub Actions (optional): lint + tests on push

## Deliverables
- Full NestJS codebase
- Complete migrations + seeds (MySQL & Mongo)
- Docker files + compose
- `README.md`, `SYSTEM_DESIGN.md`, `SYSTEM_IMPLEMENTATION.md`, `RUNBOOK.md`, `ADR/*`
- `docs/openapi.json`, `docs/postman_collection.json`
- Swagger live at `/docs`
- Example requests (cURL) in README

## Acceptance Checklist (auto-validate)
- [ ] `docker compose up` starts api+dbs; `/health` OK
- [ ] `/docs` shows all endpoints with auth & examples
- [ ] `POST /projects/:id/matches/rebuild` computes scores and upserts
- [ ] `GET /analytics/top-vendors` returns top 3 per country + research_docs count
- [ ] Email fires on new high-score match (use test SMTP or mock)
- [ ] Seeds create sample client, vendors, services, projects, research_docs
- [ ] Tests pass (`npm run test`, `test:e2e`)
- [ ] `docs/*` files exist and diagrams render (Mermaid)
