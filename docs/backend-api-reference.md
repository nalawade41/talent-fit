# Talent Matching Platform - API Documentation

## Overview
This document describes the REST API endpoints for the Talent Matching Platform.

**Base URL:** `http://localhost:8080`

**Authentication:** Bearer Token (JWT) for protected endpoints
```
Authorization: Bearer <jwt_token>
```

---

## Health Check

### Health Check

**Endpoint:** `GET /health`
**Description:** Check server health and status
**Authentication:** Not required

#### Request Example
```http
GET /health
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2025-09-28T14:10:45.83569Z",
  "version": "1.0.0"
}
```

---

## Authentication

### Google OAuth Login

**Endpoint:** `POST /auth/google/login`
**Description:** Authenticate user with Google ID token and return JWT
**Authentication:** Not required

#### Request Body
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyN..."
}
```

#### Request Example
```http
POST /auth/google/login
Content-Type: application/json

{
  "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE2NzAyN..."
}
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "John Doe",
  "email": "john.doe@company.com",
  "userId": 53
}
```

#### JWT Token Payload
The returned JWT token contains the following claims:
```json
{
  "user_id": 123,
  "email": "john.doe@company.com",
  "name": "John Doe",
  "role": "Employee",
  "exp": 1640995200,
  "iat": 1640908800
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format or missing credential"
}
```

**Status Code:** `401 Unauthorized`
```json
{
  "error": "Invalid id token"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to process authentication"
}
```

### Logout

**Endpoint:** `POST /auth/logout`
**Description:** Logout user and invalidate session
**Authentication:** Not required

#### Request Example
```http
POST /auth/logout
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "message": "Logged out successfully"
}
```

### Test Notification (Development Only)

**Endpoint:** `POST /notifications/test`
**Description:** Send test notification to Slack (development environment only)
**Authentication:** Not required

#### Request Example
```http
POST /notifications/test
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "message": "Test notification sent"
}
```

---

## Employee Profile Management

### 1. Get Current User Profile

**Endpoint:** `GET /api/v1/employee/me`
**Description:** Retrieves the current authenticated user's employee profile
**Authentication:** Required

#### Request Example
```http
GET /api/v1/employee/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "user_id": 53,
  "geo": "India",
  "date_of_joining": "2025-10-01T05:30:00+05:30",
  "end_date": null,
  "notice_date": null,
  "skills": [
      "Node.js",
      "React",
      "React Native"
  ],
  "years_of_experience": 2,
  "industry": [
      "Technology|1",
      "Finance|1"
  ],
  "availability_flag": true,
  "created_at": "2025-09-29T08:05:23.413468+05:30",
  "updated_at": "2025-09-29T08:05:23.413468+05:30",
  "type": "",
  "department": "Engineering",
  "experience_level": "Mid-level (2-5 years)",
  "employment_type": "Full-time",
  "name": "",
  "user": {
      "id": 53,
      "first_name": "Sagar",
      "last_name": "Dewani",
      "email": "sagar.dewani@tech9.com",
      "role": "Employee",
      "created_at": "2025-09-28T19:51:19.352758+05:30",
      "updated_at": "2025-09-29T08:05:22.380681+05:30"
  }
}
```

#### Error Responses

**Status Code:** `401 Unauthorized`
```json
{
  "error": "User email not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Internal server error message"
}
```

---

### 2. Create Employee Profile

**Endpoint:** `POST /api/v1/employee/{id}`
**Description:** Creates a new employee profile for the specified user
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Employee/User ID |

#### Request Body
```json
{
  "geo": "US-West",
  "date_of_joining": "2023-01-15T00:00:00Z",
  "end_date": "2024-12-31T00:00:00Z",
  "notice_date": null,
  "type": "Frontend Dev",
  "skills": ["React", "TypeScript", "Node.js"],
  "years_of_experience": 5,
  "industry": ["Technology"],
  "availability_flag": true
}
```

#### Request Example
```http
POST /api/v1/employee/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "geo": "US-West",
  "type": "Frontend Dev",
  "skills": ["React", "TypeScript"],
  "years_of_experience": 3,
  "industry": ["Technology"],
  "availability_flag": true
}
```

#### Success Response
**Status Code:** `201 Created`

```json
{
  "user_id": 123,
  "geo": "US-West",
  "date_of_joining": null,
  "end_date": null,
  "notice_date": null,
  "type": "Frontend Dev",
  "skills": ["React", "TypeScript"],
  "years_of_experience": 3,
  "industry": ["Technology"],
  "availability_flag": true,
  "created_at": "2023-11-20T10:00:00Z",
  "updated_at": "2023-11-20T10:00:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format or missing required fields"
}
```

**Status Code:** `409 Conflict`
```json
{
  "error": "Employee profile already exists for this user"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to create employee profile"
}
```

---

### 3. Update Employee Profile

**Endpoint:** `PATCH /api/v1/employee/{id}`
**Description:** Updates an existing employee profile (partial update)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Employee/User ID |

#### Request Body
**Note:** Only include fields you want to update. All fields are optional for PATCH.

```json
{
  "geo": "US-East",
  "date_of_joining": "2023-02-01T00:00:00Z",
  "skills": ["React", "TypeScript", "Node.js", "GraphQL"],
  "availability_flag": false,
  "years_of_experience": 6
}
```

#### Request Example
```http
PATCH /api/v1/employee/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "availability_flag": false,
  "date_of_joining": "2023-02-01T00:00:00Z",
  "skills": ["React", "TypeScript", "Node.js", "GraphQL"]
}
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "user_id": 123,
  "geo": "US-West",
  "date_of_joining": "2023-01-15T00:00:00Z",
  "end_date": "2024-12-31T00:00:00Z",
  "notice_date": null,
  "type": "Frontend Dev",
  "skills": ["React", "TypeScript", "Node.js", "GraphQL"],
  "years_of_experience": 6,
  "industry": ["Technology"],
  "availability_flag": false,
  "created_at": "2023-01-10T10:00:00Z",
  "updated_at": "2023-11-20T15:45:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "User ID is required"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Employee profile not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to update employee profile"
}
```

---

### 4. Get Employee Projects

**Endpoint:** `GET /api/v1/employee/{id}/projects`
**Description:** Retrieves all project allocations for a specific employee
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Employee/User ID |

#### Request Example
```http
GET /api/v1/employee/123/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "project_id": 456,
    "employee_id": 123,
    "allocation_type": "Full-time",
    "start_date": "2023-10-01T00:00:00Z",
    "end_date": "2024-03-31T00:00:00Z",
    "created_at": "2023-09-25T10:00:00Z",
    "updated_at": "2023-09-25T10:00:00Z",
    "project": {
      "id": 456,
      "name": "Talent Matching Platform",
      "description": "AI-powered talent matching system",
      "required_seats": 5,
      "seats_by_type": {
        "Frontend Dev": 2,
        "Backend Dev": 2,
        "UI": 1
      },
      "start_date": "2023-10-01T00:00:00Z",
      "end_date": "2024-06-30T00:00:00Z",
      "status": "Open",
      "created_at": "2023-09-20T10:00:00Z",
      "updated_at": "2023-09-20T10:00:00Z"
    }
  }
]
```

#### Success Response (Empty)
**Status Code:** `200 OK`

```json
[]
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Employee ID is required"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Employee not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve employee projects"
}
```

---

## Manager Endpoints

### 5. Get All Employees

**Endpoint:** `GET /api/v1/employees`
**Description:** Retrieves all employee profiles with optional filtering (Manager only)
**Authentication:** Required

#### Query Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `skills` | string | query | No | Comma-separated list of skills to filter by |
| `geo` | string | query | No | Comma-separated list of geographies to filter by |
| `available` | string | query | No | Filter by availability (true/false) |

#### Request Example
```http
GET /api/v1/employees?skills=React,TypeScript&geo=US-West&available=true
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "user_id": 123,
    "geo": "US-West",
    "type": "Frontend Dev",
    "skills": ["React", "TypeScript", "Node.js"],
    "years_of_experience": 5,
    "industry": ["Technology"],
    "availability_flag": true,
    "created_at": "2023-01-10T10:00:00Z",
    "updated_at": "2023-11-15T14:30:00Z",
    "user": {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "role": "Employee"
    }
  }
]
```

---

## Project Management

### 6. Get All Projects

**Endpoint:** `GET /api/v1/projects`
**Description:** Retrieves all projects in the system (Manager only)
**Authentication:** Required

#### Request Example
```http
GET /api/v1/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "id": 456,
    "name": "Talent Matching Platform",
    "description": "AI-powered talent matching system",
    "required_seats": 5,
    "seats_by_type": {
      "Frontend Dev": 2,
      "Backend Dev": 2,
      "UI": 1
    },
    "start_date": "2023-10-01T00:00:00Z",
    "end_date": "2024-06-30T00:00:00Z",
    "status": "Open",
    "created_at": "2023-09-20T10:00:00Z",
    "updated_at": "2023-09-20T10:00:00Z"
  }
]
```

#### Success Response (Empty)
**Status Code:** `200 OK`

```json
[]
```

#### Error Responses

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve projects"
}
```

