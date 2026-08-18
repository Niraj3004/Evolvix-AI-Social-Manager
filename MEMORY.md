# Evolvix AI Social Manager - Project Memory

## Project Overview
Evolvix is a centralized, multi-tenant SaaS platform that functions as an autonomous AI social-media team for businesses. It allows customers to create a "brand" with its own memory and connected social accounts. The system researches, plans, writes, designs, reviews, schedules, publishes, and analyses social media content on the user's behalf. All AI processing runs entirely server-side, requiring only a browser from the end user (no local GPU or model installation required).

* **MVP Scope**: Vertical slice including Auth → Org → Brand setup → Connect one platform (Meta/IG) → AI research/strategy → Content generation → Template design → Approval workflow → Schedule → Publish → Basic analytics.
* **V2 Scope**: Intelligence features including RAG brand memory, vision QA, AI image generation, advanced analytics, ML prediction & recommendations, video, and voice.

## Source Documents
1. **Software Requirements Specification (SRS) v1.0**: Defines the product scope, functional and non-functional requirements, data, roles, and phased development approach.
2. **Backend Build Prompts (B0 - B10)**: Specifications for building the Express + TypeScript API, including Postgres + pgvector, Redis + BullMQ, JWT auth, multi-tenancy, and social adapters.
3. **AI Build Prompts (A1 - A8)**: Specifications for the model-agnostic AI layer (Gateway, RAG, Multi-agent orchestration, hybrid design system).
4. **ML Build Prompts (M1 - M6)**: Specifications for the V2 ML service in Python + FastAPI for engagement prediction and recommendations.
5. **Frontend Build Prompts (F1 - F12)**: Specifications for the Next.js (App Router) + TypeScript + Tailwind dashboard UI.

## Architecture
Evolvix is a monorepo split into specialized planes communicating over shared stores and APIs.

* **Web (Frontend)**: Next.js browser UI for all roles.
* **API Server**: Node.js + Express backend handling business logic, auth, tenancy, and orchestration entry.
* **Worker**: BullMQ workers on Redis running queued jobs off the request path.
* **AI Gateway**: Single central service routing all model calls to providers (Groq, Gemini, OpenRouter), handling caching and failover.
* **ML Service (V2)**: Python/FastAPI service training and serving XGBoost prediction models.
* **Data Stores**: PostgreSQL + pgvector (tenant data + RAG embeddings), Redis (queue/cache).
* **Media**: Sharp/SVG/HTML-CSS for deterministic design rendering, Object storage/CDN for assets.

## Technology Stack
* **Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, pgvector, Redis, BullMQ, JWT, Zod, Swagger, Docker.
* **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, Recharts.
* **AI**: AI Gateway, Groq, Gemini, OpenRouter, RAG, AI Agents, Vision QA.
* **ML**: Python, FastAPI, Uvicorn, scikit-learn, XGBoost / LightGBM, pandas, joblib.

## Database Design
Primary store is PostgreSQL + pgvector. Every tenant-owned record MUST have an indexed `orgId`.

* **Identity & Tenancy**: `users`, `organizations`, `teams`, `roles`, `permissions`, `audit_logs`
* **Brand**: `brands`, `brand_guidelines`, `brand_assets`, `memories`, `embeddings` (with HNSW vector index)
* **Social**: `social_accounts`, `oauth_tokens` (encrypted at rest)
* **Content & Design**: `campaigns`, `content`, `content_versions`, `templates`, `generated_media`
* **Publishing**: `scheduled_posts`, `publishing_jobs`, `comments`, `messages`
* **Insight**: `analytics`, `reports`, `ai_tasks`, `agent_runs`
* **ML (V2)**: `ml_datasets`, `ml_predictions`, `model_versions`
* **System**: `notifications`, `cost_usage`

## Authentication
* **Method**: Email/password with argon2/bcrypt hashing.
* **Sessions**: Secure JWT access token (short TTL) + refresh token.
* **Context**: The JWT payload carries `userId`, `orgId`, and `role`. 
* **Rule**: ALWAYS derive `orgId` from the token for DB queries. NEVER trust `orgId` from the request body.
* **Endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`.

## Roles & Permissions
Roles are enforced server-side on every protected route.
1. **Super Admin**: Platform operator (full control, provider config, audit log).
2. **Org Owner**: Customer org owner (billing, org settings, all brands & members).
3. **Admin**: Manages brands, members, and content within an org.
4. **Manager**: Runs day-to-day content/campaigns; approves content.
5. **Content Creator**: Creates and edits content/designs; submits for approval.
6. **Analyst**: Read access to analytics and reports.
7. **Client**: External stakeholder; views and approves their own brand's content.

## API Reference
*(This section will be populated as routes are implemented)*

## AI Architecture
* **AI Gateway**: Provider abstraction (OpenAICompatProvider) swapping models without app changes. Supports fallback across free tiers, caching, and token/cost tracking.
* **RAG (Brand Memory)**: Chunks and embeds brand documents into `pgvector`.
* **Orchestrator & Agents**: Coordinated execution (Research -> Strategy -> Content -> Design). Agents have explicit, scoped permissions.
* **Design Decision System**: Chooses between deterministic HTML/SVG templates (default) or AI Image Generation (only when needed).
* **Vision QA**: Auto-scores generated designs for readability and branding, triggering regeneration if below threshold.

## Frontend Architecture
* **Framework**: Next.js App Router, Tailwind CSS, dark data-dense theme.
* **State**: TanStack Query (server state), Zustand (auth store).
* **Routes**: `/login`, `/register`, protected dashboard shell (`/brands`, `/content`, `/calendar`, `/approvals`, `/analytics`, `/admin`).

## Background Jobs
* **Engine**: Redis + BullMQ.
* **Queues**: `content`, `design`, `publish`, `analytics`.
* **Features**: Retries, exponential backoff, dead-letter queue, timeouts, and concurrency limits. Scheduling via BullMQ repeat or node-cron.

## Social Media Integration
* **Adapters**: Official API wrappers only (Meta/IG first).
* **OAuth**: Tokens are encrypted at rest (AES-256-GCM) and NEVER exposed to the frontend.
* **Publishing**: Enqueued and executed via background worker.

## ML V2 Architecture
* **Service**: Independent Python + FastAPI service.
* **Model**: XGBoost regressor predicting engagement rate.
* **Integration**: Backend calls ML service via HTTP (`ML_URL`). Predictions are kept visually distinct from measured analytics in the UI.

## Environment Variables
*(To be maintained in `.env.example`)*
`PORT`
`DATABASE_URL`
`REDIS_URL`
`JWT_SECRET`
`JWT_REFRESH_SECRET`
`TOKEN_ENC_KEY`
`CLIENT_URL`
`CLOUDINARY_URL`
`SMTP_URL`
`[PROVIDER_API_KEYS]`

## Current Project Status
* **Completed**: Project initialization, read all source documentation, initialized MEMORY.md.
* **In Progress**: Backend initialization (B0 & B1).
* **Next**: Set up Express server, Prisma, Docker compose, and basic routing.
* **Known Issues**: None yet.
* **Blocked By**: N/A
