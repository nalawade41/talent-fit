package utils

import (
	"context"
	"fmt"
	"strings"

	"github.com/talent-fit/backend/internal/domain"
)

// EmbeddingUtils provides utility functions for working with embeddings
type EmbeddingUtils struct {
	embeddingService domain.EmbeddingService
}

// NewEmbeddingUtils creates a new embedding utilities instance
func NewEmbeddingUtils(embeddingService domain.EmbeddingService) *EmbeddingUtils {
	return &EmbeddingUtils{
		embeddingService: embeddingService,
	}
}

// GenerateTextEmbedding generates an embedding for a single text string
func (u *EmbeddingUtils) GenerateTextEmbedding(ctx context.Context, text string) ([]float32, error) {
	// Clean and prepare text
	cleanText := u.cleanText(text)
	if cleanText == "" {
		return nil, fmt.Errorf("text is empty after cleaning")
	}

	return u.embeddingService.GenerateEmbedding(ctx, cleanText)
}

// GenerateProfileEmbedding generates an embedding for an employee profile
func (u *EmbeddingUtils) GenerateProfileEmbedding(ctx context.Context, profileData map[string]interface{}) ([]float32, error) {
	// Combine profile data into a meaningful text representation
	var textParts []string

	// Add skills
	if skills, ok := profileData["skills"].([]string); ok && len(skills) > 0 {
		textParts = append(textParts, "Skills: "+strings.Join(skills, ", "))
	}

	// Add type/role
	if profileType, ok := profileData["type"].(string); ok && profileType != "" {
		textParts = append(textParts, "Role: "+profileType)
	}

	// Add industry
	if industry, ok := profileData["industry"].(string); ok && industry != "" {
		textParts = append(textParts, "Industry: "+industry)
	}

	// Add geo location
	if geo, ok := profileData["geo"].(string); ok && geo != "" {
		textParts = append(textParts, "Location: "+geo)
	}

	// Add years of experience
	if experience, ok := profileData["years_of_experience"].(int); ok && experience > 0 {
		textParts = append(textParts, fmt.Sprintf("Experience: %d years", experience))
	}

	if len(textParts) == 0 {
		return nil, fmt.Errorf("no valid profile data to generate embedding")
	}

	combinedText := strings.Join(textParts, ". ")
	return u.GenerateTextEmbedding(ctx, combinedText)
}

// GenerateProjectEmbedding generates an embedding for a project
func (u *EmbeddingUtils) GenerateProjectEmbedding(ctx context.Context, projectData map[string]interface{}) ([]float32, error) {
	var textParts []string

	// Add project name
	if name, ok := projectData["name"].(string); ok && name != "" {
		textParts = append(textParts, "Project: "+name)
	}

	// Add description
	if description, ok := projectData["description"].(string); ok && description != "" {
		textParts = append(textParts, "Description: "+description)
	}

	// Add required seats by type
	if seatsByType, ok := projectData["seats_by_type"].(map[string]interface{}); ok && len(seatsByType) > 0 {
		var requirements []string
		for roleType, count := range seatsByType {
			if countInt, ok := count.(int); ok && countInt > 0 {
				requirements = append(requirements, fmt.Sprintf("%s: %d", roleType, countInt))
			}
		}
		if len(requirements) > 0 {
			textParts = append(textParts, "Requirements: "+strings.Join(requirements, ", "))
		}
	}

	// Add summary (prioritize summary over individual parts if available)
	if summary, ok := projectData["summary"].(string); ok && summary != "" {
		textParts = []string{"Project Requirements: " + summary}
	}

	if len(textParts) == 0 {
		return nil, fmt.Errorf("no valid project data to generate embedding")
	}

	combinedText := strings.Join(textParts, ". ")
	return u.GenerateTextEmbedding(ctx, combinedText)
}

// GenerateBatchEmbeddings generates embeddings for multiple texts
func (u *EmbeddingUtils) GenerateBatchEmbeddings(ctx context.Context, texts []string) ([][]float32, error) {
	// Clean all texts
	var cleanTexts []string
	for _, text := range texts {
		cleanText := u.cleanText(text)
		if cleanText != "" {
			cleanTexts = append(cleanTexts, cleanText)
		}
	}

	if len(cleanTexts) == 0 {
		return nil, fmt.Errorf("no valid texts after cleaning")
	}

	return u.embeddingService.GenerateBatchEmbeddings(ctx, cleanTexts)
}

