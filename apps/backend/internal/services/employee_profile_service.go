package services

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
)

// EmployeeProfileService implements the domain.EmployeeProfileService interface
type EmployeeProfileService struct {
	profileRepo domain.EmployeeProfileRepository
}

// NewEmployeeProfileService creates a new employee profile service
func NewEmployeeProfileService(profileRepo domain.EmployeeProfileRepository) domain.EmployeeProfileService {
	return &EmployeeProfileService{
		profileRepo: profileRepo,
	}
}

// GetAllProfiles retrieves all employee profiles
func (s *EmployeeProfileService) GetAllProfiles(ctx context.Context) ([]*models.EmployeeProfileModel, error) {
	// TODO: Implement business logic for getting all profiles
	// TODO: entities, err := s.profileRepo.GetAll(ctx)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entities to models and return
	return nil, nil
}

// GetProfileByUserID retrieves an employee profile by user ID
func (s *EmployeeProfileService) GetProfileByUserID(ctx context.Context, userID string) (*models.EmployeeProfileModel, error) {
	entity, err := s.profileRepo.GetByUserID(ctx, userID)
	if err != nil {
		return nil, err
	}
	var model models.EmployeeProfileModel
	model.FromEntity(entity)
	return &model, nil
}

// CreateProfile creates a new employee profile
func (s *EmployeeProfileService) CreateProfile(ctx context.Context, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error) {
	entityProfile := profile.ToEntity()
	entity, err := s.profileRepo.Create(ctx, entityProfile)
	if err != nil {
		return nil, err
	}
	var model models.EmployeeProfileModel
	model.FromEntity(entity)
	return &model, nil
}

// UpdateProfile updates an employee profile
func (s *EmployeeProfileService) UpdateProfile(ctx context.Context, userID string, profile *models.EmployeeProfileModel) (*models.EmployeeProfileModel, error) {
	entityProfile := profile.ToEntity()
	entity, err := s.profileRepo.Update(ctx, userID, entityProfile)
	if err != nil {
		return nil, err
	}
	var model models.EmployeeProfileModel
	model.FromEntity(entity)
	return &model, nil
}

// GetAvailableEmployees retrieves available employees
func (s *EmployeeProfileService) GetAvailableEmployees(ctx context.Context) ([]*models.EmployeeProfileModel, error) {
	// TODO: Implement business logic for getting available employees
	// TODO: Filter by availability flag, end date, etc.
	// TODO: entities, err := s.profileRepo.GetAvailableEmployees(ctx)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entities to models and return
	return nil, nil
}
