package models

import (
	"time"

	"github.com/talent-fit/backend/internal/entities"
)

// AllocationType represents the type of allocation
type AllocationType string

const (
  AllocationFullTime AllocationType = "Full-time"
  AllocationPartTime AllocationType = "Part-time"
  AllocationExtra    AllocationType = "Extra"
)

// ProjectAllocationModel represents the project allocation business model
type ProjectAllocationModel struct {
  ID             int64           `json:"id"`
  ProjectID      int64           `json:"project_id"`
  EmployeeID     int64           `json:"employee_id"`
  AllocationType AllocationType `json:"allocation_type"`
  StartDate      time.Time      `json:"start_date"`
  EndDate        *time.Time     `json:"end_date"`
  CreatedAt      time.Time      `json:"created_at"`
  UpdatedAt      time.Time      `json:"updated_at"`

  // Relationships
  Project  ProjectModel `json:"project,omitempty"`  
  Employee UserModel    `json:"employee,omitempty"`
}

// ToEntity converts ProjectAllocationModel to entity
func (pa *ProjectAllocationModel) ToEntity() *entities.ProjectAllocation {
  entity := &entities.ProjectAllocation{
    ID:             pa.ID,
    ProjectID:      pa.ProjectID,
    EmployeeID:     pa.EmployeeID,
    AllocationType: string(pa.AllocationType),
    StartDate:      pa.StartDate,
    EndDate:        pa.EndDate,
    CreatedAt:      pa.CreatedAt,
    UpdatedAt:      pa.UpdatedAt,
  }
  return entity
}

// FromEntity converts entity to ProjectAllocationModel
func (pa *ProjectAllocationModel) FromEntity(entity *entities.ProjectAllocation) {
  pa.ID = entity.ID
  pa.ProjectID = entity.ProjectID
  pa.EmployeeID = entity.EmployeeID
  pa.AllocationType = AllocationType(entity.AllocationType)
  pa.StartDate = entity.StartDate
  pa.EndDate = entity.EndDate
  pa.CreatedAt = entity.CreatedAt
  pa.UpdatedAt = entity.UpdatedAt
  pa.Employee.FromEntity(&entity.Employee)
  pa.Project.FromEntity(&entity.Project)
}
