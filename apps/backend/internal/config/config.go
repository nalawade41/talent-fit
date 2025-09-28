package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the application
type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	Auth     AuthConfig
	AI       AIConfig
	Logging  LoggingConfig
}

// ServerConfig holds server configuration
type ServerConfig struct {
	Port        string
	Host        string
	Environment string
}

// DatabaseConfig holds database configuration
type DatabaseConfig struct {
	URL      string
	Host     string
	Port     string
	Name     string
	User     string
	Password string
	SSLMode  string
}

// AuthConfig holds authentication configuration
type AuthConfig struct {
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
	JWTSecret          string
	JWTExpiry          string
}

// AIConfig holds AI service configuration
type AIConfig struct {
	OpenAIAPIKey string
	OpenAIEmbeddingModel string
	AIModel      string
	GrokAPIKey string
	GrokAPIBaseURL string
	GrokModel string
}

// LoggingConfig holds logging configuration
type LoggingConfig struct {
	Level  string
	Format string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists (for local development)
	_ = godotenv.Load()
	

	config := &Config{
		Server: ServerConfig{
			Port:        getEnv("SERVER_PORT", "8080"),
			Host:        getEnv("SERVER_HOST", "localhost"),
			Environment: getEnv("ENV", "development"),
		},
		Database: DatabaseConfig{
			URL:      getEnv("DB_URL", ""),
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			Name:     getEnv("DB_NAME", "talent_matching"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", ""),
			SSLMode:  getEnv("DB_SSL_MODE", "require"),
		},
		Auth: AuthConfig{
			GoogleClientID:     getEnv("GOOGLE_CLIENT_ID", ""),
			GoogleClientSecret: getEnv("GOOGLE_CLIENT_SECRET", ""),
			GoogleRedirectURL:  getEnv("GOOGLE_REDIRECT_URL", ""),
			JWTSecret:          getEnv("JWT_SECRET", ""),
			JWTExpiry:          getEnv("JWT_EXPIRY", "24h"),
		},
		AI: AIConfig{
			OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
			OpenAIEmbeddingModel: getEnv("OPENAI_API_EMBEDDING_MODEL", "text-embedding-3-small"),
			AIModel:      getEnv("AI_MODEL", "gpt-4"),
			GrokAPIKey: getEnv("GROKK_API_KEY", ""),
			GrokAPIBaseURL: getEnv("GROKK_BASE_URL", "https://api.x.ai/v1"),
			GrokModel: getEnv("GROKK_MODEL", "grok-4-fast"),
		},
		Logging: LoggingConfig{
			Level:  getEnv("LOG_LEVEL", "info"),
			Format: getEnv("LOG_FORMAT", "json"),
		},
	}

	// Validate required configuration
	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("configuration validation failed: %w", err)
	}

	return config, nil
}

// Validate validates the configuration
func (c *Config) Validate() error {
	if c.Database.URL == "" && c.Database.Password == "" {
		return fmt.Errorf("database configuration is incomplete: either DB_URL or DB_PASSWORD must be set")
	}

	if c.Auth.JWTSecret == "" {
		return fmt.Errorf("jwt secret is required")
	}

	if c.Auth.GoogleClientID == "" || c.Auth.GoogleClientSecret == "" {
		return fmt.Errorf("google oauth configuration is incomplete")
	}

	return nil
}

// GetDatabaseConnectionString returns the database connection string
func (c *Config) GetDatabaseConnectionString() string {
	if c.Database.URL != "" {
		// For Supabase pooler, ensure proper parameters are set
		return c.Database.URL
	}

	// Build connection string with Supabase pooler-friendly parameters
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s statement_timeout=30s lock_timeout=30s idle_in_transaction_session_timeout=30s",
		c.Database.Host,
		c.Database.Port,
		c.Database.User,
		c.Database.Password,
		c.Database.Name,
		c.Database.SSLMode,
	)
}

// IsProduction returns true if running in production environment
func (c *Config) IsProduction() bool {
	return c.Server.Environment == "production"
}

// IsDevelopment returns true if running in development environment
func (c *Config) IsDevelopment() bool {
	return c.Server.Environment == "development"
}

// getEnv gets an environment variable with a fallback value
func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