---

### 7. Create Project

**Endpoint:** `POST /api/v1/projects`
**Description:** Creates a new project (Manager only)
**Authentication:** Required

#### Request Body
```json
{
  "name": "New Mobile App",
  "description": "Cross-platform mobile application development",
  "required_seats": 4,
  "seats_by_type": {
    "Frontend Dev": 2,
    "Backend Dev": 1,
    "UI": 1
  },
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-08-31T00:00:00Z",
  "status": "Open"
}
```

#### Request Example
```http
POST /api/v1/projects
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "name": "New Mobile App",
  "description": "Cross-platform mobile application development",
  "required_seats": 4,
  "seats_by_type": {
    "Frontend Dev": 2,
    "Backend Dev": 1,
    "UI": 1
  },
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-08-31T00:00:00Z"
}
```

#### Success Response
**Status Code:** `201 Created`

```json
{
  "id": 1001,
  "name": "New Mobile App",
  "description": "Cross-platform mobile application development",
  "required_seats": 4,
  "seats_by_type": {
    "Frontend Dev": 2,
    "Backend Dev": 1,
    "UI": 1
  },
  "start_date": "2024-01-15T00:00:00Z",
  "end_date": "2024-08-31T00:00:00Z",
  "status": "Open",
  "created_at": "2023-11-20T10:00:00Z",
  "updated_at": "2023-11-20T10:00:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format or missing required fields"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to create project"
}
```

