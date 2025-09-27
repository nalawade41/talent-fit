# Talent Matching Platform - API Documentation

## Overview
This document describes the REST API endpoints for the Talent Matching Platform. All endpoints require authentication via JWT token in the Authorization header.

**Base URL:** `http://localhost:8080/api/v1`

**Authentication:** Bearer Token (JWT)
```
Authorization: Bearer <jwt_token>
```

---

## Employee Profile Management

### 1. Get Employee Profile

**Endpoint:** `GET /employee/{id}`  
**Description:** Retrieves employee profile information (personal and professional details)  
**Authentication:** Required  

#### Parameters
| Parameter | Type | Location | Required | Description |
|-----------|------|----------|----------|-------------|
| `id` | string | path | Yes | Employee/User ID |

#### Request Example
```http
GET /api/v1/employee/123
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
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
  "skills": ["React", "TypeScript", "Node.js", "CSS"],
  "years_of_experience": 5,
  "industry": "Technology",
  "availability_flag": true,
  "created_at": "2023-01-10T10:00:00Z",
  "updated_at": "2023-11-15T14:30:00Z",
  "user": {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@company.com",
    "role": "Employee",
    "created_at": "2023-01-10T10:00:00Z",
    "updated_at": "2023-01-10T10:00:00Z"
  }
}
```

#### Error Responses

**Status Code:** `400 Bad Request`
```json
{
  "error": "User ID is required"
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
  "error": "Internal server error message"
}
```

---

### 2. Create Employee Profile

**Endpoint:** `POST /employee/{id}`  
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
  "industry": "Technology",
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
  "industry": "Technology",
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
  "industry": "Technology",
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

**Endpoint:** `PATCH /employee/{id}`  
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
  "industry": "Technology",
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

## Project Management

### 5. Get All Projects

**Endpoint:** `GET /projects`  
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
  },
  {
    "id": 789,
    "name": "Legacy System Migration",
    "description": "Migrate legacy systems to modern architecture",
    "required_seats": 3,
    "seats_by_type": {
      "Backend Dev": 2,
      "Frontend Dev": 1
    },
    "start_date": "2023-08-01T00:00:00Z",
    "end_date": "2023-12-31T00:00:00Z",
    "status": "Open",
    "created_at": "2023-07-20T10:00:00Z",
    "updated_at": "2023-07-20T10:00:00Z"
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

### 6. Create Project

**Endpoint:** `POST /projects`  
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

### 7. Get Project by ID

**Endpoint:** `GET /project/{id}`  
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

### 8. Update Project

**Endpoint:** `PATCH /project/{id}`  
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

## Project Allocation Management

### 4. Get Employee Projects

**Endpoint:** `GET /employee/{id}/projects`  
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
  },
  {
    "id": 2,
    "project_id": 789,
    "employee_id": 123,
    "allocation_type": "Part-time",
    "start_date": "2023-08-01T00:00:00Z",
    "end_date": "2023-09-30T00:00:00Z",
    "created_at": "2023-07-25T10:00:00Z",
    "updated_at": "2023-07-25T10:00:00Z",
    "project": {
      "id": 789,
      "name": "Legacy System Migration",
      "description": "Migrate legacy systems to modern architecture",
      "required_seats": 3,
      "seats_by_type": {
        "Backend Dev": 2,
        "Frontend Dev": 1
      },
      "start_date": "2023-08-01T00:00:00Z",
      "end_date": "2023-12-31T00:00:00Z",
      "status": "Open",
      "created_at": "2023-07-20T10:00:00Z",
      "updated_at": "2023-07-20T10:00:00Z"
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

### 9. Get Project Allocations

**Endpoint:** `GET /project/{id}/allocation`  
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
  },
  {
    "id": 2,
    "project_id": 456,
    "employee_id": 124,
    "allocation_type": "Part-time",
    "start_date": "2023-11-01T00:00:00Z",
    "end_date": null,
    "created_at": "2023-10-25T10:00:00Z",
    "updated_at": "2023-10-25T10:00:00Z",
    "employee": {
      "id": 124,
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@company.com",
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

### 10. Create Project Allocation

**Endpoint:** `POST /project/{id}/allocation`  
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

### 11. Update Project Allocation

**Endpoint:** `PATCH /project/{id}/allocation`  
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
  "industry": "string",
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

---

## Common HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200 OK` | Request successful |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request format or missing required parameters |
| `401 Unauthorized` | Authentication required or invalid token |
| `403 Forbidden` | Access denied (insufficient permissions) |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Resource already exists |
| `500 Internal Server Error` | Server error |

---

## Authentication

All API endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <jwt_token>
```

To obtain a JWT token, use the authentication endpoints:

```http
POST /auth/generate-token
```

**Note:** Authentication endpoints are not covered in this document as they are not yet implemented.

---

## Rate Limiting

Currently, no rate limiting is implemented. This may be added in future versions.

---

## Versioning

The API uses URL versioning with the prefix `/api/v1`. Future versions will use `/api/v2`, etc.

---

## Support

For API support or questions, contact the development team.

**Last Updated:** November 2023  
**API Version:** 1.0
