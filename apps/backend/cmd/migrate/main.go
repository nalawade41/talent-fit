package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/database"
)

func main() {
	var (
		action  = flag.String("action", "up", "Migration action: up, down, status")
		version = flag.String("version", "", "Migration version (for rollback)")
	)
	flag.Parse()

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Initialize database connection
	db, err := database.NewDatabase(cfg)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Create migration runner
	runner := database.NewMigrationRunner(db.DB, "migrations")

	// Execute action
	switch *action {
	case "up":
		fmt.Println("Running migrations...")
		if err := runner.RunMigrations(); err != nil {
			log.Fatalf("Migration failed: %v", err)
		}
		fmt.Println("Migrations completed successfully!")

	case "down":
		if *version == "" {
			log.Fatal("Version is required for rollback")
		}
		fmt.Printf("Rolling back migration: %s\n", *version)
		if err := runner.RollbackMigration(*version); err != nil {
			log.Fatalf("Rollback failed: %v", err)
		}
		fmt.Println("Rollback completed!")

	case "status":
		fmt.Println("Checking migration status...")
		executed, err := runner.GetExecutedMigrations()
		if err != nil {
			log.Fatalf("Failed to get migration status: %v", err)
		}

		if len(executed) == 0 {
			fmt.Println("No migrations have been executed.")
		} else {
			fmt.Println("Executed migrations:")
			for _, migration := range executed {
				fmt.Printf("  ✓ %s\n", migration)
			}
		}

	default:
		fmt.Printf("Unknown action: %s\n", *action)
		fmt.Println("Available actions: up, down, status")
		os.Exit(1)
	}
}
