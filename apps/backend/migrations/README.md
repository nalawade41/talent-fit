# Database Migrations

This directory contains SQL migration files for the Talent Matching Platform database schema.

## Migration Files

### 001_create_initial_tables.sql
Creates all the core tables for the platform:

- **users**: User accounts with roles (Employee, Manager)
- **employee_profiles**: Employee profile data with skills, geo, availability
- **projects**: Project information with seats and status
- **project_allocations**: Employee-to-project assignments
- **notifications**: System notifications for users

## Features

### Tables Created
- ✅ **Users Table**: Basic user information with role-based access
- ✅ **Employee Profiles**: Complete employee data with JSONB skills
- ✅ **Projects**: Project management with seat allocation
- ✅ **Project Allocations**: Employee assignments to projects
- ✅ **Notifications**: Alert system for roll-offs and suggestions

### Database Features
- ✅ **JSONB Support**: Efficient storage for skills and seats_by_type
- ✅ **Soft Deletes**: All tables support soft deletion with deleted_at
- ✅ **Indexes**: Optimized indexes for common query patterns
- ✅ **Constraints**: Data integrity with CHECK constraints
- ✅ **Triggers**: Automatic updated_at timestamp updates
- ✅ **Foreign Keys**: Proper relationships with CASCADE deletes

### Performance Optimizations
- **Skills Index**: GIN index on JSONB skills for fast skill searches
- **Availability Index**: Fast filtering of available employees
- **Geo Index**: Location-based employee searches
- **Date Indexes**: Efficient date range queries for projects and allocations
- **Composite Indexes**: Optimized for common query patterns

## Running Migrations

### Automatic (via application startup)
Migrations run automatically when the application starts:
```bash
go run cmd/api/main.go
```

### Manual (via CLI tool)
```bash
# Run all pending migrations
go run cmd/migrate/main.go -action=up

# Check migration status
go run cmd/migrate/main.go -action=status

# Rollback specific migration (not implemented yet)
go run cmd/migrate/main.go -action=down -version=001_create_initial_tables.sql
```

### With custom config
```bash
go run cmd/migrate/main.go -config=config/production.yaml -action=up
```

## Migration Tracking

The system automatically creates a `schema_migrations` table to track executed migrations:

```sql
CREATE TABLE schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Sample Data

The migration includes commented sample data for testing. Uncomment the INSERT statements at the end of `001_create_initial_tables.sql` to populate with test data:

- Sample users (Employee and Manager)
- Sample employee profiles with skills
- Sample project
- Sample notification

## Data Model Compliance

This migration follows the exact data model specification:

### User
- ✅ id (PK), name, email, role
- ✅ Role: Employee, Manager
- ✅ Type moved to EmployeeProfile

### EmployeeProfile  
- ✅ userId (FK), geo, dateOfJoining, endDate, noticeDate
- ✅ type, skills (JSONB array), yearsOfExperience, industry
- ✅ availabilityFlag (boolean)

### Project
- ✅ id (PK), name, description, requiredSeats
- ✅ seatsByType (JSONB object), startDate, endDate, status

### ProjectAllocation
- ✅ id (PK), projectId (FK), employeeId (FK)
- ✅ allocationType, startDate, endDate (nullable)

### Notifications
- ✅ id (PK), type, message, userId (FK), createdAt
- ✅ Additional isRead field for better UX

## Next Steps

1. **Add Rollback Migrations**: Create corresponding rollback SQL files
2. **Add More Indexes**: Based on actual query patterns
3. **Add Partitioning**: For large notification tables
4. **Add Views**: For complex queries and reporting
5. **Add Stored Procedures**: For complex business logic

## Troubleshooting

### Migration Fails
1. Check database connection
2. Verify PostgreSQL version compatibility
3. Check for existing conflicting tables
4. Review migration logs

### Performance Issues
1. Monitor query execution plans
2. Add additional indexes as needed
3. Consider table partitioning for large datasets
4. Optimize JSONB queries with proper indexes
