package services

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
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
func (s *ProjectService) GetAllProjects(ctx context.Context) error {
	// TODO: Implement business logic for getting all projects
	// TODO: Call repository and convert entities to models
	return s.projectRepo.GetAll(ctx)
}

// GetProjectByID retrieves a project by ID
func (s *ProjectService) GetProjectByID(ctx context.Context, id string) error {
	// TODO: Implement business logic for getting project by ID
	// TODO: Validate ID, call repository, convert entity to model
	return s.projectRepo.GetByID(ctx, id)
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(ctx context.Context) error {
	// TODO: Implement business logic for creating project
	// TODO: Validate input, convert model to entity, call repository
	return s.projectRepo.Create(ctx)
}

// UpdateProject updates a project
func (s *ProjectService) UpdateProject(ctx context.Context, id string) error {
	// TODO: Implement business logic for updating project
	// TODO: Validate input, convert model to entity, call repository
	return s.projectRepo.Update(ctx, id)
}

// DeleteProject deletes a project
func (s *ProjectService) DeleteProject(ctx context.Context, id string) error {
	// TODO: Implement business logic for deleting project
	// TODO: Validate ID, check dependencies, call repository
	return s.projectRepo.Delete(ctx, id)
}
