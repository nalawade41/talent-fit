# Talent Fit - Documentation

This directory contains all documentation for the Talent Fit project.

## 📚 Documentation Index

### 🎯 Project Overview
- **[Problem Statement](problem_statement.md)** - Business problem and objectives
- **[Requirements](requirements.md)** - Functional and technical requirements
- **[Challenge](challenge.md)** - Technical challenges and solutions
- **[UI/UX Design](ui_ux.md)** - User interface and experience specifications

### 🏗️ Technical Documentation
- **[Technology Stack](tech_stack.md)** - Complete tech stack and architecture
- **[Data Model](data_model.md)** - Database schema and data relationships
- **[Backend API Reference](backend-api-reference.md)** - Complete API documentation with examples
- **[Development Guidelines](guidelines.md)** - Coding standards and best practices

### 🚀 Development & Deployment
- **[Development Tickets](development-tickets.md)** - Sprint planning and task tracking
- **[AI Features](ai_features.md)** - AI-powered features and capabilities
- **[UI Prompt](ui_prompt.md)** - UI/UX design specifications for AI tools

### 🧪 Testing
- **[Testing Documentation](testing/)** - Test plans, strategies, and automation

## 🔗 Quick Links

- **Frontend**: `http://localhost:5173` (when running)
- **Backend**: `http://localhost:8080` (when running)
- **API Documentation**: [Backend API Reference](backend-api-reference.md)
- **Health Check**: `GET /health`

## 📖 API Integration Guide

For frontend developers integrating with the backend APIs:

1. **Start here**: [Backend API Reference](backend-api-reference.md)
2. **Authentication**: Use Google OAuth flow for JWT tokens
3. **Base URL**: `http://localhost:8080/api/v1`
4. **Headers**: `Authorization: Bearer <jwt_token>` for protected endpoints

### Key Endpoints for Integration

```javascript
// Authentication
POST /auth/google/login

// Employee Profile
GET /api/v1/employee/me
PATCH /api/v1/employee/me

// Manager Operations
GET /api/v1/employees
GET /api/v1/projects
POST /api/v1/projects

// Project Allocations
GET /api/v1/project/{id}/allocation
POST /api/v1/project/{id}/allocation

// Notifications
GET /api/v1/users/{userId}/notifications/unread
POST /api/v1/notifications/{id}/read
```

## 🛠️ Development Setup

1. **Backend**: `cd apps/backend && go run ./cmd/api`
2. **Frontend**: `cd apps/web && npm run dev`
3. **Database**: Supabase (configured in backend/.env)

## 📞 Support

For questions about the API or documentation, refer to the [Backend API Reference](backend-api-reference.md) or contact the development team.
