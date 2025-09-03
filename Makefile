# Makefile for Expansion Management System

# Use docker compose (V2) instead of docker-compose
DOCKER_COMPOSE = docker compose

# Variables
NPM = npm

# Default target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  start            - Start all services with Docker (development mode)"
	@echo "  start-prod       - Start all services with Docker (production mode)"
	@echo "  start-full       - Start all services with Docker (full installation with auto-seeding)"
	@echo "  start-local      - Start in development mode locally (requires Node.js)"
	@echo "  stop             - Stop all services"
	@echo "  test             - Run unit tests"
	@echo "  test-e2e         - Run e2e tests"
	@echo "  lint             - Run linter"
	@echo "  format           - Format code"
	@echo "  migrate          - Run database migrations"
	@echo "  migrate-fresh    - Drop schema and run fresh migrations"
	@echo "  migrate-fresh-seed - Drop schema, run fresh migrations, and seed data"
	@echo "  seed             - Run seed scripts"
	@echo "  docs             - Generate documentation"
	@echo "  clean            - Clean build artifacts"
	@echo "  update           - Update from GitHub and rebuild containers"
	@echo "  fix-deps         - Regenerate package-lock.json to fix dependency conflicts"

# Docker targets
.PHONY: start
start:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml up -d

.PHONY: start-full
start-full:
	$(DOCKER_COMPOSE) -f docker-compose.full-install.yml up -d

.PHONY: start-prod
start-prod:
	$(DOCKER_COMPOSE) up -d

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml down

.PHONY: stop-prod
stop-prod:
	$(DOCKER_COMPOSE) down

.PHONY: status
status:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml ps

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) -f docker-compose.dev.yml logs -f

# Development targets
.PHONY: start-local
start-local:
	$(NPM) run start:dev

# Test targets
.PHONY: test
test:
	$(NPM) run test

.PHONY: test-e2e
test-e2e:
	$(NPM) run test:e2e

.PHONY: test-cov
test-cov:
	$(NPM) run test:cov

# Code quality targets
.PHONY: lint
lint:
	$(NPM) run lint

.PHONY: format
format:
	$(NPM) run format

# Database targets
.PHONY: migrate
migrate:
	$(NPM) run migration:run

.PHONY: migrate-fresh
migrate-fresh:
	$(NPM) run typeorm schema:drop -- -d src/common/database/data-source.ts
	$(NPM) run migration:run

.PHONY: migrate-fresh-seed
migrate-fresh-seed:
	$(NPM) run typeorm schema:drop -- -d src/common/database/data-source.ts
	$(NPM) run migration:run
	$(NPM) run seed:run

.PHONY: seed
seed:
	$(NPM) run seed:run

# Documentation targets
.PHONY: docs
docs:
	$(NPM) run export:openapi
	$(NPM) run export:postman

# Build targets
.PHONY: build
build:
	$(NPM) run build

# Update target
.PHONY: update
update:
	./update-from-github.sh

# Clean targets
.PHONY: clean
clean:
	rm -rf dist
	rm -rf coverage

.PHONY: fix-deps
fix-deps:
	./regenerate-lockfile.sh
