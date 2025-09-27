package entities

import (
	"time"

	"gorm.io/gorm"
)

// Notification entity for database operations
type Notification struct {
	ID        uint      `gorm:"primaryKey"`
	Type      string    `gorm:"not null"`
	Message   string    `gorm:"not null"`
	UserID    uint      `gorm:"not null;index"`
	CreatedAt time.Time `gorm:"not null"`
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	// Additional fields for better functionality
	IsRead bool `gorm:"default:false"`

	// Relationships
	User User `gorm:"foreignKey:UserID;references:ID"`
}

// TableName returns the table name for the Notification entity
func (Notification) TableName() string {
	return "notifications"
}
