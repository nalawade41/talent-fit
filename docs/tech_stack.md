# Tech Stack

This document details the technologies used across the TalentFit monorepo and how they fit together.

## Monorepo & Tooling

- **Nx**: Monorepo management, task running, and CI integration.
- **Node.js 20**: Tooling and frontend build/runtime.
- **TypeScript**: Types across frontend.
- **Prettier + ESLint**: Code formatting and linting.

## Frontend

- **Framework**: React + Vite (TypeScript)
  - Dev server and build: Vite (`apps/web`)
  - Routing: `react-router-dom`
  - Forms: `react-hook-form` + `zod`
  - Charts: `recharts`
  - Notifications: `react-hot-toast`
  - Icons: `lucide-react`
- **Styling**: Tailwind CSS + `tailwindcss-animate`
  - Tailwind config in `apps/web/tailwind.config.js`
  - PostCSS config in `apps/web/postcss.config.js`
- **State/HTTP**: Local component state; APIs called to Go backend (protected via JWT)
- **Scripts**:
  - `npm run dev`: start Vite dev server (default `http://localhost:5173`)
  - `npm run build`: production build
  - `npm run preview`: preview build
  - `npm run lint`, `npm run typecheck`

## Backend

- **Language/Runtime**: Go 1.23
- **Web Framework**: Gin
- **Project Module**: `github.com/talent-fit/backend`
- **Architecture**:
  - Handlers under `internal/handlers`
  - Services under `internal/services` (AI, business logic)
  - Entities/Models under `internal/entities` and `internal/models`
  - Server setup in `internal/server` with routes and DI container
- **Routing**: See `internal/server/routes.go`
  - Open: `/health`, `/auth/google/login`, `/auth/logout`
  - Protected (JWT): `/api/v1/...` for employees, projects, allocations, notifications
- **Auth**: JWT with HMAC (HS256)
  - Middleware in `pkg/middleware/auth.go`
  - `Authorization: Bearer <token>` required for protected APIs
  - Token secret: `JWT_SECRET`
- **Config**: `internal/config/config.go` loads from env (supports `.env`)
  - Server: `SERVER_HOST`, `SERVER_PORT`, `ENV`
  - Database: `DB_URL` or discrete `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL_MODE`
  - Auth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`, `JWT_SECRET`, `JWT_EXPIRY`
  - AI: `OPENAI_API_KEY`, `OPENAI_API_EMBEDDING_MODEL`, `AI_MODEL`, `GROKK_*`

## Database

- **Engine**: PostgreSQL (compatible with Supabase)
- **ORM**: GORM
- **Schema management**: Custom SQL migrations + GORM automigrate
  - Migration runner in `internal/database/migrations.go`
  - SQL files in `apps/backend/migrations/*.sql`
- **Core Tables** (from `001_create_initial_tables.sql`):
  - `users` (id, name, email, role, timestamps)
  - `employee_profiles` (user_id, geo, skills JSONB, availability, experience, type, industry, timestamps)
  - `projects` (name, description, seats, dates, status, timestamps)
  - `project_allocations` (project_id, employee_id, allocation_type, dates, timestamps)
  - `notifications` (type, message, user_id, is_read, timestamps)
- **Indexes**: soft-deletes, skills GIN, status/date filters, unread notifications, etc.
- **Vector Search**: `pgvector` columns and IVF indexes for embeddings:
  - `employee_profiles.embedding vector(1536)` with IVF index
  - `projects.embedding vector(1536)` with IVF index

## AI Integration

- **Embedding Provider**: OpenAI `text-embedding-3-small`
- **Chat/Summarization**: Grok (xAI) via OpenAI-compatible client
- **Service**: `internal/services/openai_embedding_service.go`
  - `GenerateEmbedding` and `GenerateBatchEmbeddings`
  - `SummarizeProject` delegates to Grok model (`GROKK_MODEL`, default `grok-4-fast`)
- **Use Cases**: Skill extraction, project summary, and vector-based matching

## CI/CD

- **CI**: GitHub Actions (`.github/workflows/ci.yml`)
  - Node 20, `npm ci`, `npx nx run-many -t lint test build`
  - Optional Nx Cloud distribution and self-healing
- **CD (example)**: Render
  - Backend (Go Web Service): build `go build -o dist/api ./cmd/api`; start `./dist/api`
  - Frontend (Static Site): `npm ci && npm run build` in `apps/web`, publish `dist`
  - Database: Render Postgres or Supabase; set `DB_URL`/`DB_*`

## Environment Variables (summary)

- Server: `ENV`, `SERVER_HOST`, `SERVER_PORT`
- Database: `DB_URL` or (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_SSL_MODE`)
- Auth: `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URL`, `JWT_EXPIRY`
- AI: `OPENAI_API_KEY`, `OPENAI_API_EMBEDDING_MODEL`, `AI_MODEL`, `GROKK_API_KEY`, `GROKK_BASE_URL`, `GROKK_MODEL`

## Local Dev Commands

- Install deps: `npm ci --legacy-peer-deps`
- Backend: `npx nx serve backend` or `cd apps/backend && go run ./cmd/api`
- Migrations: `cd apps/backend && go run ./cmd/migrate --action up`
- Frontend: `cd apps/web && npm run dev`
