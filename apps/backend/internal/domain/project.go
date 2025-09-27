package domain

import (
	"context"
)

// ProjectRepository defines the interface for project data operations
type ProjectRepository interface {
	GetAll(ctx context.Context) error
	GetByID(ctx context.Context, id string) error
	Create(ctx context.Context) error
	Update(ctx context.Context, id string) error
	Delete(ctx context.Context, id string) error
}

// ProjectService defines the interface for project business logic
type ProjectService interface {
	GetAllProjects(ctx context.Context) error
	GetProjectByID(ctx context.Context, id string) error
	CreateProject(ctx context.Context) error
	UpdateProject(ctx context.Context, id string) error
	DeleteProject(ctx context.Context, id string) error
}
