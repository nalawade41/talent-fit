package services

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
)

// ProjectService implements the domain.ProjectService interface
type ProjectService struct {
	projectRepo domain.ProjectRepository
}

// NewProjectService creates a new project service
func NewProjectService(projectRepo domain.ProjectRepository) domain.ProjectService {
	return &ProjectService{
		projectRepo: projectRepo,
	}
}

// GetAllProjects retrieves all projects
func (s *ProjectService) GetAllProjects(ctx context.Context) ([]*models.ProjectModel, error) {
	// TODO: Implement business logic for getting all projects
	// TODO: entities, err := s.projectRepo.GetAll(ctx)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entities to models and return
	return nil, nil
}

// GetProjectByID retrieves a project by ID
func (s *ProjectService) GetProjectByID(ctx context.Context, id string) (*models.ProjectModel, error) {
	// TODO: Implement business logic for getting project by ID
	// TODO: Validate ID, call repository, convert entity to model
	// TODO: entity, err := s.projectRepo.GetByID(ctx, id)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entity to model and return
	return nil, nil
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(ctx context.Context, project *models.ProjectModel) (*models.ProjectModel, error) {
	// TODO: Implement business logic for creating project
	// TODO: Validate input, convert model to entity, call repository
	// TODO: entity := project.ToEntity()
	// TODO: createdEntity, err := s.projectRepo.Create(ctx, entity)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entity back to model and return
	return nil, nil
}

// UpdateProject updates a project
func (s *ProjectService) UpdateProject(ctx context.Context, id string, project *models.ProjectModel) (*models.ProjectModel, error) {
	// TODO: Implement business logic for updating project
	// TODO: Validate input, convert model to entity, call repository
	// TODO: entity := project.ToEntity()
	// TODO: updatedEntity, err := s.projectRepo.Update(ctx, id, entity)
	// TODO: if err != nil { return nil, err }
	// TODO: Convert entity back to model and return
	return nil, nil
}

// DeleteProject deletes a project
func (s *ProjectService) DeleteProject(ctx context.Context, id string) error {
	// TODO: Implement business logic for deleting project
	// TODO: Validate ID, check dependencies (allocations), call repository
	return s.projectRepo.Delete(ctx, id)
}
