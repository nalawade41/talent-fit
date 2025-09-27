package models

import (
	"time"

	"github.com/talent-fit/backend/internal/entities"
)

// ProjectStatus represents the status of a project
type ProjectStatus string

const (
	StatusOpen   ProjectStatus = "Open"
	StatusClosed ProjectStatus = "Closed"
)

// ProjectModel represents the project business model
type ProjectModel struct {
	ID            uint                `json:"id"`
	Name          string              `json:"name"`
	Description   string              `json:"description"`
	RequiredSeats int                 `json:"required_seats"`
	SeatsByType   map[string]int      `json:"seats_by_type"`
	StartDate     time.Time           `json:"start_date"`
	EndDate       time.Time           `json:"end_date"`
	Status        ProjectStatus       `json:"status"`
	CreatedAt     time.Time           `json:"created_at"`
	UpdatedAt     time.Time           `json:"updated_at"`

	// Relationships
	ProjectAllocations []ProjectAllocationModel `json:"project_allocations,omitempty"`
}

// ToEntity converts ProjectModel to entity
func (p *ProjectModel) ToEntity() *entities.Project {
	entity := &entities.Project{
		ID:            p.ID,
		Name:          p.Name,
		Description:   p.Description,
		RequiredSeats: p.RequiredSeats,
		SeatsByType:   entities.SeatsByType(p.SeatsByType),
		StartDate:     p.StartDate,
		EndDate:       p.EndDate,
		Status:        string(p.Status),
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
	}
	return entity
}

// FromEntity converts entity to ProjectModel
func (p *ProjectModel) FromEntity(entity *entities.Project) {
	p.ID = entity.ID
	p.Name = entity.Name
	p.Description = entity.Description
	p.RequiredSeats = entity.RequiredSeats
	p.SeatsByType = map[string]int(entity.SeatsByType)
	p.StartDate = entity.StartDate
	p.EndDate = entity.EndDate
	p.Status = ProjectStatus(entity.Status)
	p.CreatedAt = entity.CreatedAt
	p.UpdatedAt = entity.UpdatedAt
}
