package domain

import (
	"context"
)

// EmployeeProfileRepository defines the interface for employee profile data operations
type EmployeeProfileRepository interface {
	GetAll(ctx context.Context) error
	GetByID(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID string) error
	Create(ctx context.Context) error
	Update(ctx context.Context, userID string) error
	Delete(ctx context.Context, userID string) error
	GetAvailableEmployees(ctx context.Context) error
	GetEmployeesBySkills(ctx context.Context, skills []string) error
	GetEmployeesByGeo(ctx context.Context, geo string) error
}

// EmployeeProfileService defines the interface for employee profile business logic
type EmployeeProfileService interface {
	GetAllProfiles(ctx context.Context) error
	GetProfileByID(ctx context.Context, id string) error
	GetProfileByUserID(ctx context.Context, userID string) error
	CreateProfile(ctx context.Context) error
	UpdateProfile(ctx context.Context, userID string) error
	DeleteProfile(ctx context.Context, userID string) error
	GetAvailableEmployees(ctx context.Context) error
	SearchEmployeesBySkills(ctx context.Context, skills []string) error
	SearchEmployeesByGeo(ctx context.Context, geo string) error
	UpdateAvailabilityFlag(ctx context.Context, userID string, available bool) error
}
