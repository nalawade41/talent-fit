# Backend API (Derived from Go Handlers)

Base URL: `/api/v1`
Auth: All `/api/v1/**` routes protected by middleware `AuthMiddleware()`. Auth token lifecycle under `/auth/*` (unprotected).

---
## 1. Health
GET `/health`
- Public health check.
- Response: `{ status, timestamp, version }`

---
## 2. Auth (Public)
POST `/auth/generate-token`
POST `/auth/validate-token`
POST `/auth/refresh-token`
POST `/auth/revoke-token`
(All currently return placeholder payloads; to implement JWT + Google validation.)

---
## 3. Employee Profile Routes
Personal + professional combined.

GET `/api/v1/employee/:id`
- Returns employee profile by user ID.

POST `/api/v1/employee/:id`
- Creates a profile (body: EmployeeProfileModel).

PATCH `/api/v1/employee/:id`
- Partial update (body: EmployeeProfileModel subset).

GET `/api/v1/employee/:id/projects`
- Returns allocation list (projects associated with employee).

(Planned) GET `/api/v1/employee/:id/projects/:projectId` (NOT IMPLEMENTED)

---
## 4. Manager / Employee Directory
GET `/api/v1/employees`
- List all employee profiles.
- Supports query params for filtering (skills, geo, availability, etc.) — handler placeholder; implement parsing.

---
## 5. Projects
GET `/api/v1/projects`
- List all projects.

POST `/api/v1/projects`
- Create project (body: ProjectModel).

GET `/api/v1/project/:id`
- Get project by ID.

PATCH `/api/v1/project/:id`
- Update project (body: ProjectModel subset).

(Planned) DELETE `/api/v1/project/:id` (NOT IMPLEMENTED)

---
## 6. Project Allocations
GET `/api/v1/project/:id/allocation`
- Get allocations for a project.

POST `/api/v1/project/:id/allocation`
- Create allocation(s). Body: array of ProjectAllocationModel.

PATCH `/api/v1/project/:id/allocation`
- Update allocation(s). Body: array of ProjectAllocationModel.

GET `/api/v1/employee/:id/projects`
- (Also listed in section 3) Allocations keyed by employee.

---
## 7. Matching & Suggestions
GET `/api/v1/employee/suggestions`
- Currently wired to `MatchHandler.GetProactiveInsights` (placeholder). Intended for proactive insights / suggestions.

(Planned) GET `/api/v1/matches/projects/:id` (NOT IMPLEMENTED)
(Planned) GET `/api/v1/matches/employees/:id` (NOT IMPLEMENTED)
(Planned) POST `/api/v1/matches/projects/:id/suggestions` (NOT IMPLEMENTED)
(Planned) GET `/api/v1/matches/projects/:projectId/employees/:employeeId/explanation` (NOT IMPLEMENTED)

---
## 8. Notifications
Group: `/api/v1/notifications`

GET `/api/v1/notifications`
GET `/api/v1/notifications/:id`
POST `/api/v1/notifications`
PUT `/api/v1/notifications/:id`
DELETE `/api/v1/notifications/:id`
POST `/api/v1/notifications/:id/read`

User-specific:
GET `/api/v1/users/:userId/notifications`
GET `/api/v1/users/:userId/notifications/unread`
POST `/api/v1/users/:userId/notifications/read`

---
## 9. Status Summary
Implemented (handler has logic or TODO placeholder returning JSON):
- Health, Auth routes, Employee profile (GET/POST/PATCH), Employee allocations (GET), Projects (list/get/create/update), Project allocations (GET/POST/PATCH), Notifications (all), Suggestions (placeholder).

Not Implemented Yet (Declared or planned):
- Project match endpoints, Match explanations, Employee project detail by projectId, Delete project, Data model validation improvements.

---
## 10. Recommended Next Steps
1. Implement auth token issuance (Google ID token -> internal JWT).
2. Add request/response models + validation (e.g., using binding tags in Gin models).
3. Implement filtering logic in `GET /api/v1/employees`.
4. Flesh out match service + endpoints under `/matches`.
5. Add DELETE for projects and soft-delete strategy.
6. Add pagination meta wrapper `{ data, meta }` across list endpoints.
7. Add error normalization middleware.
8. Introduce OpenAPI spec generation (e.g., swaggo/swag) for docs.

---
End of backend API inventory.
