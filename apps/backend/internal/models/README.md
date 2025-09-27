# Database Models

This package contains GORM models that exactly match the data model specification from the project documentation.

## Models Overview

### User (`user.go`)
- **Primary Key**: `id`
- **Fields**: `name`, `email`, `role`, `type`
- **Enums**: 
  - `UserRole`: Employee, Manager
  - `UserType`: Frontend Dev, Backend Dev, Fullstack Dev, AI, UI, UX, Tester, Manager, Architect, Scrum Master
- **Relationships**: Has one EmployeeProfile, has many ProjectAllocations, has many Notifications

### EmployeeProfile (`employee_profile.go`)
- **Primary Key**: `user_id` (Foreign Key to User)
- **Fields**: `geo`, `date_of_joining`, `end_date`, `notice_date`, `skills`, `years_of_experience`, `industry`, `availability_flag`
- **Special Types**: 
  - `Skills`: JSON array stored as JSONB in PostgreSQL
- **Relationships**: Belongs to User

### Project (`project.go`)
- **Primary Key**: `id`
- **Fields**: `name`, `description`, `required_seats`, `seats_by_type`, `start_date`, `end_date`, `status`
- **Enums**: 
  - `ProjectStatus`: Open, Closed
- **Special Types**: 
  - `SeatsByType`: JSON object (map[string]int) stored as JSONB
- **Relationships**: Has many ProjectAllocations

### ProjectAllocation (`project_allocation.go`)
- **Primary Key**: `id`
- **Foreign Keys**: `project_id`, `employee_id`
- **Fields**: `allocation_type`, `start_date`, `end_date` (nullable)
- **Enums**: 
  - `AllocationType`: Full-time, Part-time, Extra
- **Relationships**: Belongs to Project, belongs to User (Employee)

### Notification (`notification.go`)
- **Primary Key**: `id`
- **Foreign Key**: `user_id`
- **Fields**: `type`, `message`, `created_at`, `is_read`
- **Enums**: 
  - `NotificationType`: Roll-off Alert, Project Gap, Allocation Suggestion
- **Relationships**: Belongs to User

## Features

- **GORM Integration**: Full GORM support with proper tags
- **JSON Fields**: Skills and SeatsByType stored as JSONB in PostgreSQL
- **Soft Deletes**: All models support soft deletion via `DeletedAt`
- **Timestamps**: Automatic `CreatedAt` and `UpdatedAt` tracking
- **Relationships**: Proper foreign key relationships with preloading support
- **Validation**: Database-level constraints and Go-level enums
- **Auto Migration**: Centralized migration through `models.AutoMigrate()`

## Usage

```go
// Auto-migrate all models
err := models.AutoMigrate(db)

// Create a user with employee profile
user := &models.User{
    Name:  "John Doe",
    Email: "john@company.com",
    Role:  models.RoleEmployee,
    Type:  models.TypeFullstackDev,
}

profile := &models.EmployeeProfile{
    UserID:            user.ID,
    Geo:               "US-West",
    Skills:            models.Skills{"React", "Go", "PostgreSQL"},
    YearsOfExperience: 5,
    Industry:          "FinTech",
    AvailabilityFlag:  true,
}
```

## Database Schema Compliance

These models exactly match the data model specification:
- ✅ All required fields implemented
- ✅ Correct data types and constraints
- ✅ Proper relationships and foreign keys
- ✅ Enum values match specification
- ✅ Nullable fields correctly implemented
