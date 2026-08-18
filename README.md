# Evolvix AI Social Manager

**Your AI-Powered Social Media Team.**

Evolvix is a centralized, multi-tenant SaaS platform that runs an autonomous AI social‑media team for businesses. Every customer gets a "brand" with its own memory, its own connected social accounts, and an AI team that researches, plans, writes, designs, reviews, schedules, publishes, and analyses content on its behalf — all running server‑side. End users need nothing but a browser: no GPU, no local models, no local installation.

> Status: **Draft / Phase 0–1** — architecture and build prompts are locked; implementation is in progress.
> Author: **Niraj Kushwaha**, BSc (Hons) Computing, Islington College (London Metropolitan University)

---

## Table of Contents

- [Why Evolvix](#why-evolvix)
- [Core Concepts](#core-concepts)
- [System Architecture](#system-architecture)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Key Features](#key-features)
- [User Roles & Permissions](#user-roles--permissions)
- [Data Model (high level)](#data-model-high-level)
- [Development Approach](#development-approach)
- [Build Order (copy-paste AI prompts)](#build-order-copy-paste-ai-prompts)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Security & Compliance](#security--compliance)
- [Cost Philosophy](#cost-philosophy)
- [Roadmap](#roadmap)
- [Risks & Open Decisions](#risks--open-decisions)
- [Contributing](#contributing)
- [License](#license)

---

## Why Evolvix

Running social media well takes a team: a strategist, a copywriter, a designer, a scheduler, and an analyst. Most small and mid-sized businesses can't afford one — let alone all five. Evolvix replaces that team with a coordinated set of AI agents that share a single source of truth about each brand (its tone, products, audience, and visual identity) and produce on‑brand, platform‑specific content end to end, with a human able to review, edit, or fully automate approval at any point.

## Core Concepts

| Term | Meaning |
|---|---|
| **Tenant / Organization** | A customer business account. All data is fully isolated between organizations. |
| **Brand** | A business identity within an organization, with its own memory and connected social accounts. |
| **AI Gateway** | The single, central service every AI call passes through. Routes to swappable models/providers, with caching, failover, and per-tenant usage tracking. |
| **Agent** | A specialized AI component (Research, Strategy, Content, Design, etc.) with explicit, scoped permissions it cannot exceed. |
| **Orchestrator** | Coordinates agents, tools, tasks, memory, retries, approvals, and execution state. |
| **RAG (Brand Memory)** | Retrieval-Augmented Generation — brand documents are chunked, embedded, and stored per tenant in `pgvector`, then retrieved to ground every generation in real brand context. |
| **Adapter** | A platform-specific module wrapping one social network's *official* API only (never scraping). |
| **Hybrid Design System** | Deterministic template rendering (SVG/HTML‑CSS → Sharp) as the default path; AI image generation only when a new visual is genuinely required, followed by automated vision QA. |

## System Architecture

Evolvix is a monorepo split into planes over shared data stores, an AI Gateway, and a multi-agent core.

| Plane / Service | Responsibility | Core pieces |
|---|---|---|
| **Web (frontend)** | Browser UI for all roles | Next.js (App Router) + TypeScript, Tailwind |
| **API server** | Business logic, auth, tenancy, orchestration entry | Node.js + Express + TypeScript, REST |
| **Worker** | Runs queued jobs off the request path | BullMQ workers on Redis |
| **AI Gateway** | Single entry point to all models; routing + fallback | Model router, provider adapters, cache |
| **ML service (V2)** | Trains/serves prediction & recommendation models | Python + FastAPI, scikit-learn / XGBoost |
| **Data stores** | Persistent, isolated tenant data + vectors | PostgreSQL + pgvector, Redis |
| **Media** | Deterministic design rendering + storage | Sharp / SVG / HTML-CSS, object storage/CDN |

**Request path for a content job:**
Web app → API enqueues a job → Worker drives the Orchestrator → Orchestrator calls Agents → Agents call models through the AI Gateway and pull brand context from `pgvector` → Design engine renders the result → Item enters the approval queue → Approved content is published via a platform Adapter → Analytics flow back into the database and, later, the ML service.

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────────┐
│   Web    │───▶│   API    │───▶│  Worker  │───▶│ Orchestrator │
│ (Next.js)│    │(Express) │    │ (BullMQ) │    │  + Agents    │
└──────────┘    └──────────┘    └──────────┘    └──────┬───────┘
                                                         │
                          ┌──────────────────────────────┼───────────────────────┐
                          ▼                               ▼                       ▼
                    ┌───────────┐               ┌──────────────────┐    ┌─────────────────┐
                    │ AI Gateway│──▶ LLM/Vision  │  Design Engine    │    │ Social Adapters  │
                    │ (routing, │    /Image APIs │ (templates + AI   │    │ (official APIs)  │
                    │ cache,    │               │  images + QA)      │    │                  │
                    │ failover) │               └──────────────────┘    └─────────────────┘
                    └───────────┘
                          │
                          ▼
               ┌────────────────────┐
               │ PostgreSQL+pgvector│  ◀── brand memory / RAG, tenant data, analytics
               │ + Redis            │
               └────────────────────┘
```

## Monorepo Structure

```
evolvix/
├── apps/
│   ├── web/            # Next.js dashboard (frontend)
│   ├── api/             # Express + TypeScript API
│   ├── worker/           # BullMQ job worker (queue consumer)
│   ├── ai-gateway/        # Model-agnostic AI Gateway (lives inside api/ or standalone)
│   └── ml/               # FastAPI ML service (V2 — prediction & recommendations)
├── packages/            # Shared TypeScript packages (types, config, utils)
├── infra/
│   └── docker-compose.yml  # Postgres (pgvector) + Redis for local dev
├── CLAUDE.md            # Project rules for AI coding assistants (see B0)
└── README.md
```

## Tech Stack

**Backend / API**
Node.js · Express · TypeScript · PostgreSQL + `pgvector` · Prisma · Redis · BullMQ · JWT auth · Zod validation · Swagger docs · Docker

**AI Layer**
Model-agnostic AI Gateway · hosted free-tier providers (Groq, Gemini, OpenRouter, or any OpenAI-compatible endpoint) · pgvector-backed RAG · multi-agent orchestration · hybrid template + AI-image design system · vision QA

**ML Service (V2)**
Python · FastAPI · Uvicorn · scikit-learn / XGBoost / LightGBM · pandas · joblib

**Frontend**
Next.js (App Router) · TypeScript · Tailwind CSS · TanStack Query · Zustand · React Hook Form + Zod · Recharts

**Infra**
Docker Compose (local) · Nginx · a small always-on Linux host for API/worker · Vercel (or similar) for the web app

## Key Features

- **Multi-tenant accounts** with full data isolation and seven-tier RBAC.
- **Brand onboarding + brand memory (RAG)** — logo, colors, fonts, tone, audience, goals, and uploaded documents become retrievable context for every generation.
- **Model-agnostic AI Gateway** — swap LLM/embedding/vision/image providers via config, with caching, automatic failover across free tiers, and per-org usage/cost tracking.
- **Multi-agent orchestration** — Research → Strategy → Content → Design (MVP chain), with Video/Engagement/Optimization agents stubbed for later phases. Every agent run is logged; every agent has a hard permission ceiling.
- **Content generation** — platform-specific captions, hooks, hashtags, CTAs, and scripts, tailored per platform rather than copy-pasted across them.
- **Hybrid design system** — deterministic branded templates by default (IG post/carousel/story, Facebook, LinkedIn, thumbnail, banner); AI image generation only when a Design Decision Agent flags it as necessary; automated vision QA with one auto-regeneration on low scores.
- **Approval workflow** — three modes: **Manual** (AI → Human → Publish), **Semi-auto** (AI → AI review → Human → Publish), **Autonomous** (AI → AI review → Publish, gated behind an explicit `CAN_PUBLISH` permission that defaults to `false`).
- **Automation engine** — Redis + BullMQ queues for content, design, publish, and analytics jobs, with retries, exponential backoff, dead-letter handling, and a scheduler for due posts.
- **Social publishing** — per-platform adapters against *official* APIs only (Meta/Instagram first), OAuth connect, tokens encrypted at rest (AES-256-GCM) and never exposed to the frontend.
- **Analytics dashboards** — overview, per-platform, per-content, per-campaign, and growth views built on real, collected metrics.
- **Real ML (V2)** — an independent FastAPI service trains an XGBoost engagement-rate predictor and ranks recommended times/formats/topics/CTAs/hashtags. Predictions are always visually distinct from measured analytics (e.g. a dashed "predicted" series) and are never mixed with real data.
- **Admin & super-admin tooling** — organization dashboards, member/role management, and a platform-wide console for provider/model config and per-tenant usage and cost.

## User Roles & Permissions

Seven roles, enforced server-side on every protected route. Higher roles generally inherit lower-role abilities.

| Capability | Super | Owner | Admin | Mgr | Creator | Analyst | Client |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View own brand content & analytics | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Create / edit content & designs | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| Approve content | ✓ | ✓ | ✓ | ✓ | — | — | ✓ |
| Manage brands & social accounts | ✓ | ✓ | ✓ | — | — | — | — |
| Invite members & assign roles | ✓ | ✓ | ✓ | — | — | — | — |
| Enable autonomous publishing | ✓ | ✓ | — | — | — | — | — |
| Org billing & settings | ✓ | ✓ | — | — | — | — | — |
| Provider/model config & platform settings | ✓ | — | — | — | — | — | — |
| View global audit log | ✓ | — | — | — | — | — | — |

- **Super Admin** — platform operator; full control across all organizations, provider config, and audit log.
- **Org Owner** — owns a customer organization; billing, org settings, all brands and members.
- **Admin** — manages brands, members, and content within an organization.
- **Manager** — runs day-to-day content/campaigns for assigned brands; approves content.
- **Content Creator** — creates and edits content/designs; submits for approval.
- **Analyst** — read access to analytics and reports.
- **Client** — limited external stakeholder; views and approves their own brand's content.

## Data Model (high level)

Primary store: PostgreSQL + `pgvector`. Redis backs the queue/cache.

| Domain | Entities |
|---|---|
| Identity & tenancy | `users`, `organizations`, `teams`, `roles`, `permissions`, `audit_logs` |
| Brand | `brands`, `brand_guidelines`, `brand_assets`, `memories`, `embeddings` |
| Social | `social_accounts`, `oauth_tokens` (encrypted) |
| Content & design | `campaigns`, `content`, `content_versions`, `templates`, `generated_media` |
| Publishing | `scheduled_posts`, `publishing_jobs`, `comments`, `messages` |
| Insight | `analytics`, `reports`, `ai_tasks`, `agent_runs` |
| ML (V2) | `ml_datasets`, `ml_predictions`, `model_versions` |
| System | `notifications`, `cost_usage` |

Every tenant-owned row carries an indexed `org_id`, and `org_id` is always derived server-side from the JWT — never trusted from the request body.

## Development Approach

Built strictly **phase-by-phase**; a phase is not extended until it is functional and tested.

| Phase | Focus | Key deliverables |
|---|---|---|
| **0** | Research & feasibility | Lock stack decisions, confirm each social API's real capabilities and each AI provider's limits/licence, resolve open decisions. |
| **1** | Architecture & scaffold | Runnable monorepo (web, api, worker, shared packages); DB + migrations; auth + RBAC + tenancy; AI Gateway skeleton. |
| **MVP** | Vertical slice | Auth → org → brand setup → connect one platform → AI research/strategy → content → template design → approval → schedule → publish → basic analytics. |
| **V2** | Intelligence | RAG brand memory, vision QA, AI image generation, advanced analytics, ML prediction & recommendations, video, voice. |
| **V3** | Autonomy | Full closed loop: research → strategy → content → design → review → schedule → publish → analyse → learn → optimise → repeat. |

Every phase ships as real, runnable code — not documents — including objective, architecture, exact files, dependencies, env vars, DB migrations, implementation, tests, security notes, cost considerations, and verification steps.

## Build Order (copy-paste AI prompts)

The system is built with four ordered sets of prompts, each meant to be pasted one at a time into an AI coding assistant (Claude Code is the intended tool), tested, and committed before moving to the next.

**Part 1 — Backend (`B0` → `B10`)**
`B0` CLAUDE.md project rules → `B1` project init & server → `B2` auth, RBAC & tenancy → `B3` schema & migrations → `B4` brand module → `B5` content module → `B6` automation engine (queue & worker) → `B7` social adapters & publishing → `B8` analytics & cost tracking → `B9` route manager, docs & seed → `B10` security & deploy.

**Part 2 — AI Layer (`A1` → `A8`)**, built on top of the backend
`A1` AI Gateway core → `A2` providers & config → `A3` brand memory / RAG → `A4` content agent → `A5` multi-agent + orchestrator → `A6` design decision + template engine → `A7` AI image generation (Path B) → `A8` vision QA.

**Part 3 — ML Service (`M1` → `M6`)**, V2 only, once analytics data exists
`M1` service init → `M2` features → `M3` training & evaluation → `M4` serving via FastAPI → `M5` backend integration → `M6` recommendations, learning & governance.

**Part 4 — Frontend (`F1` → `F12`)**, against the deployed/local API
`F1` project, tokens & base UI → `F2` API client & auth store → `F3` auth pages & protected shell → `F4` org & brand setup → `F5` content editor → `F6` design preview → `F7` approval queue → `F8` calendar & scheduling → `F9` analytics dashboards → `F10` admin & super-admin → `F11` notifications & settings → `F12` responsive, a11y & deploy.

**Recommended order:** Backend (Part 1) → AI (Part 2) → Frontend (Part 4) for the MVP, then ML (Part 3) in V2 once real analytics data exists.

## Getting Started

> These are the expected local dev steps once the backend scaffold (B1) exists — adjust paths to match the actual repo layout as it's built out.

```bash
# 1. Clone
git clone https://github.com/<your-username>/evolvix.git
cd evolvix

# 2. Start Postgres (pgvector) + Redis
docker compose -f infra/docker-compose.yml up -d

# 3. Install dependencies (per app, or from repo root if using workspaces)
cd apps/api && npm install
cd ../web && npm install

# 4. Configure environment
cp apps/api/.env.example apps/api/.env
# fill in DATABASE_URL, REDIS_URL, JWT secrets, provider keys, etc.

# 5. Run migrations & seed
cd apps/api
npx prisma migrate dev
npm run seed        # creates a demo org + admin, prints the login

# 6. Run the services
npm run dev          # API
npm run worker        # BullMQ worker (separate process)
cd ../web && npm run dev   # frontend, reads NEXT_PUBLIC_API_URL

# 7. Explore
# API docs:    http://localhost:<port>/api/docs
# Web app:     http://localhost:3000
```

## Environment Variables

| Variable | Used by | Purpose |
|---|---|---|
| `PORT` | API | Port the API listens on |
| `DATABASE_URL` | API, ML | PostgreSQL connection string (with `pgvector` enabled) |
| `REDIS_URL` | API, Worker | Redis connection for BullMQ queues/cache |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | API | Access/refresh token signing |
| `TOKEN_ENC_KEY` | API | AES-256-GCM key for encrypting stored OAuth tokens |
| `CLIENT_URL` | API | Allowed CORS origin (the deployed frontend) |
| Provider keys (Groq/Gemini/OpenRouter/etc.) | AI Gateway | LLM, embedding, vision, and image provider credentials |
| `CLOUDINARY_URL` | API | Logo/asset/media storage |
| `SMTP_URL` | API | Transactional email (verification, resets) |
| `NEXT_PUBLIC_API_URL` | Web | Base URL the frontend calls for the API |
| `ML_URL` | API | Base URL for the ML service (V2) |

Secrets live only in environment configuration — never committed, never returned to the client.

## Security & Compliance

- Every DB query is scoped to the caller's `orgId`, read only from the verified JWT — never from the request body.
- The application **never** calls an AI model directly; every call passes through the AI Gateway.
- Only official social platform APIs are used; anything an official API doesn't support is omitted, not faked or scraped.
- Social OAuth tokens are encrypted at rest (AES-256-GCM) and never sent to the frontend.
- Passwords hashed (argon2/bcrypt); short-lived access tokens with refresh; RBAC + tenant isolation enforced server-side on every protected route.
- Autonomous publishing is gated behind an explicit `CAN_PUBLISH` permission that defaults to `false`.
- Webhooks are signature-verified; agent tool/permission scopes are enforced and cannot be exceeded.
- For real client data, AI and image providers with no-training-data policies are preferred.

## Cost Philosophy

Evolvix minimises recurring software/API cost by preferring free or open providers behind the AI Gateway where viable, while accepting and tracking infrastructure cost (compute, storage, bandwidth). Per-organization AI usage, storage, and job cost are recorded on every call so operating cost per tenant stays measurable — never guessed.

## Roadmap

- [ ] Phase 0 — feasibility research, provider/platform confirmation
- [ ] Phase 1 — monorepo scaffold, auth/RBAC/tenancy, AI Gateway skeleton
- [ ] MVP — first vertical slice live on one social platform
- [ ] V2 — RAG, vision QA, AI images, ML prediction & recommendations
- [ ] V3 — fully autonomous research → publish → learn loop

## Risks & Open Decisions

**Key risks:** social platform APIs require app review and restrict some automation (e.g. auto-DMs) — verify per platform before promising a feature; free AI tiers are rate-limited and change often (mitigated by Gateway failover); the overall scope is large, so the MVP is kept deliberately thin; client-data privacy requires no-training providers and platform-terms compliance.

**Open decisions locked during Phase 0:** API framework (NestJS vs Express+TS — currently Express+TS), LLM providers (Groq + Gemini + OpenRouter behind the Gateway), embeddings provider, image-generation model and licence, vision-QA model, Postgres hosting (managed vs self-managed), first MVP platform, and monorepo tooling (Turborepo/pnpm vs npm workspaces).

## Contributing

This is currently a solo, phase-by-phase build. Issues and suggestions are welcome once the repository is public; please open an issue describing the phase and module you're proposing to touch before submitting a PR, since work proceeds strictly in the build order above.

## License

*(Choose and add a license — e.g. proprietary/all-rights-reserved for a commercial SaaS, or MIT/Apache-2.0 if parts will be open-sourced.)*

---

*This README is derived from the Evolvix SRS v1.0 and the Backend / AI / ML / Frontend build-prompt documents (August 2026), prepared by Niraj Kushwaha.*
