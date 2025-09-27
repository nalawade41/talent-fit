package database

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/gorm"
)

// ProjectRepository implements the domain.ProjectRepository interface
type ProjectRepository struct {
	db *gorm.DB
}

// NewProjectRepository creates a new project repository
func NewProjectRepository(db *gorm.DB) domain.ProjectRepository {
	return &ProjectRepository{
		db: db,
	}
}

// GetAll retrieves all projects from database
func (r *ProjectRepository) GetAll(ctx context.Context) ([]*entities.Project, error) {
	var projects []*entities.Project
	result := r.db.WithContext(ctx).Preload("ProjectAllocations").Find(&projects)
	if result.Error != nil {
		return nil, result.Error
	}
	return projects, nil
}

// GetByID retrieves a project by ID from database
func (r *ProjectRepository) GetByID(ctx context.Context, id string) (*entities.Project, error) {
	var project entities.Project
	result := r.db.WithContext(ctx).Preload("ProjectAllocations").First(&project, "id = ?", id)
	if result.Error != nil {
		return nil, result.Error
	}
	return &project, nil
}

// Create creates a new project in database
func (r *ProjectRepository) Create(ctx context.Context, project *entities.Project) (*entities.Project, error) {
	result := r.db.WithContext(ctx).Create(project)
	if result.Error != nil {
		return nil, result.Error
	}
	return project, nil
}

// Update updates a project in database
func (r *ProjectRepository) Update(ctx context.Context, id string, project *entities.Project) (*entities.Project, error) {
	result := r.db.WithContext(ctx).Model(&entities.Project{}).Where("id = ?", id).Updates(project)
	if result.Error != nil {
		return nil, result.Error
	}
	return project, nil
}

// Delete deletes a project from database
func (r *ProjectRepository) Delete(ctx context.Context, id string) error {
	result := r.db.WithContext(ctx).Delete(&entities.Project{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
