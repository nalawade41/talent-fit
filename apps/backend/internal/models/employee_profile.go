package models

import (
	"time"

	"github.com/talent-fit/backend/internal/entities"
)

// UserType represents the type/specialization of a user
type UserType string

const (
	TypeFrontendDev  UserType = "Frontend Dev"
	TypeBackendDev   UserType = "Backend Dev"
	TypeFullstackDev UserType = "Fullstack Dev"
	TypeAI           UserType = "AI"
	TypeUI           UserType = "UI"
	TypeUX           UserType = "UX"
	TypeTester       UserType = "Tester"
	TypeManager      UserType = "Manager"
	TypeArchitect    UserType = "Architect"
	TypeScrumMaster  UserType = "Scrum Master"
)

// EmployeeProfileModel represents the employee profile business model
type EmployeeProfileModel struct {
	UserID            uint       `json:"user_id"`
	Geo               string     `json:"geo"`
	DateOfJoining     *time.Time `json:"date_of_joining"`
	EndDate           *time.Time `json:"end_date"`
	NoticeDate        *time.Time `json:"notice_date"`
	Skills            []string   `json:"skills"`
	YearsOfExperience int        `json:"years_of_experience"`
	Industry          string     `json:"industry"`
	AvailabilityFlag  bool       `json:"availability_flag"`
	CreatedAt         time.Time  `json:"created_at"`
	UpdatedAt         time.Time  `json:"updated_at"`
	Type              UserType   `json:"type"`

	// Relationships
	User UserModel `json:"user,omitempty"`
}

// ToEntity converts EmployeeProfileModel to entity
func (ep *EmployeeProfileModel) ToEntity() *entities.EmployeeProfile {
	entity := &entities.EmployeeProfile{
		UserID:            ep.UserID,
		Geo:               ep.Geo,
		DateOfJoining:     ep.DateOfJoining,
		EndDate:           ep.EndDate,
		NoticeDate:        ep.NoticeDate,
		Skills:            entities.Skills(ep.Skills),
		YearsOfExperience: ep.YearsOfExperience,
		Industry:          ep.Industry,
		AvailabilityFlag:  ep.AvailabilityFlag,
		CreatedAt:         ep.CreatedAt,
		UpdatedAt:         ep.UpdatedAt,
		Type:              string(ep.Type),
	}
	return entity
}

// FromEntity converts entity to EmployeeProfileModel
func (ep *EmployeeProfileModel) FromEntity(entity *entities.EmployeeProfile) {
	ep.UserID = entity.UserID
	ep.Geo = entity.Geo
	ep.DateOfJoining = entity.DateOfJoining
	ep.EndDate = entity.EndDate
	ep.NoticeDate = entity.NoticeDate
	ep.Skills = []string(entity.Skills)
	ep.YearsOfExperience = entity.YearsOfExperience
	ep.Industry = entity.Industry
	ep.AvailabilityFlag = entity.AvailabilityFlag
	ep.CreatedAt = entity.CreatedAt
	ep.UpdatedAt = entity.UpdatedAt
	ep.Type = UserType(entity.Type)
}
