# ADR 001: Stack and Initial Architecture

## Status
Proposed

## Context
The backend needs a simple, typed foundation for the Daily Diet API.

## Decision
Use:
- **Language:** TypeScript
- **Runtime:** Node.js
- **Framework:** Fastify
- **Database:** SQLite
- **Query builder:** Knex.js
- **Initial architecture:** Controllers handle request orchestration and simple business rules. Services will be introduced only when logic becomes complex or reused.

## Consequences
- Benefit: SQLite keeps local development simple.
- Benefit: Knex keeps query control explicit.
- Benefit: Fewer layers keep a small project easier to follow.
- Tradeoff: Migrations must be managed manually with Knex CLI.
- Tradeoff: Controllers can grow; if that happens, business rules should be extracted into services.
