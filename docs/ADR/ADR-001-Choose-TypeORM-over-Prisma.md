# ADR-001: Choose TypeORM over Prisma

## Context

We need to choose an ORM (Object-Relational Mapping) tool for our MySQL database interactions. The main contenders are TypeORM and Prisma.

## Decision

We will use TypeORM for the following reasons:

## Consequences

### Positive

1. **Mature Ecosystem**: TypeORM has been around longer and has a larger community
2. **NestJS Integration**: First-class support in NestJS with @nestjs/typeorm package
3. **Flexibility**: More flexible query building compared to Prisma's generated client
4. **Migration Support**: Built-in migration system that works well with our deployment process
5. **TypeScript Support**: Excellent TypeScript support with decorators
6. **Active Record vs Data Mapper**: Supports both patterns, giving us flexibility in approach

### Negative

1. **Performance**: May be slightly slower than Prisma for complex queries
2. **Learning Curve**: More complex API compared to Prisma's simpler query interface
3. **Runtime Overhead**: More runtime overhead compared to Prisma's compile-time generation

## Alternatives Considered

### Prisma

Prisma is a modern ORM with excellent developer experience, but:

- Less mature NestJS integration
- Generated client approach might limit flexibility
- Migration to Prisma later would require significant refactoring
- Less suitable for complex query scenarios we might encounter

## Related ADRs

- ADR-002: Mongo for research_docs

## Notes

This decision can be revisited if performance becomes an issue or if Prisma's ecosystem matures to better support our needs.