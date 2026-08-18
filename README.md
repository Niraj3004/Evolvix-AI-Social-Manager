# Evolvix AI Social Manager

**Your AI-Powered Social Media Team.**

Evolvix is a centralized, multi-tenant SaaS platform that runs an autonomous AI social‑media team for businesses. Every customer gets a "brand" with its own memory, its own connected social accounts, and an AI team that researches, plans, writes, designs, reviews, schedules, publishes, and analyses content on its behalf — all running server‑side. End users need nothing but a browser: no GPU, no local models, no local installation.


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


