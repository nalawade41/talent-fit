# Talent Matching Platform - Backend

A clean Go backend for the talent matching platform following KISS principles.

## Structure

```
backend/
├── cmd/api/              # Application entry point
├── internal/             # Private application code
│   ├── models/          # Database models (User, Project, etc.)
│   ├── handlers/        # HTTP handlers for API endpoints
│   ├── services/        # Business logic services
│   ├── database/        # Database connection and setup
|   ├── domain/          # Domain interfaces
│   ├── auth/            # Google SSO authentication
│   └── config/          # Configuration management
├── pkg/                 # Reusable packages
│   ├── utils/           # Common utilities
│   └── middleware/      # HTTP middleware
└── .env                 # Environment variables (not in git)
```

## Key Features

- **Google SSO**: Secure authentication for internal users
- **Role-based Access**: Employee and Manager roles
- **AI Matching**: Intelligent talent-project matching
- **Supabase Integration**: PostgreSQL database with GORM
- **Clean Architecture**: Simple, focused structure

## Quick Start

1. Update `.env` with your Supabase and Google OAuth credentials
2. Run: `go mod tidy`
3. Start: `nx run backend:serve` or `go run cmd/api/main.go`

## API Endpoints

- `GET /health` - Health check
- `POST /auth/google` - Google OAuth login
- `GET /api/v1/users` - User management
- `GET /api/v1/projects` - Project management
- `POST /api/v1/matches/generate` - AI matching
