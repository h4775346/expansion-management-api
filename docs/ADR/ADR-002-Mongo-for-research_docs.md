# ADR-002: Mongo for research_docs

## Context

We need to decide which database to use for storing research documents. The requirements include:

- Full-text search capabilities
- Flexible schema for varying document structures
- Tagging system
- High-performance read operations

## Decision

We will use MongoDB for research documents for the following reasons:

## Consequences

### Positive

1. **Text Search**: Native text search capabilities with indexing
2. **Flexible Schema**: Documents can have varying structures without migration overhead
3. **Performance**: Optimized for read-heavy workloads with proper indexing
4. **Scalability**: Horizontal scaling capabilities for large document collections
5. **JSON Native**: Documents are stored as JSON, matching our data model naturally

### Negative

1. **Consistency**: Eventual consistency model vs. MySQL's strong consistency
2. **Transactions**: Limited multi-document transaction support
3. **Complex Relationships**: More complex to manage relationships compared to relational databases
4. **Operational Overhead**: Additional database system to maintain

## Alternatives Considered

### MySQL with JSON columns

Storing research documents in MySQL with JSON columns:

- Pros: Single database system, ACID compliance
- Cons: Limited text search capabilities, less flexible schema, more complex querying

### PostgreSQL with JSONB

Using PostgreSQL's JSONB columns:

- Pros: Better JSON support than MySQL, full-text search capabilities
- Cons: Still not as optimized for document storage as MongoDB, more complex than our chosen MySQL setup

## Related ADRs

- ADR-001: Choose TypeORM over Prisma
- ADR-003: Matching formula choices & idempotency

## Notes

The decision to use a polyglot persistence approach (MySQL + MongoDB) aligns with our data requirements:
- Structured relational data in MySQL
- Unstructured document data in MongoDB