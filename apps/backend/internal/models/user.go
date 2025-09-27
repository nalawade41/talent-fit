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

// UserModel represents the user business model
type UserModel struct {
	ID        uint      `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	Role      UserRole  `json:"role"`
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
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Email:     u.Email,
		Role:      string(u.Role),
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
	return entity
}

// FromEntity converts entity to UserModel
func (u *UserModel) FromEntity(entity *entities.User) {
	u.ID = entity.ID
	u.FirstName = entity.FirstName
	u.LastName = entity.LastName
	u.Email = entity.Email
	u.Role = UserRole(entity.Role)
	u.CreatedAt = entity.CreatedAt
	u.UpdatedAt = entity.UpdatedAt
}

// GetFullName returns the full name (first name + last name)
func (u *UserModel) GetFullName() string {
	return u.FirstName + " " + u.LastName
}
