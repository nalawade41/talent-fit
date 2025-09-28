package entities

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/pgvector/pgvector-go"
	"gorm.io/gorm"
)

// SeatsByType represents seats by type as JSON object
type SeatsByType map[string]int

// Scan implements the Scanner interface for database reading
func (s *SeatsByType) Scan(value interface{}) error {
	if value == nil {
		*s = SeatsByType{}
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, s)
	case string:
		return json.Unmarshal([]byte(v), s)
	default:
		return errors.New("cannot scan into SeatsByType")
	}
}

// Value implements the Valuer interface for database writing
func (s SeatsByType) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "{}", nil
	}
	return json.Marshal(s)
}

// Project entity for database operations
type Project struct {
	ID            int        `gorm:"primaryKey"`
	Name          string      `gorm:"not null"`
	Description   string
	RequiredSeats int         `gorm:"not null"`
	SeatsByType   SeatsByType `gorm:"type:jsonb"`
	StartDate     time.Time   `gorm:"not null"`
	EndDate       time.Time   `gorm:"not null"`
	Status        string      `gorm:"not null;default:'Open'"`
	Embedding     pgvector.Vector   `gorm:"type:vector(1536)"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
	Summary       string 
	ClientName    string
	Industry      string
	GeoPreference string
	Priority      string
	Budget        float64

	// Relationships
	ProjectAllocations []ProjectAllocation `gorm:"foreignKey:ProjectID"`
}

// TableName returns the table name for the Project entity
func (Project) TableName() string {
	return "projects"
}
