package domain

import "context"

// EmbeddingService defines the interface for generating text embeddings
type EmbeddingService interface {
	// GenerateEmbedding generates an embedding vector for the given text
	GenerateEmbedding(ctx context.Context, text string) ([]float32, error)
	
	// GenerateBatchEmbeddings generates embeddings for multiple texts
	GenerateBatchEmbeddings(ctx context.Context, texts []string) ([][]float32, error)
	
	// SummarizeProject generates a structured summary of project requirements
	SummarizeProject(ctx context.Context, description string, seats map[string]int) (string, error)
}
