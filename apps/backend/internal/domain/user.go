package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/entities"
)

// UserService defines the interface for user business logic
type UserService interface {
	// GetAllUsers retrieves all users
	GetAllUsers(ctx context.Context) error

	// GetUserByID retrieves a user by ID
	GetUserByID(ctx context.Context, id string) error

	// UpdateUser updates a user
	UpdateUser(ctx context.Context, id string) error

	// CreateUser creates a new user
	CreateUser(ctx context.Context) error

	// DeleteUser deletes a user
	DeleteUser(ctx context.Context, id string) error
}

// UserRepository defines the interface for user data access
type UserRepository interface {
	// GetAll retrieves all users from database
	GetAll(ctx context.Context) error

	// GetByID retrieves a user by ID from database
	GetByID(ctx context.Context, id string) error

	// Update updates a user in database
	Update(ctx context.Context, id string) error

	// Create creates a new user in database
	Create(ctx context.Context) error

	// Delete deletes a user from database
	Delete(ctx context.Context, id string) error

	// GetByEmail checks user existence by email
	GetByEmail(ctx context.Context, email string) (*entities.User, error)

	// CreateWithEntity creates a user from entity
    CreateWithEntity(ctx context.Context, user *entities.User) error
}
