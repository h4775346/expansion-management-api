# Makefile for Expansion Management System

# Variables
DOCKER_COMPOSE = docker-compose
NPM = npm

# Default target
.PHONY: help
help:
	@echo "Available targets:"
	@echo "  build            - Build the application"
	@echo "  start            - Start all services"
	@echo "  start-dev        - Start in development mode"
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

# Build targets
.PHONY: build
build:
	$(NPM) run build

# Docker targets
.PHONY: start
start:
	$(DOCKER_COMPOSE) up -d

.PHONY: start-dev
start-dev:
	$(DOCKER_COMPOSE) up mysql mongo -d
	$(NPM) run start:dev

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down

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

# Clean targets
.PHONY: clean
clean:
	rm -rf dist
	rm -rf coverage