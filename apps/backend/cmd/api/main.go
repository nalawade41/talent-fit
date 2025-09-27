package main

import (
	"log"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/handlers"
)

func main() {
	log.Println("Starting Talent Matching Platform API...")

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("Environment: %s", cfg.Server.Environment)
	log.Printf("Database Host: %s", cfg.Database.Host)

	// Create and start HTTP server
	server := handlers.NewServer(cfg)

	if err := server.Start(); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