// cleanText cleans and normalizes text for embedding generation
func (u *EmbeddingUtils) cleanText(text string) string {
	// Remove extra whitespace and normalize
	text = strings.TrimSpace(text)
	text = strings.ReplaceAll(text, "\n", " ")
	text = strings.ReplaceAll(text, "\t", " ")
	
	// Remove multiple spaces
	for strings.Contains(text, "  ") {
		text = strings.ReplaceAll(text, "  ", " ")
	}

	return text
}

// VectorToString converts a float32 vector to a string representation for database storage
func VectorToString(vector []float32) string {
	if len(vector) == 0 {
		return "[]"
	}

	var parts []string
	for _, v := range vector {
		parts = append(parts, fmt.Sprintf("%.6f", v))
	}
	return "[" + strings.Join(parts, ",") + "]"
}

// StringToVector converts a string representation back to a float32 vector
func StringToVector(vectorStr string) ([]float32, error) {
	// Remove brackets
	vectorStr = strings.Trim(vectorStr, "[]")
	if vectorStr == "" {
		return []float32{}, nil
	}

	// Split by comma
	parts := strings.Split(vectorStr, ",")
	vector := make([]float32, len(parts))

	for i, part := range parts {
		var val float32
		if _, err := fmt.Sscanf(strings.TrimSpace(part), "%f", &val); err != nil {
			return nil, fmt.Errorf("failed to parse vector component %d: %w", i, err)
		}
		vector[i] = val
	}

	return vector, nil
}

// ScoringRules defines the weights for different matching criteria
type ScoringRules struct {
	SkillsWeight     int `json:"skills_weight"`
	GeoWeight        int `json:"geo_weight"`
	ExperienceWeight int `json:"experience_weight"`
	StatusWeight int `json:"status_weight"`
}

// DefaultScoringRules returns the default scoring weights
func DefaultScoringRules() ScoringRules {
	return ScoringRules{
		SkillsWeight:     30,
		GeoWeight:        30,
		ExperienceWeight: 20,
		StatusWeight: 	20,
	}
}

// GenerateMatchingPrompt creates an AI prompt for scoring candidates against project requirements
func (u *EmbeddingUtils) GenerateMatchingPrompt(projectSummary string, candidates []*domain.SimilarityMatch, rules ScoringRules) string {
	prompt := `You are an expert recruiter AI helping to match employees to projects.

	Project requirements:
	` + projectSummary + `

	Candidates:`

	// Add each candidate to the prompt
	for i, match := range candidates {
		candidateNum := i + 1
		profile := match.Profile
		
		// Format skills as comma-separated string
		skillsStr := "None specified"
		if len(profile.Skills) > 0 {
			skillsStr = strings.Join(profile.Skills, ", ")
		}
		
		// Get user info if available
		name := "Unknown"
		if profile.User.FirstName != "" || profile.User.LastName != "" {
			name = strings.TrimSpace(profile.User.FirstName + " " + profile.User.LastName)
		}
		
		// Format experience
		experience := fmt.Sprintf("%d years", profile.YearsOfExperience)
		
		// Format availability
		availability := "false"
		if profile.AvailabilityFlag {
			availability = "true"
		}
		
		prompt += fmt.Sprintf(`
				%d. Candidate: %s (ID: %d)
				Skills: %s
				Geo: %s
				Experience: %s
				Industry: %s
				Availability: %s
				Status: %s
				Similarity Score: %.1f%%`,
							candidateNum,
							name,
							profile.UserID,
							skillsStr,
							profile.Geo,
							experience,
							profile.Industry,
							availability,
							match.Status,
							match.Similarity*100)
					}
					prompt += fmt.Sprintf(`
				Scoring rules:
				- Skills match = %d%%
				- Geo match = %d%%
				- Experience match = %d%%
				- Status match = %d%%
				- Candidates outside required geo can still be scored, but lower.
				- SPECIAL RULE: If project location/geo is "Unspecified" or not mentioned, prefer candidates from India for same skill levels.
				- SPECIAL RULE: If canidate status is OnBench, give prefrence to candidates even if skills match is less.

				Instructions:
				1. Score each candidate from 0–100.
				2. Provide a short explanation in human language (2–3 sentences) why the candidate got this score. If candidate is on bench explicitly mention that in reason.
				3. For unspecified project geo: Give slight preference (5-10 points bonus) to India-based candidates when skills are comparable.
				4. If canidate status is OnBench, give prefrence to candidates even if skills match is less for OnBench add (5-10 points bonus).
				5. Return results as JSON:

				[
				{ "candidate_id": <id>, "score": <int>, "reason": "<string>" }
				]`, 
						rules.SkillsWeight, 
						rules.GeoWeight, 
						rules.ExperienceWeight,
						rules.StatusWeight)
					return prompt
}
