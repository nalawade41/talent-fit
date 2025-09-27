package main

import (
	"log"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/server"
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
	srv, err := server.NewServer(cfg)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	// Ensure database connection is closed on exit
	defer func() {
		if err := srv.Close(); err != nil {
			log.Printf("Error closing server: %v", err)
		}
	}()

	if err := srv.Start(); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
