package services

import (
	"context"
	"fmt"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/domain"
)

// OpenAIEmbeddingService implements the domain.EmbeddingService interface using OpenAI Go client
type OpenAIEmbeddingService struct {
	client *openai.Client
	model  string
}

// NewOpenAIEmbeddingService creates a new OpenAI embedding service
func NewOpenAIEmbeddingService(cfg *config.Config) domain.EmbeddingService {
	client := openai.NewClient(
		option.WithAPIKey(cfg.AI.OpenAIAPIKey),
	)

	return &OpenAIEmbeddingService{
		client: &client,
		model:  cfg.AI.OpenAIEmbeddingModel,
	}
}

// GenerateEmbedding generates an embedding vector for the given text
func (s *OpenAIEmbeddingService) GenerateEmbedding(ctx context.Context, text string) ([]float32, error) {
	if text == "" {
		return nil, fmt.Errorf("input text cannot be empty")
	}

	// Create embedding request using the official client
	embedding, err := s.client.Embeddings.New(ctx, openai.EmbeddingNewParams{
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
func (s *OpenAIEmbeddingService) GenerateBatchEmbeddings(ctx context.Context, texts []string) ([][]float32, error) {
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

	// Create embedding request using the official client
	embedding, err := s.client.Embeddings.New(ctx, openai.EmbeddingNewParams{
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
