package database

import (
	"context"
	"strings"

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

// GetFiltered retrieves employee profiles filtered by skills, geos and availability
func (r *EmployeeProfileRepository) GetFiltered(ctx context.Context, skills []string, geos []string, availableOnly bool) ([]*entities.EmployeeProfile, error) {
    dbq := r.db.WithContext(ctx).Model(&entities.EmployeeProfile{})

    if len(geos) > 0 {
        dbq = dbq.Where("geo IN ?", geos)
    }

    if availableOnly {
        dbq = dbq.Where("availability_flag = ?", true)
    }

    if len(skills) > 0 {
        // Skills is stored as JSON array; use JSON containment operator for Postgres
        // Convert to lower-case for case-insensitive match
        lowers := make([]string, 0, len(skills))
        for _, s := range skills {
            lowers = append(lowers, strings.ToLower(strings.TrimSpace(s)))
        }
        // WHERE skills ?& ARRAY['react','node'] equivalent: use @> with any
        // Build a JSON array string like '["react","node"]'
        jsonArray := "[\"" + strings.Join(lowers, "\",\"") + "\"]"
        dbq = dbq.Where("LOWER(skills::text)::jsonb @> ?::jsonb", jsonArray)
    }

    var profiles []*entities.EmployeeProfile
    if err := dbq.Find(&profiles).Error; err != nil {
        return nil, err
    }
    return profiles, nil
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
