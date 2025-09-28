package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
)

// SimilarityMatch represents the result of similarity matching
type SimilarityMatch struct {
	Profile    *entities.EmployeeProfile
	Similarity float64
	Status     string
}

// EmployeeProfileRepository defines the interface for employee profile data operations
type EmployeeProfileRepository interface {
	GetAll(ctx context.Context) ([]*entities.EmployeeProfile, error)
	GetFiltered(ctx context.Context, skills []string, geos []string, availableOnly bool) ([]*entities.EmployeeProfile, error)
	GetByUserEmail(ctx context.Context, email string) (*entities.EmployeeProfile, error)
	GetByUserID(ctx context.Context, userID string) (*entities.EmployeeProfile, error)
	Create(ctx context.Context, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	Update(ctx context.Context, userID string, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	GetAvailableEmployees(ctx context.Context) ([]*entities.EmployeeProfile, error)
	GetSimilarAvailableProfiles(ctx context.Context, projectID string, limit int) ([]*SimilarityMatch, error)
	GetSimilarAvailableProfilesWithUser(ctx context.Context, projectID string, limit int) ([]*SimilarityMatch, error)
}

// EmployeeProfileService defines the interface for employee profile business logic
type EmployeeProfileService interface {
	GetAllProfiles(ctx context.Context) ([]*models.EmployeeProfileModel, error)
	SearchProfiles(ctx context.Context, skills []string, geos []string, availableOnly bool) ([]*models.EmployeeProfileModel, error)
	GetProfileByUserEmail(ctx context.Context, email string) (*models.EmployeeProfileModel, error)
	CreateProfile(ctx context.Context, email string, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error)
	UpdateProfile(ctx context.Context, userID string, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error)
	GetAvailableEmployees(ctx context.Context) ([]*models.EmployeeProfileModel, error)
}
