package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
)

// ProjectRepository defines the interface for project data operations
type ProjectRepository interface {
	GetAll(ctx context.Context) ([]*entities.Project, error)
	GetByID(ctx context.Context, id string) (*entities.Project, error)
	Create(ctx context.Context, project *entities.Project) (*entities.Project, error)
	Update(ctx context.Context, id string, project *entities.Project) (*entities.Project, error)
}

// ProjectService defines the interface for project business logic
type ProjectService interface {
	GetAllProjects(ctx context.Context) ([]*models.ProjectModel, error)
	GetProjectByID(ctx context.Context, id string) (*models.ProjectModel, error)
	CreateProject(ctx context.Context, project *models.ProjectModel) (*models.ProjectModel, error)
	UpdateProject(ctx context.Context, id string, project *models.ProjectModel) (*models.ProjectModel, error)
}
