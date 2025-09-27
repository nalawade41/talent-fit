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
  UserHandler              *handlers.UserHandler
  ProjectHandler           *handlers.ProjectHandler
  ProjectAllocationHandler *handlers.ProjectAllocationHandler
  MatchHandler             *handlers.MatchHandler
  NotificationHandler      *handlers.NotificationHandler
  EmployeeProfileHandler   *handlers.EmployeeProfileHandler
  TokenHandler             *handlers.TokenHandler
  GoogleAuthHandler        *handlers.GoogleAuthHandler
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
  userService := services.NewUserService(userRepo)
  projectService := services.NewProjectService(projectRepo)
  allocationService := services.NewProjectAllocationService(allocationRepo)
  matchService := services.NewMatchService(userRepo, projectRepo, allocationRepo, profileRepo)
  notificationService := services.NewNotificationService(notificationRepo)
  profileService := services.NewEmployeeProfileService(profileRepo)
  googleAuthService := services.NewGoogleAuthService(userRepo, cfg)

  // Initialize handlers
  userHandler := handlers.NewUserHandler(userService)
  projectHandler := handlers.NewProjectHandler(projectService)
  allocationHandler := handlers.NewProjectAllocationHandler(allocationService)
  matchHandler := handlers.NewMatchHandler(matchService)
  notificationHandler := handlers.NewNotificationHandler(notificationService)
  profileHandler := handlers.NewEmployeeProfileHandler(profileService)
  tokenHandler := handlers.NewTokenHandler(googleAuthService)
  googleAuthHandler := handlers.NewGoogleAuthHandler(googleAuthService)

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
  }, nil
}

// Close closes all resources in the container
func (c *Container) Close() error {
  if c.DB != nil {
    return c.DB.Close()
  }
  return nil
}
