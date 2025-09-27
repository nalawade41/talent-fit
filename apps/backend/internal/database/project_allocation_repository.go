package database

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/gorm"
)

// ProjectAllocationRepository implements the domain.ProjectAllocationRepository interface
type ProjectAllocationRepository struct {
	db *gorm.DB
}

// NewProjectAllocationRepository creates a new project allocation repository
func NewProjectAllocationRepository(db *gorm.DB) domain.ProjectAllocationRepository {
	return &ProjectAllocationRepository{
		db: db,
	}
}

// GetByProjectID retrieves project allocations by project ID from database
func (r *ProjectAllocationRepository) GetByProjectID(ctx context.Context, projectID string) ([]*entities.ProjectAllocation, error) {
	var allocations []*entities.ProjectAllocation
	result := r.db.WithContext(ctx).Preload("Project").Preload("Employee").Where("project_id = ?", projectID).Find(&allocations)
	if result.Error != nil {
		return nil, result.Error
	}
	return allocations, nil
}

// GetByEmployeeID retrieves project allocations by employee ID from database
func (r *ProjectAllocationRepository) GetByEmployeeID(ctx context.Context, employeeID string) ([]*entities.ProjectAllocation, error) {
	var allocations []*entities.ProjectAllocation
	result := r.db.WithContext(ctx).Preload("Project").Preload("Employee").Where("employee_id = ?", employeeID).Find(&allocations)
	if result.Error != nil {
		return nil, result.Error
	}
	return allocations, nil
}

// Create creates a new project allocation in database
func (r *ProjectAllocationRepository) Create(ctx context.Context, allocation *entities.ProjectAllocation) (*entities.ProjectAllocation, error) {
	result := r.db.WithContext(ctx).Create(allocation)
	if result.Error != nil {
		return nil, result.Error
	}

	// Now reload with preloads
	var loaded entities.ProjectAllocation
	if err := r.db.WithContext(ctx).
		Preload("Project").
		Preload("Employee").
		First(&loaded, allocation.ID).Error; err != nil {
		return nil, err
	}

	return &loaded, nil
}

// Update updates a project allocation in database
func (r *ProjectAllocationRepository) Update(ctx context.Context, id string, allocation *entities.ProjectAllocation) (*entities.ProjectAllocation, error) {
	result := r.db.WithContext(ctx).Model(allocation).Where("id = ?", id).Updates(allocation)
	if result.Error != nil {
		return nil, result.Error
	}
	return allocation, nil
}

// Delete deletes a project allocation from database
func (r *ProjectAllocationRepository) Delete(ctx context.Context, id int64) error {
	result := r.db.WithContext(ctx).Delete(&entities.ProjectAllocation{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	return nil
}
