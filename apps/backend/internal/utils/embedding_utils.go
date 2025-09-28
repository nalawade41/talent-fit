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
