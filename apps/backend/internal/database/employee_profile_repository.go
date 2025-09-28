package database

import (
	"context"
	"fmt"
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
	result := r.db.WithContext(ctx).Preload("User").First(&profile, "user_id = ?", userID)
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

// GetSimilarAvailableProfiles finds the most similar available employee profiles to a project using vector similarity
// Availability Logic:
// - Either: Not currently allocated to any project
// - Or: Marked as available for extra work (availability_flag = true) AND not already working on the same project
func (r *EmployeeProfileRepository) GetSimilarAvailableProfiles(ctx context.Context, projectID string, limit int) ([]*domain.SimilarityMatch, error) {
	if limit <= 0 {
		limit = 10 // Default limit
	}

	query := `
		WITH proj AS (
			SELECT embedding AS e
			FROM projects
			WHERE id = ? AND embedding IS NOT NULL
		)
		SELECT 
			ep.user_id,
			ep.geo,
			ep.date_of_joining,
			ep.end_date,
			ep.notice_date,
			ep.type,
			ep.skills,
			ep.years_of_experience,
			ep.industry,
			ep.availability_flag,
			ep.embedding,
			ep.created_at,
			ep.updated_at,
			1 - (ep.embedding <=> proj.e) AS similarity
		FROM employee_profiles ep, proj
		WHERE ep.embedding IS NOT NULL
			AND ep.deleted_at IS NULL
			AND (
				NOT EXISTS (
					SELECT 1
					FROM project_allocations pa
					WHERE pa.employee_id = ep.user_id
						AND pa.deleted_at IS NULL
						AND pa.end_date IS NULL
				)
				OR (
					ep.availability_flag = true
					AND NOT EXISTS (
						SELECT 1
						FROM project_allocations pa
						WHERE pa.employee_id = ep.user_id
							AND pa.project_id = ?
							AND pa.deleted_at IS NULL
					)
				)
			)
		ORDER BY ep.embedding <=> proj.e
		LIMIT ?`

	type QueryResult struct {
		entities.EmployeeProfile
		Similarity float64 `gorm:"column:similarity"`
	}

	var results []QueryResult
	err := r.db.WithContext(ctx).Raw(query, projectID, projectID, limit).Scan(&results).Error
	if err != nil {
		return nil, fmt.Errorf("failed to execute similarity search: %w", err)
	}

	// Convert to SimilarityMatch slice
	matches := make([]*domain.SimilarityMatch, len(results))
	for i, result := range results {
		// Create a copy of the profile to avoid pointer issues
		profile := result.EmployeeProfile
		matches[i] = &domain.SimilarityMatch{
			Profile:    &profile,
			Similarity: result.Similarity,
		}
	}

	return matches, nil
}

// GetSimilarAvailableProfilesWithUser finds similar profiles and includes user information
// Availability Logic:
// - Either: Not currently allocated to any project
// - Or: Marked as available for extra work (availability_flag = true) AND not already working on the same project
func (r *EmployeeProfileRepository) GetSimilarAvailableProfilesWithUser(ctx context.Context, projectID string, limit int) ([]*domain.SimilarityMatch, error) {
	if limit <= 0 {
		limit = 10 // Default limit
	}

	query := `
		WITH proj AS (
			SELECT embedding AS e
			FROM projects
			WHERE id = ? AND embedding IS NOT NULL
		)
		SELECT 
			ep.user_id,
			ep.geo,
			ep.date_of_joining,
			ep.end_date,
			ep.notice_date,
			ep.type,
			ep.skills,
			ep.years_of_experience,
			ep.industry,
			ep.availability_flag,
			ep.embedding,
			ep.created_at,
			ep.updated_at,
			u.first_name,
			u.last_name,
			u.email,
			u.role,
			1 - (ep.embedding <=> proj.e) AS similarity
		FROM employee_profiles ep
		INNER JOIN users u ON ep.user_id = u.id
		CROSS JOIN proj
		WHERE ep.embedding IS NOT NULL
			AND ep.deleted_at IS NULL
			AND u.deleted_at IS NULL
			AND (
				NOT EXISTS (
					SELECT 1
					FROM project_allocations pa
					WHERE pa.employee_id = ep.user_id
						AND pa.deleted_at IS NULL
						AND pa.end_date IS NULL
				)
				OR (
					ep.availability_flag = true
					AND NOT EXISTS (
						SELECT 1
						FROM project_allocations pa
						WHERE pa.employee_id = ep.user_id
							AND pa.project_id = ?
							AND pa.deleted_at IS NULL
					)
				)
			)
		ORDER BY ep.embedding <=> proj.e
		LIMIT ?`

	type QueryResultWithUser struct {
		entities.EmployeeProfile
		// User fields
		FirstName string  `gorm:"column:first_name"`
		LastName  string  `gorm:"column:last_name"`
		Email     string  `gorm:"column:email"`
		Role      string  `gorm:"column:role"`
		Similarity float64 `gorm:"column:similarity"`
	}

	var results []QueryResultWithUser
	err := r.db.WithContext(ctx).Raw(query, projectID, projectID, limit).Scan(&results).Error
	if err != nil {
		return nil, fmt.Errorf("failed to execute similarity search with user data: %w", err)
	}

	// Convert to SimilarityMatch slice and populate user data
	matches := make([]*domain.SimilarityMatch, len(results))
	for i, result := range results {
		// Create a copy of the profile
		profile := result.EmployeeProfile
		
		// Populate user data
		profile.User = entities.User{
			ID:        profile.UserID,
			FirstName: result.FirstName,
			LastName:  result.LastName,
			Email:     result.Email,
			Role:      result.Role,
		}

		matches[i] = &domain.SimilarityMatch{
			Profile:    &profile,
			Similarity: result.Similarity,
		}
	}

	return matches, nil
}
