package domain

import (
	"context"

	"github.com/talent-fit/backend/internal/models"
)

// MatchService defines the interface for AI matching business logic
type MatchService interface {
	GetProjectMatches(ctx context.Context, projectID string) error
	GetEmployeeMatches(ctx context.Context, employeeID string) error
	GenerateMatchSuggestions(ctx context.Context, projectID string) ([]*models.MatchSuggestion, error)
	GetMatchExplanation(ctx context.Context, projectID string, employeeID string) error
	GetProactiveInsights(ctx context.Context) error
}
