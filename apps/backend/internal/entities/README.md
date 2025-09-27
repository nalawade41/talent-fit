# Database Entities

This package contains GORM entities for database operations. These are separate from business models to maintain clean separation of concerns.

## Architecture

```
┌─────────────────┐    ToEntity()     ┌─────────────────┐
│  Business Model │ ───────────────► │ Database Entity │
│  (models/)      │                  │  (entities/)    │
│                 │ ◄─────────────── │                 │
└─────────────────┘   FromEntity()   └─────────────────┘
```

## Key Differences

### Models (Business Logic)
- **Purpose**: API responses, business logic
- **Tags**: JSON tags for serialization
- **Types**: Strong typing with enums (UserRole, ProjectStatus, etc.)
- **Clean**: No GORM concerns, pure business objects

### Entities (Database Layer)
- **Purpose**: Database operations, GORM mapping
- **Tags**: GORM tags for database mapping
- **Types**: Simple types (string, *string) for database compatibility
- **GORM**: Custom Scanner/Valuer for JSON fields

## Entities Overview

### User Entity
- Simple string fields for `role` and `type`
- GORM relationships and constraints
- Database-optimized structure

### EmployeeProfile Entity
- Custom `Skills` type with JSON serialization
- Proper nullable fields with `*time.Time`
- JSONB storage for PostgreSQL

### Project Entity
- Custom `SeatsByType` for JSON object storage
- String-based status field
- GORM relationships

### ProjectAllocation Entity
- Simple string for `allocation_type`
- Proper foreign key relationships
- Nullable `end_date`

### Notification Entity
- String-based `type` field
- Additional `is_read` field for functionality
- User relationship

## Usage Pattern

```go
// In Repository Layer - Work with entities
func (r *UserRepository) Create(ctx context.Context, user *models.User) error {
    entity := user.ToEntity()
    result := r.db.WithContext(ctx).Create(entity)
    if result.Error != nil {
        return result.Error
    }
    user.FromEntity(entity) // Update with generated ID, timestamps
    return nil
}

// In Service Layer - Work with models
func (s *UserService) CreateUser(ctx context.Context, user *models.User) error {
    return s.userRepo.Create(ctx, user)
}
```

## Benefits

1. **Separation of Concerns**: Database logic separate from business logic
2. **Type Safety**: Strong typing in models, flexible storage in entities
3. **API Clean**: Models have clean JSON structure for APIs
4. **Database Optimized**: Entities optimized for GORM and PostgreSQL
5. **Maintainable**: Changes to database schema don't affect business logic
