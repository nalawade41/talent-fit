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
	entities, err := s.projectRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	var result []*models.ProjectModel
	for _, entity := range entities {
		model := &models.ProjectModel{}
		model.FromEntity(entity)
		result = append(result, model)
	}
	return result, nil
}

// GetProjectByID retrieves a project by ID
func (s *ProjectService) GetProjectByID(ctx context.Context, id string) (*models.ProjectModel, error) {
	entity, err := s.projectRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}
	model := &models.ProjectModel{}
	model.FromEntity(entity)
	return model, nil
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(ctx context.Context, project *models.ProjectModel) (*models.ProjectModel, error) {
	entity := project.ToEntity()
	createdEntity, err := s.projectRepo.Create(ctx, entity)
	if err != nil {
		return nil, err
	}
	model := &models.ProjectModel{}
	model.FromEntity(createdEntity)
	return model, nil
}

// UpdateProject updates a project
func (s *ProjectService) UpdateProject(ctx context.Context, id string, project *models.ProjectModel) (*models.ProjectModel, error) {
	entity := project.ToEntity()
	updatedEntity, err := s.projectRepo.Update(ctx, id, entity)
	if err != nil {
		return nil, err
	}
	model := &models.ProjectModel{}
	model.FromEntity(updatedEntity)
	return model, nil
}
