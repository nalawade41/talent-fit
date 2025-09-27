package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
)

// EmployeeProfileRepository defines the interface for employee profile data operations
type EmployeeProfileRepository interface {
	GetAll(ctx context.Context) ([]*entities.EmployeeProfile, error)
	GetByID(ctx context.Context, id string) (*entities.EmployeeProfile, error)
	GetByUserID(ctx context.Context, userID string) (*entities.EmployeeProfile, error)
	Create(ctx context.Context, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	Update(ctx context.Context, userID string, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	Delete(ctx context.Context, userID string) error
	GetAvailableEmployees(ctx context.Context) ([]*entities.EmployeeProfile, error)
	GetEmployeesBySkills(ctx context.Context, skills []string) ([]*entities.EmployeeProfile, error)
	GetEmployeesByGeo(ctx context.Context, geo string) ([]*entities.EmployeeProfile, error)
}

// EmployeeProfileService defines the interface for employee profile business logic
type EmployeeProfileService interface {
	GetAllProfiles(ctx context.Context) ([]*models.EmployeeProfileModel, error)
	GetProfileByID(ctx context.Context, id string) (*models.EmployeeProfileModel, error)
	GetProfileByUserID(ctx context.Context, userID string) (*models.EmployeeProfileModel, error)
	CreateProfile(ctx context.Context, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error)
	UpdateProfile(ctx context.Context, userID string, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error)
	DeleteProfile(ctx context.Context, userID string) error
	GetAvailableEmployees(ctx context.Context) ([]*models.EmployeeProfileModel, error)
	SearchEmployeesBySkills(ctx context.Context, skills []string) ([]*models.EmployeeProfileModel, error)
	SearchEmployeesByGeo(ctx context.Context, geo string) ([]*models.EmployeeProfileModel, error)
	UpdateAvailabilityFlag(ctx context.Context, userID string, available bool) (*models.EmployeeProfileModel, error)
}
