# Makefile for Expansion Management System

# Detect Docker Compose version
ifeq ($(shell command -v docker-compose 2> /dev/null),)
    DOCKER_COMPOSE = docker compose
else
    DOCKER_COMPOSE = docker-compose
endif

# Variables
DOCKER_COMPOSE_FILE = docker-compose.yml
NPM = npm

# Default target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  start            - Start all services (development with volume mounting)"
	@echo "  start-prod       - Start all services (production with pre-built images)"
	@echo "  start-dev        - Start in development mode with Docker (volume mounting)"
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
	@echo "  download         - Download the necessary files for simple setup"
	@echo "  status           - Show status of services"
	@echo "  logs             - Show logs of services"
	@echo "  setup-linux      - Run universal Linux setup (installs Docker if needed)"

# Docker targets
.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d

.PHONY: start-prod
start-prod:
	$(DOCKER_COMPOSE) -f docker-compose.prod.yml up -d

.PHONY: start-dev
start-dev:
	$(DOCKER_COMPOSE) up -d

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down

.PHONY: status
status:
	$(DOCKER_COMPOSE) ps

.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f

.PHONY: download
download:
	curl -O https://raw.githubusercontent.com/h4775346/expansion-management-api/master/docker-compose.yml

.PHONY: setup-linux
setup-linux:
	curl -sSL https://raw.githubusercontent.com/h4775346/expansion-management-api/master/setup.sh | bash

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

# Clean targets
.PHONY: clean
clean:
	rm -rf dist
	rm -rf coverage