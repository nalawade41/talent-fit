package services

import (
	"context"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/internal/utils"
)

// MatchService implements the domain.MatchService interface
type MatchService struct {
	userRepo         domain.UserRepository
	projectRepo      domain.ProjectRepository
	allocationRepo   domain.ProjectAllocationRepository
	profileRepo      domain.EmployeeProfileRepository
	embeddingService domain.EmbeddingService
	embeddingUtils   *utils.EmbeddingUtils
}

// NewMatchService creates a new match service
func NewMatchService(
	userRepo domain.UserRepository,
	projectRepo domain.ProjectRepository,
	allocationRepo domain.ProjectAllocationRepository,
	profileRepo domain.EmployeeProfileRepository,
	embeddingService domain.EmbeddingService,
) domain.MatchService {
	return &MatchService{
		userRepo:         userRepo,
		projectRepo:      projectRepo,
		allocationRepo:   allocationRepo,
		profileRepo:      profileRepo,
		embeddingService: embeddingService,
		embeddingUtils:   utils.NewEmbeddingUtils(embeddingService),
	}
}

// GetProjectMatches gets matching employees for a project
func (s *MatchService) GetProjectMatches(ctx context.Context, projectID string) error {
	// TODO: Implement AI matching logic for project
	// TODO: Get project requirements, find matching employees
	// TODO: Rank by skill overlap, availability, geo, industry experience
	return nil
}

// GetEmployeeMatches gets matching projects for an employee
func (s *MatchService) GetEmployeeMatches(ctx context.Context, employeeID string) error {
	// TODO: Implement AI matching logic for employee
	// TODO: Get employee profile, find matching projects
	return nil
}

// GenerateMatchSuggestions generates AI-powered match suggestions
func (s *MatchService) GenerateMatchSuggestions(ctx context.Context, projectID string) ([]*models.MatchSuggestion, error) {
	// Convert projectID to int
	projectIDInt, err := strconv.Atoi(projectID)
	if err != nil {
		return nil, fmt.Errorf("invalid project ID: %w", err)
	}

	// 1. Get project details
	project, err := s.projectRepo.GetByID(ctx, projectIDInt)
	if err != nil {
		return nil, fmt.Errorf("failed to get project: %w", err)
	}

	// 2. Get similar available candidates
	candidates, err := s.profileRepo.GetSimilarAvailableProfilesWithUser(ctx, projectID, 20)
	if err != nil {
		return nil, fmt.Errorf("failed to get candidates: %w", err)
	}

	if len(candidates) == 0 {
		return []*models.MatchSuggestion{}, nil // Return empty array if no candidates
	}

	// 3. Generate matching prompt using default scoring rules
	rules := utils.DefaultScoringRules()
	prompt := s.embeddingUtils.GenerateMatchingPrompt(project.Summary, candidates, rules)

	// 4. Get AI scoring
	scoresJSON, err := s.embeddingService.GenerateMatchingScores(ctx, prompt)
	if err != nil {
		return nil, fmt.Errorf("failed to generate AI scores: %w", err)
	}

	// 5. Parse AI response
	var candidateScores []models.CandidateScore
	if err := json.Unmarshal([]byte(scoresJSON), &candidateScores); err != nil {
		return nil, fmt.Errorf("failed to parse AI scores: %w", err)
	}

	// 6. Combine scores with candidate profiles
	var suggestions []*models.MatchSuggestion
	candidateMap := make(map[int]*domain.SimilarityMatch)
	
	// Create map for quick lookup
	for _, candidate := range candidates {
		candidateMap[int(candidate.Profile.UserID)] = candidate
	}

	// Build suggestions with profile data
	for _, score := range candidateScores {
		if candidate, exists := candidateMap[score.CandidateID]; exists {
			// Convert entity to model
			profileModel := &models.EmployeeProfileModel{}
			profileModel.FromEntity(candidate.Profile)

			suggestion := &models.MatchSuggestion{
				CandidateScore: score,
				Profile:        profileModel,
			}
			suggestions = append(suggestions, suggestion)
		}
	}

	return suggestions, nil
}

// GetMatchExplanation gets AI explanation for a specific match
func (s *MatchService) GetMatchExplanation(ctx context.Context, projectID string, employeeID string) error {
	// TODO: Implement AI explanation generation
	// TODO: Analyze why employee matches project
	// TODO: Return detailed reasoning
	return nil
}

// GetProactiveInsights generates proactive insights and alerts
func (s *MatchService) GetProactiveInsights(ctx context.Context) error {
	// TODO: Implement proactive insights
	// TODO: Identify employees rolling off soon
	// TODO: Flag projects with unallocated seats
	// TODO: Suggest reallocation of under-utilized employees
	return nil
}
