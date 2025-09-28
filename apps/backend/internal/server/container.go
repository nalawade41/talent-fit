package server

import (
	"fmt"

	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/database"
	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/handlers"
	"github.com/talent-fit/backend/internal/services"
	n "github.com/talent-fit/backend/internal/services/notifiers"
)

// Container holds all application dependencies
type Container struct {
	// Database
	DB *database.Database

	// Handlers
	UserHandler              *handlers.UserHandler
	ProjectHandler           *handlers.ProjectHandler
	ProjectAllocationHandler *handlers.ProjectAllocationHandler
	MatchHandler             *handlers.MatchHandler
	NotificationHandler      *handlers.NotificationHandler
	EmployeeProfileHandler   *handlers.EmployeeProfileHandler
	TokenHandler             *handlers.TokenHandler
	GoogleAuthHandler        *handlers.GoogleAuthHandler
    DevHandler               *handlers.DevHandler
    Orchestrator             *services.Orchestrator
    DashboardHandler         *handlers.DashboardHandler
}

// NewContainer creates and initializes all application dependencies
func NewContainer(cfg *config.Config) (*Container, error) {
	// Initialize database connection
	db, err := database.NewDatabase(cfg)
	if err != nil {
		return nil, fmt.Errorf("failed to initialize database: %w", err)
	}

	// Run database migrations
	//if err := db.AutoMigrate(); err != nil {
	//	return nil, fmt.Errorf("failed to run database migrations: %w", err)
	//}

	// Initialize repositories
	userRepo := database.NewUserRepository(db.DB)
	projectRepo := database.NewProjectRepository(db.DB)
	allocationRepo := database.NewProjectAllocationRepository(db.DB)
	notificationRepo := database.NewNotificationRepository(db.DB)
	profileRepo := database.NewEmployeeProfileRepository(db.DB)

    // Initialize services
    embeddingService := services.NewOpenAIEmbeddingService(cfg)
    userService := services.NewUserService(userRepo)

    // Notifiers and orchestrator (must be created before services that depend on it)
    inAppNotifier := n.NewInAppNotifier(db.DB)
    slackNotifier := n.NewSlackNotifier(cfg)
    orchestrator := services.NewOrchestrator(inAppNotifier, slackNotifier)

    projectService := services.NewProjectService(projectRepo, embeddingService, allocationRepo, orchestrator)
    allocationService := services.NewProjectAllocationService(allocationRepo, profileRepo, orchestrator)
    matchService := services.NewMatchService(userRepo, projectRepo, allocationRepo, profileRepo, embeddingService)
    notificationService := services.NewNotificationService(notificationRepo)
    profileService := services.NewEmployeeProfileService(profileRepo, embeddingService, orchestrator, userRepo)
    googleAuthService := services.NewGoogleAuthService(userRepo, cfg)
    // Dashboard service depends on repos directly to compute metrics
    var _ domain.DashboardService
    dashboardService := services.NewDashboardService(projectRepo, allocationRepo, profileRepo)

	// Initialize handlers
    userHandler := handlers.NewUserHandler(userService)
	projectHandler := handlers.NewProjectHandler(projectService)
    allocationHandler := handlers.NewProjectAllocationHandler(allocationService)
	matchHandler := handlers.NewMatchHandler(matchService)
	notificationHandler := handlers.NewNotificationHandler(notificationService)
    profileHandler := handlers.NewEmployeeProfileHandler(profileService)
	tokenHandler := handlers.NewTokenHandler(googleAuthService)
    googleAuthHandler := handlers.NewGoogleAuthHandler(googleAuthService)
    devHandler := handlers.NewDevHandler(orchestrator, cfg)
    dashboardHandler := handlers.NewDashboardHandler(dashboardService)

	return &Container{
		DB:                       db,
		UserHandler:              userHandler,
		ProjectHandler:           projectHandler,
		ProjectAllocationHandler: allocationHandler,
		MatchHandler:             matchHandler,
		NotificationHandler:      notificationHandler,
		EmployeeProfileHandler:   profileHandler,
		TokenHandler:             tokenHandler,
        GoogleAuthHandler:        googleAuthHandler,
        DevHandler:               devHandler,
        DashboardHandler:         dashboardHandler,
	}, nil
}

// Close closes all resources in the container
func (c *Container) Close() error {
	if c.DB != nil {
		return c.DB.Close()
	}
	return nil
}
