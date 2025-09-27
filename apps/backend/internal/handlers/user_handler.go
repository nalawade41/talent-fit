package handlers

import (
	"github.com/talent-fit/backend/internal/domain"
)

// UserHandler handles HTTP requests for user operations
type UserHandler struct {
	userService domain.UserService
}

// NewUserHandler creates a new user handler
func NewUserHandler(userService domain.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}
