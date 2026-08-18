# Evolvix AI Social Manager - AI Instructions

## Stack
* Node + Express + TypeScript
* PostgreSQL + pgvector
* Prisma
* Redis + BullMQ
* JWT Authentication

## Layered Architecture Convention
* **Route -> Middleware -> Controller -> Service -> Model**
* **Controllers** stay thin (handling req/res and validation).
* **Services** never touch `req`/`res`. All business logic lives here.

## Hard Rules
1. **Tenancy Rule**: EVERY DB query MUST be scoped to the caller's `orgId` taken from the verified token. NEVER use an `orgId` passed in the request body to prevent data leaks between tenants.
2. **AI Gateway Rule**: The app NEVER calls an AI model directly. All model calls MUST go through the AI Gateway.
3. **Social API Rule**: Use ONLY official social platform APIs. Never invent features or scrape.
4. **Development Approach**: Build ONE prompt at a time. Test and commit after each step. Never move forward until the current step is fully working.
