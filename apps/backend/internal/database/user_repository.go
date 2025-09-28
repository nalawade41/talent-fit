package database

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/gorm"
)

// UserRepository implements the domain.UserRepository interface
type UserRepository struct {
	db *gorm.DB
}

// NewUserRepository creates a new user repository
func NewUserRepository(db *gorm.DB) domain.UserRepository {
	return &UserRepository{
		db: db,
	}
}

// GetAll retrieves all users from database
func (r *UserRepository) GetAll(ctx context.Context) error {
	// TODO: Implement database query to get all users
	// TODO: var users []models.User
	// TODO: result := r.db.WithContext(ctx).Find(&users)
	// TODO: return result.Error
	return nil
}

// GetByID retrieves a user by ID from database
func (r *UserRepository) GetByID(ctx context.Context, id string) error {
	// TODO: Implement database query to get user by ID
	// TODO: var user models.User
	// TODO: result := r.db.WithContext(ctx).First(&user, "id = ?", id)
	// TODO: return result.Error
	return nil
}

// Update updates a user in database
func (r *UserRepository) Update(ctx context.Context, id string) error {
	// TODO: Implement database query to update user
	// TODO: result := r.db.WithContext(ctx).Model(&user).Where("id = ?", id).Updates(updates)
	// TODO: return result.Error
	return nil
}

// Create creates a new user in database
func (r *UserRepository) Create(ctx context.Context) error {
	// TODO: Implement database query to create user
	// TODO: result := r.db.WithContext(ctx).Create(&user)
	// TODO: return result.Error
	return nil
}

// Delete deletes a user from database
func (r *UserRepository) Delete(ctx context.Context, id string) error {
	// TODO: Implement database query to delete user
	// TODO: result := r.db.WithContext(ctx).Delete(&models.User{}, "id = ?", id)
	// TODO: return result.Error
	return nil
}

// GetByEmail checks user existence by email
func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*entities.User, error) {
    var user entities.User
    result := r.db.WithContext(ctx).Where("email = ?", email).First(&user)
    return &user, result.Error
}

// CreateWithEntity creates a user from entity
func (r *UserRepository) CreateWithEntity(ctx context.Context, user *entities.User) error {
    // Use Session to ensure no prepared statement caching for Supabase pooler
    result := r.db.WithContext(ctx).Session(&gorm.Session{PrepareStmt: false}).Create(user)
    return result.Error
}
