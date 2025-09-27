package database

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/gorm"
)

// EmployeeProfileRepository implements the domain.EmployeeProfileRepository interface
type EmployeeProfileRepository struct {
	db *gorm.DB
}

// NewEmployeeProfileRepository creates a new employee profile repository
func NewEmployeeProfileRepository(db *gorm.DB) domain.EmployeeProfileRepository {
	return &EmployeeProfileRepository{
		db: db,
	}
}

// GetAll retrieves all employee profiles from database
func (r *EmployeeProfileRepository) GetAll(ctx context.Context) ([]*entities.EmployeeProfile, error) {
	// TODO: Implement database query to get all employee profiles
	// TODO: var profiles []*entities.EmployeeProfile
	// TODO: result := r.db.WithContext(ctx).Find(&profiles)
	// TODO: return profiles, result.Error
	return nil, nil
}

// GetByUserID retrieves an employee profile by user ID from database
func (r *EmployeeProfileRepository) GetByUserID(ctx context.Context, userID string) (*entities.EmployeeProfile, error) {
	var profile entities.EmployeeProfile
	result := r.db.WithContext(ctx).First(&profile, "user_id = ?", userID)
	if result.Error != nil {
		return nil, result.Error
	}
	return &profile, nil
}

// Create creates a new employee profile in database
func (r *EmployeeProfileRepository) Create(ctx context.Context, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error) {
	result := r.db.WithContext(ctx).Create(profile)
	if result.Error != nil {
		return nil, result.Error
	}
	return profile, nil
}

// Update updates an employee profile in database
func (r *EmployeeProfileRepository) Update(ctx context.Context, userID string, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error) {
	result := r.db.WithContext(ctx).Model(profile).Where("user_id = ?", userID).Updates(profile)
	if result.Error != nil {
		return nil, result.Error
	}
	return profile, nil
}

// GetAvailableEmployees retrieves available employees from database
func (r *EmployeeProfileRepository) GetAvailableEmployees(ctx context.Context) ([]*entities.EmployeeProfile, error) {
	var profiles []*entities.EmployeeProfile
	result := r.db.WithContext(ctx).Where("availability_flag = ?", true).Find(&profiles)
	if result.Error != nil {
		return nil, result.Error
	}
	return profiles, nil
}
