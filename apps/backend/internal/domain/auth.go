package domain

import (
	"context"
)

// GoogleAuthService defines the interface for Google authentication business logic
type GoogleAuthService interface {
	GenerateToken(ctx context.Context) error
	ValidateToken(ctx context.Context, token string) error
	RefreshToken(ctx context.Context, refreshToken string) error
	RevokeToken(ctx context.Context, token string) error
}