---

### 8. Get Project by ID

**Endpoint:** `GET /api/v1/project/{id}`
**Description:** Retrieves a specific project by ID
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Example
```http
GET /api/v1/project/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "id": 456,
  "name": "Talent Matching Platform",
  "description": "AI-powered talent matching system",
  "required_seats": 5,
  "seats_by_type": {
    "Frontend Dev": 2,
    "Backend Dev": 2,
    "UI": 1
  },
  "start_date": "2023-10-01T00:00:00Z",
  "end_date": "2024-06-30T00:00:00Z",
  "status": "Open",
  "created_at": "2023-09-20T10:00:00Z",
  "updated_at": "2023-09-20T10:00:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Project ID is required"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve project"
}
```

---

### 9. Update Project

**Endpoint:** `PATCH /api/v1/project/{id}`
**Description:** Updates an existing project (partial update)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Body
**Note:** Only include fields you want to update. All fields are optional for PATCH.

```json
{
  "description": "Updated project description",
  "required_seats": 6,
  "seats_by_type": {
    "Frontend Dev": 3,
    "Backend Dev": 2,
    "UI": 1
  },
  "end_date": "2024-09-30T00:00:00Z",
  "status": "Open"
}
```

#### Request Example
```http
PATCH /api/v1/project/456
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "required_seats": 6,
  "seats_by_type": {
    "Frontend Dev": 3,
    "Backend Dev": 2,
    "UI": 1
  }
}
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "id": 456,
  "name": "Talent Matching Platform",
  "description": "AI-powered talent matching system",
  "required_seats": 6,
  "seats_by_type": {
    "Frontend Dev": 3,
    "Backend Dev": 2,
    "UI": 1
  },
  "start_date": "2023-10-01T00:00:00Z",
  "end_date": "2024-06-30T00:00:00Z",
  "status": "Open",
  "created_at": "2023-09-20T10:00:00Z",
  "updated_at": "2023-11-20T15:45:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Project ID is required"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to update project"
}
```

