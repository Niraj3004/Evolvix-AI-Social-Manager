# Evolvix AI Social Manager

Evolvix AI Social Manager is an AI-powered social media management platform that helps businesses create, manage, schedule, publish, and analyze social media content.

## 🚀 Features

* User authentication and role management
* Organization and brand management
* AI-powered content generation
* Brand memory using RAG
* Social media post design
* Content approval workflow
* Social media scheduling
* Social media publishing
* Analytics dashboard
* Notifications and settings
* AI provider support
* ML-based engagement prediction planned for V2

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
## 🛠️ Technologies

### Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* Prisma
* pgvector
* Redis
* BullMQ
* JWT

### AI

* AI Gateway
* Groq
* Gemini
* OpenRouter
* RAG
* AI Agents
* Vision QA

### Frontend

* Next.js
* TypeScript
* Tailwind CSS
* Zustand
* TanStack Query
* React Hook Form
* Zod
* Recharts

### ML — V2

* Python
* FastAPI
* scikit-learn
* XGBoost
* pandas

## 🏗️ Project Structure

```text
Evolvix/
├── Backend/
├── AI/
├── Frontend/
├── ML/
├── Database/
└── README.md
```

## 🔄 How It Works

```text
User
 ↓
Frontend
 ↓
Backend API
 ↓
AI Gateway
 ↓
RAG + AI Agents
 ↓
Content Generation
 ↓
Design
 ↓
Approval
 ↓
Scheduling
 ↓
Publishing
 ↓
Analytics
```

## 🤖 AI Features

Evolvix uses AI to:

* Generate social media content
* Understand brand information
* Create platform-specific content
* Assist with content strategy
* Generate branded designs
* Check design quality

The AI layer is designed to support multiple AI providers through a common gateway.

## 📊 ML — Future Version

The V2 ML service will provide:

* Engagement prediction
* Best posting time recommendations
* Content recommendations
* Hashtag recommendations
* CTA recommendations

The ML service will use analytics data collected by the platform.

## 🔐 Security

The system includes:

* JWT authentication
* Role-based access control
* Multi-tenant data isolation
* Password hashing
* Encrypted social-media tokens
* Environment-based secrets
* Request validation
* Rate limiting

## 📱 Supported Workflow

```text
Create Brand
     ↓
Generate Content
     ↓
Create Design
     ↓
Review Content
     ↓
Approve
     ↓
Schedule
     ↓
Publish
     ↓
View Analytics
```

## 🎯 Project Goal

The goal of Evolvix is to provide businesses and marketing teams with one platform for **AI-powered social media content creation, management, publishing, and analytics**.

## 👨‍💻 Developer

**Niraj Kushwaha**
BSc (Hons) Computing

## 📌 Status

🚧 **Under Development**

Backend, AI, frontend, and ML components are being developed step by step.
