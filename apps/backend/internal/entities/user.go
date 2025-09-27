package entities

import (
	"time"

	"gorm.io/gorm"
)

// User entity for database operations
type User struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"not null"`
	Email     string `gorm:"uniqueIndex;not null"`
	Role      string `gorm:"not null"`
	Type      string `gorm:"not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	// Relationships
	EmployeeProfile    *EmployeeProfile    `gorm:"foreignKey:UserID"`
	ProjectAllocations []ProjectAllocation `gorm:"foreignKey:EmployeeID"`
	Notifications      []Notification      `gorm:"foreignKey:UserID"`
}

// TableName returns the table name for the User entity
func (User) TableName() string {
	return "users"
}
