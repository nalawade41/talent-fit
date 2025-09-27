package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
)

// ProjectAllocationRepository defines the interface for project allocation data operations
type ProjectAllocationRepository interface {
	GetByProjectID(ctx context.Context, projectID string) ([]*entities.ProjectAllocation, error)
	GetByEmployeeID(ctx context.Context, employeeID string) ([]*entities.ProjectAllocation, error)
	Create(ctx context.Context, allocation *entities.ProjectAllocation) (*entities.ProjectAllocation, error)
	Update(ctx context.Context, id string, allocation *entities.ProjectAllocation) (*entities.ProjectAllocation, error)
	Delete(ctx context.Context, id int64) error
}

// ProjectAllocationService defines the interface for project allocation business logic
type ProjectAllocationService interface {
	GetAllocationsByProject(ctx context.Context, projectID string) ([]*models.ProjectAllocationModel, error)
	GetAllocationsByEmployee(ctx context.Context, employeeID string) ([]*models.ProjectAllocationModel, error)
	CreateAllocation(ctx context.Context, allocation []*models.ProjectAllocationModel) ([]*models.ProjectAllocationModel, error)
	UpdateAllocation(ctx context.Context, projectID string, allocation []*models.ProjectAllocationModel) ([]*models.ProjectAllocationModel, error)
}
