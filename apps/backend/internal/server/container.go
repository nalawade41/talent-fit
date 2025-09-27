package server

import (
	"fmt"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/database"
	"github.com/talent-fit/backend/internal/handlers"
	"github.com/talent-fit/backend/internal/services"
)

// Container holds all application dependencies
type Container struct {
	// Database
	DB *database.Database

	// Handlers
	UserHandler *handlers.UserHandler
	// TODO: Add other handlers as needed
	// ProjectHandler *handlers.ProjectHandler
	// AllocationHandler *handlers.AllocationHandler
	// MatchHandler *handlers.MatchHandler
	// NotificationHandler *handlers.NotificationHandler
}

// NewContainer creates and initializes all application dependencies
func NewContainer(cfg *config.Config) (*Container, error) {
	// Initialize database connection
	db, err := database.NewDatabase(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	// Run database migrations
	if err := db.AutoMigrate(); err != nil {
		return nil, fmt.Errorf("failed to run database migrations: %w", err)
	}

	// Initialize repositories
	userRepo := database.NewUserRepository(db.DB)
	// TODO: Add other repositories as needed
	// projectRepo := database.NewProjectRepository(db.DB)
	// allocationRepo := database.NewAllocationRepository(db.DB)
	// notificationRepo := database.NewNotificationRepository(db.DB)

	// Initialize services
	userService := services.NewUserService(userRepo)
	// TODO: Add other services as needed
	// projectService := services.NewProjectService(projectRepo)
	// allocationService := services.NewAllocationService(allocationRepo)
	// matchService := services.NewMatchService(userRepo, projectRepo, allocationRepo)
	// notificationService := services.NewNotificationService(notificationRepo)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService)
	// TODO: Add other handlers as needed
	// projectHandler := handlers.NewProjectHandler(projectService)
	// allocationHandler := handlers.NewAllocationHandler(allocationService)
	// matchHandler := handlers.NewMatchHandler(matchService)
	// notificationHandler := handlers.NewNotificationHandler(notificationService)

	return &Container{
		DB:          db,
		UserHandler: userHandler,
		// TODO: Add other handlers as needed
		// ProjectHandler: projectHandler,
		// AllocationHandler: allocationHandler,
		// MatchHandler: matchHandler,
		// NotificationHandler: notificationHandler,
	}, nil
}

// Close closes all resources in the container
func (c *Container) Close() error {
	if c.DB != nil {
		return c.DB.Close()
	}
	return nil
}
