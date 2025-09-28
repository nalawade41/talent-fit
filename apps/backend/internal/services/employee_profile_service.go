package services

import (
	"context"
	"log"
	"time"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/internal/utils"
)

// EmployeeProfileService implements the domain.EmployeeProfileService interface
type EmployeeProfileService struct {
	profileRepo      domain.EmployeeProfileRepository
	embeddingService domain.EmbeddingService
	embeddingUtils   *utils.EmbeddingEntityUtils
    orchestrator     domain.NotificationOrchestrator
}

// NewEmployeeProfileService creates a new employee profile service
func NewEmployeeProfileService(profileRepo domain.EmployeeProfileRepository, embeddingService domain.EmbeddingService, orchestrator domain.NotificationOrchestrator) domain.EmployeeProfileService {
	return &EmployeeProfileService{
		profileRepo:      profileRepo,
		embeddingService: embeddingService,
		embeddingUtils:   utils.NewEmbeddingEntityUtils(embeddingService),
        orchestrator:     orchestrator,
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

// SearchProfiles retrieves profiles by filters
func (s *EmployeeProfileService) SearchProfiles(ctx context.Context, skills []string, geos []string, availableOnly bool) ([]*models.EmployeeProfileModel, error) {
    entities, err := s.profileRepo.GetFiltered(ctx, skills, geos, availableOnly)
    if err != nil {
        return nil, err
    }
    modelsOut := make([]*models.EmployeeProfileModel, 0, len(entities))
    for _, e := range entities {
        var m models.EmployeeProfileModel
        m.FromEntity(e)
        modelsOut = append(modelsOut, &m)
    }
    return modelsOut, nil
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

	// Generate embedding before creating
	err := s.embeddingUtils.GenerateEmployeeProfileEmbedding(ctx, entityProfile)
	if err != nil {
		// Log the error but don't fail the creation - embedding generation is optional
		log.Printf("Warning: Failed to generate embedding for profile: %v", err)
	}

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
    // Load existing to detect rolloff trigger
    existing, _ := s.profileRepo.GetByUserID(ctx, userID)

	// Generate embedding before updating (force update to reflect changes)
	err := s.embeddingUtils.UpdateEmployeeProfileEmbedding(ctx, entityProfile, true)
	if err != nil {
		// Log the error but don't fail the update - embedding generation is optional
		log.Printf("Warning: Failed to generate embedding for profile update: %v", err)
	}

	entity, err := s.profileRepo.Update(ctx, userID, entityProfile)
	if err != nil {
		return nil, err
	}
	var model models.EmployeeProfileModel
	model.FromEntity(entity)

    // Trigger: Employee rolling off when EndDate set from nil to non-nil
    if existing != nil && existing.EndDate == nil && entity.EndDate != nil {
        fullName := model.User.GetFullName()
        subject := "Employee rolling off"
        body := "Employee " + fullName + " is rolling off on " + entity.EndDate.Format("2006-01-02")
        msg := domain.NotificationMessage{
            Type:    domain.NotificationTypeRolloffAlert,
            Subject: subject,
            Body:    body,
            Metadata: map[string]string{
                "employeeId": userID,
                "endDate":    entity.EndDate.Format(time.RFC3339),
            },
            // Manager resolution unknown -> send to default channel only
            Recipients: []domain.Recipient{{}},
        }
        // In-app still needs a user to persist against; use the manager-less pathway by logging only
        // As minimal approach, post only to Slack default channel (recipient UserID 0)
        _ = s.orchestrator.Dispatch(ctx, msg)
    }
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
