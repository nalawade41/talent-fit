package models

import (
	"time"

	"github.com/talent-fit/backend/internal/entities"
)

// UserRole represents the role of a user
type UserRole string

const (
	RoleEmployee UserRole = "Employee"
	RoleManager  UserRole = "Manager"
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

// UserModel represents the user business model
type UserModel struct {
	ID        uint      `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Role      UserRole  `json:"role"`
	Type      UserType  `json:"type"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	// Relationships
	EmployeeProfile    *EmployeeProfileModel    `json:"employee_profile,omitempty"`
	ProjectAllocations []ProjectAllocationModel `json:"project_allocations,omitempty"`
	Notifications      []NotificationModel      `json:"notifications,omitempty"`
}

// ToEntity converts UserModel to entity
func (u *UserModel) ToEntity() *entities.User {
	entity := &entities.User{
		ID:        u.ID,
		Name:      u.Name,
		Email:     u.Email,
		Role:      string(u.Role),
		Type:      string(u.Type),
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
	return entity
}

// FromEntity converts entity to UserModel
func (u *UserModel) FromEntity(entity *entities.User) {
	u.ID = entity.ID
	u.Name = entity.Name
	u.Email = entity.Email
	u.Role = UserRole(entity.Role)
	u.Type = UserType(entity.Type)
	u.CreatedAt = entity.CreatedAt
	u.UpdatedAt = entity.UpdatedAt
}
