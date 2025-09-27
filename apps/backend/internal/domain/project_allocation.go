package domain

import (
	"context"
)

// ProjectAllocationRepository defines the interface for project allocation data operations
type ProjectAllocationRepository interface {
	GetAll(ctx context.Context) error
	GetByID(ctx context.Context, id string) error
	GetByProjectID(ctx context.Context, projectID string) error
	GetByEmployeeID(ctx context.Context, employeeID string) error
	Create(ctx context.Context) error
	Update(ctx context.Context, id string) error
	Delete(ctx context.Context, id string) error
}

// ProjectAllocationService defines the interface for project allocation business logic
type ProjectAllocationService interface {
	GetAllAllocations(ctx context.Context) error
	GetAllocationByID(ctx context.Context, id string) error
	GetAllocationsByProject(ctx context.Context, projectID string) error
	GetAllocationsByEmployee(ctx context.Context, employeeID string) error
	CreateAllocation(ctx context.Context) error
	UpdateAllocation(ctx context.Context, id string) error
	DeleteAllocation(ctx context.Context, id string) error
	ReleaseEmployeeFromProject(ctx context.Context, allocationID string) error
}
