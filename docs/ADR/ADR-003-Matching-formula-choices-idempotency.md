# ADR-003: Matching formula choices & idempotency

## Context

We need to define the vendor-project matching algorithm including:

1. How to calculate match scores
2. How to ensure idempotency of matching operations
3. How to handle edge cases

## Decision

We will implement the following matching formula and idempotency approach:

### Matching Formula

```
Score = (Overlap Count × 2) + Vendor Rating + SLA Weight

Where:
- Overlap Count = Number of services that match between project and vendor
- Vendor Rating = Vendor's rating (0-5 scale)
- SLA Weight = max(0, 10 - response_sla_hours/24)
```

### Idempotency Approach

Use a unique constraint on (project_id, vendor_id) in the matches table with upsert operations.

## Consequences

### Positive

1. **Business Alignment**: Formula weights service overlap heavily, which aligns with business needs
2. **Simplicity**: Easy to understand and explain to stakeholders
3. **Performance**: Simple calculation that can be optimized
4. **Idempotency**: Ensures consistent results regardless of how many times matching is run
5. **Deterministic**: Same inputs always produce same outputs

### Negative

1. **Rigidity**: Formula may need adjustment as business requirements evolve
2. **Limited Factors**: Doesn't consider other potential factors like pricing, availability, etc.
3. **Linear Weighting**: Assumes linear relationship between factors, which may not be accurate

## Alternatives Considered

### Machine Learning Approach

Using ML to predict match quality:

- Pros: Could potentially provide more accurate matches
- Cons: Significantly more complex, requires training data, harder to explain to stakeholders

### Configurable Weighting

Making formula weights configurable:

- Pros: More flexible for different business scenarios
- Cons: Adds complexity, requires UI for configuration

### Scoring Bands

Using categorical scoring instead of continuous:

- Pros: Easier to understand, can map to business language
- Cons: Less precision, harder to rank vendors

## Related ADRs

- ADR-001: Choose TypeORM over Prisma
- ADR-002: Mongo for research_docs

## Notes

The current formula can be adjusted as we gather more data and feedback from users. The idempotency approach ensures that the matching system is reliable and predictable.