package entities

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

// Skills represents a list of skills as JSON array
type Skills []string

// Scan implements the Scanner interface for database reading
func (s *Skills) Scan(value interface{}) error {
	if value == nil {
		*s = Skills{}
		return nil
	}

	switch v := value.(type) {
	case []byte:
		return json.Unmarshal(v, s)
	case string:
		return json.Unmarshal([]byte(v), s)
	default:
		return errors.New("cannot scan into Skills")
	}
}

// Value implements the Valuer interface for database writing
func (s Skills) Value() (driver.Value, error) {
	if len(s) == 0 {
		return "[]", nil
	}
	return json.Marshal(s)
}

// EmployeeProfile entity for database operations
type EmployeeProfile struct {
	UserID            uint `gorm:"primaryKey;foreignKey"`
	Geo               string
	DateOfJoining     *time.Time
	EndDate           *time.Time
	NoticeDate        *time.Time
	Type              string `gorm:"not null"`
	Skills            Skills `gorm:"type:jsonb"`
	YearsOfExperience int
	Industry          string
	AvailabilityFlag  bool `gorm:"default:false"`
	Embedding         []float32 `gorm:"type:vector(1536)"`
	CreatedAt         time.Time
	UpdatedAt         time.Time
	DeletedAt         gorm.DeletedAt `gorm:"index"`

	// Relationships
	User User `gorm:"foreignKey:UserID;references:ID"`
}

// TableName returns the table name for the EmployeeProfile entity
func (EmployeeProfile) TableName() string {
	return "employee_profiles"
}
