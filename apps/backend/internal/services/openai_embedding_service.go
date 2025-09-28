// Package services provides AI-powered embedding and text generation services
//
// Multi-Provider Architecture:
// - OpenAI: Used for embedding generation (text-embedding-3-small)
// - Grok (xAI): Used for chat completions and project summarization (grok-4-fast)
//
// Future Extensions:
// - Add Claude, Gemini, or other providers by adding new clients
// - Implement provider selection logic based on task type or configuration
// - Add fallback mechanisms for provider failures
// - Implement cost optimization by routing to cheapest provider per task
package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/domain"
)

// MultiProviderEmbeddingService implements the domain.EmbeddingService interface using multiple AI providers
// Currently supports OpenAI (for embeddings) and Grok (for chat completions)
type MultiProviderEmbeddingService struct {
	openaiClient *openai.Client
	grokClient   *openai.Client
	config       *config.Config
}

// NewOpenAIEmbeddingService creates a new multi-provider embedding service
// TODO: Consider renaming to NewMultiProviderEmbeddingService in future refactor
func NewOpenAIEmbeddingService(cfg *config.Config) domain.EmbeddingService {
	// Initialize OpenAI client
	openaiClient := openai.NewClient(
		option.WithAPIKey(cfg.AI.OpenAIAPIKey),
	)

	// Initialize Grok client (uses OpenAI-compatible API)
	grokClient := openai.NewClient(
		option.WithAPIKey(cfg.AI.GrokAPIKey),
		option.WithBaseURL(cfg.AI.GrokAPIBaseURL),
	)

	return &MultiProviderEmbeddingService{
		openaiClient: &openaiClient,
		grokClient:   &grokClient,
		config:       cfg,
	}
}

// GenerateEmbedding generates an embedding vector for the given text
func (s *MultiProviderEmbeddingService) GenerateEmbedding(ctx context.Context, text string) ([]float32, error) {
	if text == "" {
		return nil, fmt.Errorf("input text cannot be empty")
	}

	// Create embedding request using OpenAI client
	embedding, err := s.openaiClient.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Input: openai.EmbeddingNewParamsInputUnion{
			OfString: openai.String(text),
		},
		Model: openai.EmbeddingModelTextEmbedding3Small,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to generate embedding: %w", err)
	}

	// Validate response
	if len(embedding.Data) == 0 {
		return nil, fmt.Errorf("no embedding data received")
	}

	// Convert []float64 to []float32
	embeddingData := embedding.Data[0].Embedding
	result := make([]float32, len(embeddingData))
	for i, v := range embeddingData {
		result[i] = float32(v)
	}

	return result, nil
}

// GenerateBatchEmbeddings generates embeddings for multiple texts
func (s *MultiProviderEmbeddingService) GenerateBatchEmbeddings(ctx context.Context, texts []string) ([][]float32, error) {
	if len(texts) == 0 {
		return nil, fmt.Errorf("input texts cannot be empty")
	}

	// Filter out empty texts
	var validTexts []string
	for _, text := range texts {
		if text != "" {
			validTexts = append(validTexts, text)
		}
	}

	if len(validTexts) == 0 {
		return nil, fmt.Errorf("no valid texts provided")
	}

	// Create embedding request using OpenAI client
	embedding, err := s.openaiClient.Embeddings.New(ctx, openai.EmbeddingNewParams{
		Input: openai.EmbeddingNewParamsInputUnion{
			OfArrayOfStrings: validTexts,
		},
		Model: openai.EmbeddingModelTextEmbedding3Small,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to generate batch embeddings: %w", err)
	}

	// Validate response
	if len(embedding.Data) != len(validTexts) {
		return nil, fmt.Errorf("received %d embeddings but expected %d", len(embedding.Data), len(validTexts))
	}

	// Convert [][]float64 to [][]float32
	embeddings := make([][]float32, len(embedding.Data))
	for i, data := range embedding.Data {
		result := make([]float32, len(data.Embedding))
		for j, v := range data.Embedding {
			result[j] = float32(v)
		}
		embeddings[i] = result
	}

	return embeddings, nil
}

func (s *MultiProviderEmbeddingService) SummarizeProject(ctx context.Context, description string, seats map[string]int) (string, error) {
	var roles []string
	for role, count := range seats {
		roles = append(roles, fmt.Sprintf("%d %s", count, strings.Title(role)))
	}

	prompt := fmt.Sprintf(`You are given a project description and role requirements.
      1. Extract key skills grouped strictly by the role types provided (Backend, Frontend, AI, Project Manager).
       Do not invent new role categories.
    2. Keep only specific technical or management skills (languages, frameworks, tools, methodologies)
        include cloude infra infer from description if not provided use aws as default. Also think dev ops skills as well.
    3. Exclude generic soft skills like communication, leadership, teamwork, adaptability, fast learner.
    4. For each role, limit to 5–7 skills maximum and remove duplicates across roles.
    5. Identify years of experience, geo, and industry if mentioned.
       - If geo is given as a timezone, map it to the most likely country or region. If adn only if no geo information found default to India
         Examples: "MT timezone" → "United States"; "CET timezone" → "Europe"; "IST" → "India".
       - Infer industry from description, If  is unclear, output "Unspecified".
       - If experience is not mentioned infer by industry standard, if unable to do so then output "Unspecified".
    6. Try to break down skill's required (example .net tech stack => c#, sql server, rest api, .net core etc)
    7. Summarize in the format:
	"Project requires: Skills: <skills>, Experience: <experience>, Location/Geo: <geo>, Industry: <industry>. Roles: <roles>."
	Description: %s
	Roles: %s`, description, strings.Join(roles, ", "))

	resp, err := s.grokClient.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Model: s.config.AI.GrokModel,
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.SystemMessage(`You are an expert technical recruiter and project analyst.
			Your role is to analyze project descriptions and extract structured technical requirements, skills,
			and role specifications for talent matching purposes. Focus on identifying specific technical skills,
			experience levels, normalize geographic info to countries/regions, and project requirements while filtering out generic soft skills.`),
			openai.UserMessage(prompt),
		},
	})
	if err != nil {
		return "", fmt.Errorf("summarization failed: %w", err)
	}

	if len(resp.Choices) == 0 {
		return "", fmt.Errorf("no summary returned")
	}

	return strings.TrimSpace(resp.Choices[0].Message.Content), nil
}

// Helper methods for future extensibility

// GetEmbeddingClient returns the client to use for embedding generation
func (s *MultiProviderEmbeddingService) GetEmbeddingClient() *openai.Client {
	return s.openaiClient
}

// GetChatClient returns the client to use for chat completions (summarization)
func (s *MultiProviderEmbeddingService) GetChatClient() *openai.Client {
	return s.grokClient
}

// GetEmbeddingModel returns the model to use for embeddings
func (s *MultiProviderEmbeddingService) GetEmbeddingModel() string {
	return s.config.AI.OpenAIEmbeddingModel
}

// GetChatModel returns the model to use for chat completions
func (s *MultiProviderEmbeddingService) GetChatModel() string {
	return s.config.AI.GrokModel
}
