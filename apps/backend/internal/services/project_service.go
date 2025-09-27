package services

import (
	"context"
	"log"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/internal/utils"
)

// ProjectService implements the domain.ProjectService interface
type ProjectService struct {
	projectRepo      domain.ProjectRepository
	embeddingService domain.EmbeddingService
	embeddingUtils   *utils.EmbeddingEntityUtils
}

// NewProjectService creates a new project service
func NewProjectService(projectRepo domain.ProjectRepository, embeddingService domain.EmbeddingService) domain.ProjectService {
	return &ProjectService{
		projectRepo:      projectRepo,
		embeddingService: embeddingService,
		embeddingUtils:   utils.NewEmbeddingEntityUtils(embeddingService),
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
	
	// Generate embedding before creating
	err := s.embeddingUtils.GenerateProjectEmbedding(ctx, entity)
	if err != nil {
		// Log the error but don't fail the creation - embedding generation is optional
		log.Printf("Warning: Failed to generate embedding for project: %v", err)
	}
	
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
	
	// Generate embedding before updating (force update to reflect changes)
	err := s.embeddingUtils.UpdateProjectEmbedding(ctx, entity, true)
	if err != nil {
		log.Printf("Warning: Failed to generate embedding for project update: %v", err)
	}
	
	updatedEntity, err := s.projectRepo.Update(ctx, id, entity)
	if err != nil {
		return nil, err
	}
	model := &models.ProjectModel{}
	model.FromEntity(updatedEntity)
	return model, nil
}
