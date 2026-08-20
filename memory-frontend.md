# Frontend Memory

This document tracks the prompts and phases executed for the Evolvix AI Social Manager frontend build.

> [!IMPORTANT]
> **Architectural Alignment Rule**: The PDF build prompts are a structural guide, but the frontend MUST be built according to the existing **Node.js/Express Backend** and **Python/FastAPI ML** services. Do not blindly follow the prompts if they conflict with the actual backend infrastructure and endpoints already in place.
## Frontend Phase 1 (Base UI & Setup)
- **Goal**: Create a Next.js (App Router) + TypeScript + Tailwind app.
- **Theme**: Clean, light/white, data-dense theme (deviating from dark mode prompt).
- **Components**: Button, Input, Textarea, Select, Card, Badge, Table, Modal/Drawer, Toast, Spinner, EmptyState.
- **Providers**: TanStack Query.
- **Route**: `/styleguide` route showcasing components.
- **Status**: DONE
