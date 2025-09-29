# TalentFit
## Presentation (Client Pitch Deck)

View the PPT deck here:

- Talent-Fit Platform Enhancements for Employee Allocation: https://app.presentations.ai/view/2EKWKShEou


## What this app does


TalentFit is an internal talent-matching platform that helps managers staff projects faster and helps employees showcase their skills.

- **Smart matching**: AI-assisted suggestions align employee skills, availability, and interests to project needs.
- **Profiles and projects**: CRUD for employee profiles, projects, and allocations.
- **Role-based access**: Manager and employee workflows behind authenticated APIs.
- **Notifications**: In-app notifications with read/unread tracking.

The backend is a Go service (Gin, GORM, Postgres, vector embeddings). The frontend is a React + Vite app. The monorepo is managed with Nx.


## Local setup

### Prerequisites

- Node.js 20+
- Go 1.23+
- Postgres database (local or hosted)

### Backend (Go API)

1) Create `apps/backend/.env` with at least:

```env
ENV=development
SERVER_HOST=0.0.0.0
SERVER_PORT=8080

# Either provide DB_URL or all fields below
DB_URL=
DB_HOST=localhost
DB_PORT=5432
DB_NAME=talent_matching
DB_USER=postgres
DB_PASSWORD=postgres
DB_SSL_MODE=disable

# Auth (required)
JWT_SECRET=replace-with-a-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URL=http://localhost:5173/auth/callback

# AI (optional)
OPENAI_API_KEY=
OPENAI_API_EMBEDDING_MODEL=text-embedding-3-small
AI_MODEL=gpt-4
GROKK_API_KEY=
GROKK_BASE_URL=https://api.x.ai/v1
GROKK_MODEL=grok-4-fast
```

2) Install workspace deps (from repo root):

```sh
npm ci --legacy-peer-deps
```

3) Run database migrations:

```sh
cd apps/backend
go run ./cmd/migrate --action up
```

4) Start the API server:

```sh
# from repo root using Nx
npx nx serve backend

# or directly in backend app
cd apps/backend && go run ./cmd/api
```

API runs at `http://localhost:8080`. Health: `GET /health`.

### Frontend (React + Vite)

1) Install deps (if not already):

```sh
cd apps/web
npm install
```

2) Start dev server:

```sh
npm run dev
```

App runs at `http://localhost:5173`.

## CI/CD and deployment

### GitHub Actions CI

Workflow at `.github/workflows/ci.yml`:

- Installs Node.js 20 and caches npm deps
- Runs `npm ci` then `npx nx run-many -t lint test build`
- Optional Nx Cloud integration for distributed caching/logs

### Deploying to Render (example)

- **Backend**: Render Web Service (Go)
  - Build: `go build -o dist/api ./cmd/api`
  - Start: `./dist/api`
  - Set env vars as in `.env` (DB_URL or DB_* and JWT/Google keys)
- **Database**: Render Postgres. Set `DB_URL` (or discrete DB_* vars) in backend service.
- **Frontend**: Render Static Site from `apps/web`
  - Build: `npm ci && npm run build`
  - Publish directory: `dist`

Connect the GitHub repo to Render and enable auto-deploy on `main`. GitHub Actions will run CI on pushes; Render can auto-deploy after successful builds.
