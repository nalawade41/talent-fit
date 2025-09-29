package domain

import (
	"context"
)

// GoogleAuthService defines the interface for Google authentication business logic
type GoogleAuthService interface {
    AuthenticateWithGoogle(ctx context.Context, credential string) (*AuthResponse, error)
}

// AuthResponse represents the result of authentication
type AuthResponse struct {
    Token string
    Name  string
    Email string
    UserID uint
}
