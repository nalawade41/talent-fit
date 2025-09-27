package entities

import (
	"time"

	"gorm.io/gorm"
)

// ProjectAllocation entity for database operations
type ProjectAllocation struct {
	ID             int64       `gorm:"primaryKey"`
	ProjectID      int64       `gorm:"not null;index"`
	EmployeeID     int64       `gorm:"not null;index"`
	AllocationType string     `gorm:"not null"`
	StartDate      time.Time  `gorm:"not null"`
	EndDate        *time.Time // nullable as per data model
	CreatedAt      time.Time
	UpdatedAt      time.Time
	DeletedAt      gorm.DeletedAt `gorm:"index"`

	// Relationships
	Project  Project `gorm:"foreignKey:ProjectID;references:ID"`
	Employee User    `gorm:"foreignKey:EmployeeID;references:ID"`
}

// TableName returns the table name for the ProjectAllocation entity
func (ProjectAllocation) TableName() string {
	return "project_allocations"
}