---

## AI Matching

### 10. Get Project Suggestions

**Endpoint:** `GET /api/v1/project/{id}/suggestions`
**Description:** Get AI-powered employee suggestions for a project (Manager only)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Example
```http
GET /api/v1/project/456/suggestions
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "employee_id": 123,
    "employee_name": "John Doe",
    "match_score": 0.95,
    "matching_skills": ["React", "TypeScript"],
    "reasoning": "High match due to React and TypeScript experience, available for full-time work"
  },
  {
    "employee_id": 124,
    "employee_name": "Jane Smith",
    "match_score": 0.87,
    "matching_skills": ["React", "Node.js"],
    "reasoning": "Good match with React experience and Node.js backend skills"
  }
]
```

---

## Project Allocation Management

### 11. Get Project Allocations

**Endpoint:** `GET /api/v1/project/{id}/allocation`
**Description:** Retrieves all allocations for a specific project (Manager only)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Example
```http
GET /api/v1/project/456/allocation
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "project_id": 456,
    "employee_id": 123,
    "allocation_type": "Full-time",
    "start_date": "2023-10-01T00:00:00Z",
    "end_date": "2024-03-31T00:00:00Z",
    "created_at": "2023-09-25T10:00:00Z",
    "updated_at": "2023-09-25T10:00:00Z",
    "employee": {
      "id": 123,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@company.com",
      "role": "Employee"
    }
  }
]
```

#### Success Response (Empty)
**Status Code:** `200 OK`

```json
[]
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Project ID is required"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to retrieve project allocations"
}
```

---

### 12. Create Project Allocation

**Endpoint:** `POST /api/v1/project/{id}/allocation`
**Description:** Creates new project allocations (Manager only)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Body
**Note:** Accepts an array of allocation objects to create multiple allocations at once.

```json
[
  {
    "employee_id": 125,
    "allocation_type": "Full-time",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-06-30T00:00:00Z"
  },
  {
    "employee_id": 126,
    "allocation_type": "Part-time",
    "start_date": "2024-01-15T00:00:00Z",
    "end_date": null
  }
]
```

#### Request Example
```http
POST /api/v1/project/456/allocation
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

[
  {
    "employee_id": 125,
    "allocation_type": "Full-time",
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-06-30T00:00:00Z"
  }
]
```

#### Success Response
**Status Code:** `201 Created`

**Note:** Returns the first created allocation. In a full implementation, this might return all created allocations.

```json
{
  "id": 3,
  "project_id": 456,
  "employee_id": 125,
  "allocation_type": "Full-time",
  "start_date": "2024-01-01T00:00:00Z",
  "end_date": "2024-06-30T00:00:00Z",
  "created_at": "2023-11-20T10:00:00Z",
  "updated_at": "2023-11-20T10:00:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format or missing required fields"
}
```

**Status Code:** `400 Bad Request`
```json
{
  "error": "Employee is already allocated to this project"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Employee not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to create project allocation"
}
```

---

### 13. Update Project Allocation

**Endpoint:** `PATCH /api/v1/project/{id}/allocation`
**Description:** Updates existing project allocations (Manager only)
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Project ID |

#### Request Body
**Note:** Accepts an array of allocation objects to update multiple allocations at once.

```json
[
  {
    "id": 1,
    "allocation_type": "Part-time",
    "end_date": "2024-02-28T00:00:00Z"
  },
  {
    "id": 2,
    "allocation_type": "Full-time",
    "start_date": "2024-01-01T00:00:00Z"
  }
]
```

#### Request Example
```http
PATCH /api/v1/project/456/allocation
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

[
  {
    "id": 1,
    "allocation_type": "Part-time",
    "end_date": "2024-02-28T00:00:00Z"
  }
]
```

