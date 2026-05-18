# ADR 001: Escolha da Stack Tecnológica

## Status
Proposed

## Context
Precisamos de uma base sólida, escalável e tipada para o backend.

## Decision
Utilizaremos:
- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework:** Fastify
- **Banco de Dados:** SQLite
- **Query Builder:** Knex.js

## Consequences
- Vantagem: Simplicidade operacional (SQLite), controle total das queries e produtividade com Knex.js.
- Desvantagem: Necessidade de gerenciar migrações manualmente via Knex CLI.
