package services

import (
	"context"
	"errors"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/pkg/middleware"
)

// GoogleAuthService implements the domain.GoogleAuthService interface
type GoogleAuthService struct {
	userRepo domain.UserRepository
    cfg      *config.Config
}

// NewGoogleAuthService creates a new Google auth service
func NewGoogleAuthService(userRepo domain.UserRepository, cfg *config.Config) domain.GoogleAuthService {
	return &GoogleAuthService{
		userRepo: userRepo,
        cfg:      cfg,
	}
}

// AuthenticateWithGoogle validates Google ID token, ensures user, and returns app JWT
func (s *GoogleAuthService) AuthenticateWithGoogle(ctx context.Context, credential string) (*domain.AuthResponse, error) {
    provider, err := oidc.NewProvider(ctx, "https://accounts.google.com")
    if err != nil {
        return nil, errors.New("oidc provider init failed")
    }
    verifier := provider.Verifier(&oidc.Config{ClientID: s.cfg.Auth.GoogleClientID})
    idToken, err := verifier.Verify(ctx, credential)
    if err != nil {
        return nil, errors.New("invalid id token")
    }
    var claims struct {
        Email string `json:"email"`
        Name  string `json:"name"`
    }
    if err := idToken.Claims(&claims); err != nil {
        return nil, errors.New("invalid claims")
    }
    if claims.Email == "" {
        return nil, errors.New("email not present in token")
    }

    // Ensure user exists; if not, create minimal Employee user
    user, err := s.userRepo.GetByEmail(ctx, claims.Email)
    if err != nil {
        // Create a new user with Employee role
        user = &entities.User{
            FirstName: models.UserModel{FirstName: claims.Name}.FirstName,
            LastName:  "",
            Email:     claims.Email,
            Role:      string(models.RoleEmployee),
        }
        if err := s.userRepo.CreateWithEntity(ctx, user); err != nil {
            return nil, errors.New("failed to create user")
        }
    }

    // Issue app JWT
    token, err := middleware.GenerateJWTToken(s.cfg, claims.Email, user.Role)
    if err != nil {
        return nil, errors.New("failed to generate jwt")
    }
    return &domain.AuthResponse{Token: token, Name: claims.Name, Email: claims.Email}, nil
}