#### Success Response
**Status Code:** `200 OK`

**Note:** Returns the first updated allocation. In a full implementation, this might return all updated allocations.

```json
{
  "id": 1,
  "project_id": 456,
  "employee_id": 123,
  "allocation_type": "Part-time",
  "start_date": "2023-10-01T00:00:00Z",
  "end_date": "2024-02-28T00:00:00Z",
  "created_at": "2023-09-25T10:00:00Z",
  "updated_at": "2023-11-20T15:45:00Z"
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "Invalid JSON format"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

**Status Code:** `404 Not Found`
```json
{
  "error": "Allocation not found"
}
```

**Status Code:** `500 Internal Server Error`
```json
{
  "error": "Failed to update project allocation"
}
```

---

## Notification Management

### 14. Get All Notifications

**Endpoint:** `GET /api/v1/notifications`
**Description:** Retrieves all notifications for the authenticated user
**Authentication:** Required

#### Request Example
```http
GET /api/v1/notifications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "type": "project_assignment",
    "message": "You have been assigned to project 'Talent Matching Platform'",
    "user_id": 123,
    "is_read": false,
    "created_at": "2023-11-20T10:00:00Z",
    "updated_at": "2023-11-20T10:00:00Z"
  }
]
```

---

### 15. Get Notification by ID

**Endpoint:** `GET /api/v1/notifications/{id}`
**Description:** Retrieves a specific notification by ID
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Notification ID |

#### Request Example
```http
GET /api/v1/notifications/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "id": 1,
  "type": "project_assignment",
  "message": "You have been assigned to project 'Talent Matching Platform'",
  "user_id": 123,
  "is_read": false,
  "created_at": "2023-11-20T10:00:00Z",
  "updated_at": "2023-11-20T10:00:00Z"
}
```

---

### 16. Create Notification

**Endpoint:** `POST /api/v1/notifications`
**Description:** Creates a new notification
**Authentication:** Required

#### Request Body
```json
{
  "type": "project_assignment",
  "message": "You have been assigned to project 'New Mobile App'",
  "user_id": 123
}
```

#### Request Example
```http
POST /api/v1/notifications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "type": "project_assignment",
  "message": "You have been assigned to project 'New Mobile App'",
  "user_id": 123
}
```

#### Success Response
**Status Code:** `201 Created`

```json
{
  "id": 2,
  "type": "project_assignment",
  "message": "You have been assigned to project 'New Mobile App'",
  "user_id": 123,
  "is_read": false,
  "created_at": "2023-11-20T10:00:00Z",
  "updated_at": "2023-11-20T10:00:00Z"
}
```

---

### 17. Update Notification

**Endpoint:** `PUT /api/v1/notifications/{id}`
**Description:** Updates an existing notification
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `id` | string | path | Yes | Notification ID |

#### Request Body
```json
{
  "type": "system_alert",
  "message": "Updated notification message",
  "is_read": true
}
```

#### Request Example
```http
PUT /api/v1/notifications/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "message": "Updated notification message",
  "is_read": true
}
```

---

### 18. Delete Notification

**Endpoint:** `DELETE /api/v1/notifications/{id}`
**Description:** Deletes a notification
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `id` | string | path | Yes | Notification ID |

#### Request Example
```http
DELETE /api/v1/notifications/1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `204 No Content`

---

### 19. Mark Notification as Read

**Endpoint:** `POST /api/v1/notifications/{id}/read`
**Description:** Marks a specific notification as read
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `id` | string | path | Yes | Notification ID |

#### Request Example
```http
POST /api/v1/notifications/1/read
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "message": "Notification marked as read"
}
```

---

### 20. Get User Notifications

**Endpoint:** `GET /api/v1/users/{userId}/notifications`
**Description:** Retrieves all notifications for a specific user
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `userId` | string | path | Yes | User ID |

