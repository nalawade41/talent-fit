package services

import (
	"context"
	"testing"

	"github.com/talent-fit/backend/internal/config"
)

func TestOpenAIEmbeddingService_GenerateEmbedding(t *testing.T) {
	// Skip test if no API key is provided
	cfg := &config.Config{
		AI: config.AIConfig{
			OpenAIAPIKey:         "test-key", // Use a test key or skip if not available
			OpenAIEmbeddingModel: "text-embedding-3-small",
		},
	}

	service := NewOpenAIEmbeddingService(cfg)
	ctx := context.Background()

	tests := []struct {
		name    string
		text    string
		wantErr bool
	}{
		{
			name:    "valid text",
			text:    "This is a test text for embedding generation",
			wantErr: false,
		},
		{
			name:    "empty text",
			text:    "",
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			embedding, err := service.GenerateEmbedding(ctx, tt.text)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("GenerateEmbedding() expected error but got none")
				}
				return
			}

			if err != nil {
				// Skip test if API key is not configured properly
				if err.Error() == "OpenAI API key is not configured" {
					t.Skip("Skipping test: OpenAI API key not configured")
				}
				t.Errorf("GenerateEmbedding() error = %v", err)
				return
			}

			if len(embedding) == 0 {
				t.Errorf("GenerateEmbedding() returned empty embedding")
			}

			// text-embedding-3-small should return 1536 dimensions
			expectedDimensions := 1536
			if len(embedding) != expectedDimensions {
				t.Errorf("GenerateEmbedding() returned %d dimensions, expected %d", len(embedding), expectedDimensions)
			}
		})
	}
}

func TestOpenAIEmbeddingService_GenerateBatchEmbeddings(t *testing.T) {
	cfg := &config.Config{
		AI: config.AIConfig{
			OpenAIAPIKey:         "test-key",
			OpenAIEmbeddingModel: "text-embedding-3-small",
		},
	}

	service := NewOpenAIEmbeddingService(cfg)
	ctx := context.Background()

	tests := []struct {
		name    string
		texts   []string
		wantErr bool
	}{
		{
			name:    "valid texts",
			texts:   []string{"First text", "Second text", "Third text"},
			wantErr: false,
		},
		{
			name:    "empty slice",
			texts:   []string{},
			wantErr: true,
		},
		{
			name:    "texts with empty strings",
			texts:   []string{"Valid text", "", "Another valid text"},
			wantErr: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			embeddings, err := service.GenerateBatchEmbeddings(ctx, tt.texts)
			
			if tt.wantErr {
				if err == nil {
					t.Errorf("GenerateBatchEmbeddings() expected error but got none")
				}
				return
			}

			if err != nil {
				// Skip test if API key is not configured properly
				if err.Error() == "OpenAI API key is not configured" {
					t.Skip("Skipping test: OpenAI API key not configured")
				}
				t.Errorf("GenerateBatchEmbeddings() error = %v", err)
				return
			}

			// Count non-empty texts
			validTexts := 0
			for _, text := range tt.texts {
				if text != "" {
					validTexts++
				}
			}

			if len(embeddings) != validTexts {
				t.Errorf("GenerateBatchEmbeddings() returned %d embeddings, expected %d", len(embeddings), validTexts)
			}

			for i, embedding := range embeddings {
				if len(embedding) == 0 {
					t.Errorf("GenerateBatchEmbeddings() embedding %d is empty", i)
				}
			}
		})
	}
}
