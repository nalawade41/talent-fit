package utils

import (
	"context"
	"fmt"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
)

// EmbeddingEntityUtils provides utility functions for working with embeddings in entities
type EmbeddingEntityUtils struct {
	embeddingService domain.EmbeddingService
}

// NewEmbeddingEntityUtils creates a new embedding entity utilities instance
func NewEmbeddingEntityUtils(embeddingService domain.EmbeddingService) *EmbeddingEntityUtils {
	return &EmbeddingEntityUtils{
		embeddingService: embeddingService,
	}
}

// GenerateEmployeeProfileEmbedding generates and sets embedding for an employee profile
func (u *EmbeddingEntityUtils) GenerateEmployeeProfileEmbedding(ctx context.Context, profile *entities.EmployeeProfile) error {
	if profile == nil {
		return fmt.Errorf("profile cannot be nil")
	}

	// Create profile data map
	profileData := map[string]interface{}{
		"skills":              profile.Skills,
		"type":                profile.Type,
		"industry":            profile.Industry,
		"geo":                 profile.Geo,
		"years_of_experience": profile.YearsOfExperience,
	}

	// Generate embedding using the utility
	embeddingUtils := NewEmbeddingUtils(u.embeddingService)
	embedding, err := embeddingUtils.GenerateProfileEmbedding(ctx, profileData)
	if err != nil {
		return fmt.Errorf("failed to generate profile embedding: %w", err)
	}

	// Set the embedding in the entity
	profile.Embedding = embedding
	return nil
}

// GenerateProjectEmbedding generates and sets embedding for a project
func (u *EmbeddingEntityUtils) GenerateProjectEmbedding(ctx context.Context, project *entities.Project) error {
	if project == nil {
		return fmt.Errorf("project cannot be nil")
	}

	// Create project data map
	// Convert SeatsByType (map[string]int) to map[string]interface{}
	seatsByType := make(map[string]interface{})
	for k, v := range project.SeatsByType {
		seatsByType[k] = v
	}
	
	projectData := map[string]interface{}{
		"name":          project.Name,
		"description":   project.Description,
		"seats_by_type": seatsByType,
	}

	// Generate embedding using the utility
	embeddingUtils := NewEmbeddingUtils(u.embeddingService)
	embedding, err := embeddingUtils.GenerateProjectEmbedding(ctx, projectData)
	if err != nil {
		return fmt.Errorf("failed to generate project embedding: %w", err)
	}

	// Set the embedding in the entity
	project.Embedding = embedding
	return nil
}

// UpdateEmployeeProfileEmbedding updates the embedding for an employee profile if needed
func (u *EmbeddingEntityUtils) UpdateEmployeeProfileEmbedding(ctx context.Context, profile *entities.EmployeeProfile, forceUpdate bool) error {
	// Only generate if embedding is empty or force update is requested
	if !forceUpdate && len(profile.Embedding) > 0 {
		return nil // Embedding already exists
	}

	return u.GenerateEmployeeProfileEmbedding(ctx, profile)
}

// UpdateProjectEmbedding updates the embedding for a project if needed
func (u *EmbeddingEntityUtils) UpdateProjectEmbedding(ctx context.Context, project *entities.Project, forceUpdate bool) error {
	// Only generate if embedding is empty or force update is requested
	if !forceUpdate && len(project.Embedding) > 0 {
		return nil // Embedding already exists
	}

	return u.GenerateProjectEmbedding(ctx, project)
}

// BatchGenerateEmployeeProfileEmbeddings generates embeddings for multiple employee profiles
func (u *EmbeddingEntityUtils) BatchGenerateEmployeeProfileEmbeddings(ctx context.Context, profiles []*entities.EmployeeProfile) error {
	if len(profiles) == 0 {
		return nil
	}

	// Prepare texts for batch processing
	var texts []string
	var validProfiles []*entities.EmployeeProfile

	for _, profile := range profiles {
		if profile == nil {
			continue
		}

		// Create profile text
		profileData := map[string]interface{}{
			"skills":              profile.Skills,
			"type":                profile.Type,
			"industry":            profile.Industry,
			"geo":                 profile.Geo,
			"years_of_experience": profile.YearsOfExperience,
		}

		// Build text representation
		var textParts []string
		if skills, ok := profileData["skills"].(entities.Skills); ok && len(skills) > 0 {
			textParts = append(textParts, "Skills: "+fmt.Sprintf("%v", []string(skills)))
		}
		if profileType, ok := profileData["type"].(string); ok && profileType != "" {
			textParts = append(textParts, "Role: "+profileType)
		}
		if industry, ok := profileData["industry"].(string); ok && industry != "" {
			textParts = append(textParts, "Industry: "+industry)
		}
		if geo, ok := profileData["geo"].(string); ok && geo != "" {
			textParts = append(textParts, "Location: "+geo)
		}
		if experience, ok := profileData["years_of_experience"].(int); ok && experience > 0 {
			textParts = append(textParts, fmt.Sprintf("Experience: %d years", experience))
		}

		if len(textParts) > 0 {
			combinedText := fmt.Sprintf("%s", textParts)
			texts = append(texts, combinedText)
			validProfiles = append(validProfiles, profile)
		}
	}

	if len(texts) == 0 {
		return fmt.Errorf("no valid profiles to generate embeddings for")
	}

	// Generate batch embeddings
	embeddings, err := u.embeddingService.GenerateBatchEmbeddings(ctx, texts)
	if err != nil {
		return fmt.Errorf("failed to generate batch embeddings: %w", err)
	}

	// Assign embeddings to profiles
	for i, embedding := range embeddings {
		if i < len(validProfiles) {
			validProfiles[i].Embedding = embedding
		}
	}

	return nil
}

// BatchGenerateProjectEmbeddings generates embeddings for multiple projects
func (u *EmbeddingEntityUtils) BatchGenerateProjectEmbeddings(ctx context.Context, projects []*entities.Project) error {
	if len(projects) == 0 {
		return nil
	}

	// Prepare texts for batch processing
	var texts []string
	var validProjects []*entities.Project

	for _, project := range projects {
		if project == nil {
			continue
		}

		// Build text representation
		var textParts []string
		if project.Name != "" {
			textParts = append(textParts, "Project: "+project.Name)
		}
		if project.Description != "" {
			textParts = append(textParts, "Description: "+project.Description)
		}
		if len(project.SeatsByType) > 0 {
			var requirements []string
			for roleType, count := range project.SeatsByType {
				if count > 0 {
					requirements = append(requirements, fmt.Sprintf("%s: %d", roleType, count))
				}
			}
			if len(requirements) > 0 {
				textParts = append(textParts, "Requirements: "+fmt.Sprintf("%v", requirements))
			}
		}

		if len(textParts) > 0 {
			combinedText := fmt.Sprintf("%s", textParts)
			texts = append(texts, combinedText)
			validProjects = append(validProjects, project)
		}
	}

	if len(texts) == 0 {
		return fmt.Errorf("no valid projects to generate embeddings for")
	}

	// Generate batch embeddings
	embeddings, err := u.embeddingService.GenerateBatchEmbeddings(ctx, texts)
	if err != nil {
		return fmt.Errorf("failed to generate batch embeddings: %w", err)
	}

	// Assign embeddings to projects
	for i, embedding := range embeddings {
		if i < len(validProjects) {
			validProjects[i].Embedding = embedding
		}
	}

	return nil
}