#### Request Example
```http
GET /api/v1/users/123/notifications
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 21. Get Unread Notifications

**Endpoint:** `GET /api/v1/users/{userId}/notifications/unread`
**Description:** Retrieves unread notifications for a specific user
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `userId` | string | path | Yes | User ID |

#### Request Example
```http
GET /api/v1/users/123/notifications/unread
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
[
  {
    "id": 1,
    "type": "project_assignment",
    "message": "You have been assigned to project 'Talent Matching Platform'",
    "user_id": 123,
    "is_read": false,
    "created_at": "2023-11-20T10:00:00Z",
    "updated_at": "2023-11-20T10:00:00Z"
  }
]
```

---

### 22. Mark All Notifications as Read

**Endpoint:** `POST /api/v1/users/{userId}/notifications/read`
**Description:** Marks all notifications as read for a specific user
**Authentication:** Required

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|----------|
| `userId` | string | path | Yes | User ID |

#### Request Example
```http
POST /api/v1/users/123/notifications/read
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Success Response
**Status Code:** `200 OK`

```json
{
  "message": "All notifications marked as read"
}
```

---

## Data Models

### EmployeeProfileModel
```json
{
  "user_id": "integer",
  "geo": "string",
  "date_of_joining": "string (ISO 8601 date)",
  "end_date": "string (ISO 8601 date) | null",
  "notice_date": "string (ISO 8601 date) | null",
  "type": "string (Frontend Dev, Backend Dev, Fullstack Dev, AI, UI, UX, Tester, Manager, Architect, Scrum Master)",
  "skills": "array of strings",
  "years_of_experience": "integer",
  "industry": "array of strings",
  "availability_flag": "boolean",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)",
  "user": "UserModel (optional)"
}
```

### UserModel
```json
{
  "id": "integer",
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "role": "string (Employee, Manager)",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)"
}
```

### ProjectAllocationModel
```json
{
  "id": "integer",
  "project_id": "integer",
  "employee_id": "integer",
  "allocation_type": "string (Full-time, Part-time, Extra)",
  "start_date": "string (ISO 8601 date)",
  "end_date": "string (ISO 8601 date) | null",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)",
  "project": "ProjectModel (optional)",
  "employee": "UserModel (optional)"
}
```

### ProjectModel
```json
{
  "id": "integer",
  "name": "string",
  "description": "string",
  "required_seats": "integer",
  "seats_by_type": "object (key: type, value: count)",
  "start_date": "string (ISO 8601 date)",
  "end_date": "string (ISO 8601 date)",
  "status": "string (Open, Closed)",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)"
}
```

### NotificationModel
```json
{
  "id": "integer",
  "type": "string",
  "message": "string",
  "user_id": "integer",
  "is_read": "boolean",
  "created_at": "string (ISO 8601 datetime)",
  "updated_at": "string (ISO 8601 datetime)"
}
```

---

## Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `204 No Content` | Request successful, no content returned |
| `400 Bad Request` | Invalid request format or missing required parameters |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Access denied (insufficient permissions) |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists |
| `500 Internal Server Error` | Server error |

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

### JWT Token Details

The JWT token is obtained from the Google OAuth login endpoint and contains:
- **user_id**: Unique identifier for the user
- **email**: User's email address
- **name**: User's full name
- **role**: User's role (Employee/Manager)
- **exp**: Token expiration timestamp
- **iat**: Token issued at timestamp

### Token Usage

Include the JWT token in all API requests to protected endpoints:

```http
GET /api/v1/employee/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

Tokens expire after 30 minutes. When a token expires, the client will receive a `401 Unauthorized` response and should redirect the user to login again.

To obtain a new JWT token, use the Google OAuth login endpoint:

```http
POST /auth/google/login
Content-Type: application/json

{
  "credential": "google_id_token_here"
}
```

This returns a new JWT token for subsequent API calls.
Authorization: Bearer <jwt_token>
```

To obtain a JWT token, use the Google OAuth login endpoint:

```http
POST /auth/google/login
Content-Type: application/json

{
  "role": "Employee"
}
```

This returns an OAuth URL for Google authentication. After successful authentication, users receive a JWT token for subsequent API calls.

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## Versioning

The API uses URL versioning with the prefix `/api/v1`. Future versions will use `/api/v2`, etc.

---

## Support

For API support or questions, contact the development team.

**Last Updated:** September 2025  
**API Version:** 1.0
