package server

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/pkg/middleware"
)

// setupRoutes configures all application routes
func (s *Server) setupRoutes() {
	// Health check endpoint (open)
	s.router.GET("/health", s.healthCheck)

	// Open routes (no authentication required)
	s.setupAuthRoutes()

	// Protected API routes (require authentication)
	s.setupProtectedRoutes()
}

// healthCheck handles the health check endpoint
func (s *Server) healthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{
		"status":    "healthy",
		"timestamp": time.Now().UTC(),
		"version":   "1.0.0",
	})
}

// setupAuthRoutes sets up authentication routes (no middleware)
func (s *Server) setupAuthRoutes() {
	auth := s.router.Group("/auth")
	{
		auth.POST("/generate-token", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Generate token endpoint",
				"token":   "dummy-jwt-token",
			})
		})
	}
}

// setupProtectedRoutes sets up all protected API routes
func (s *Server) setupProtectedRoutes() {
	api := s.router.Group("/api/v1")
	api.Use(middleware.AuthMiddleware()) // Apply auth middleware to all API routes

	// User routes
	s.setupUserRoutes(api)

	// Employee profile routes
	s.setupProfileRoutes(api)

	// Project routes
	s.setupProjectRoutes(api)

	// Project allocation routes
	s.setupAllocationRoutes(api)

	// AI matching routes
	s.setupMatchRoutes(api)

	// Notification routes
	s.setupNotificationRoutes(api)
}

// setupUserRoutes sets up user management routes
func (s *Server) setupUserRoutes(api *gin.RouterGroup) {
	users := api.Group("/users")
	{
		users.GET("", s.container.UserHandler.GetAllUsers)
		users.POST("", s.container.UserHandler.CreateUser)
		users.GET("/:id", s.container.UserHandler.GetUserByID)
		users.PUT("/:id", s.container.UserHandler.UpdateUser)
		users.DELETE("/:id", s.container.UserHandler.DeleteUser)
	}
}

// setupProfileRoutes sets up employee profile routes
func (s *Server) setupProfileRoutes(api *gin.RouterGroup) {
	profiles := api.Group("/profiles")
	{
		profiles.GET("/:userId", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get employee profile: " + c.Param("userId")})
		})
		profiles.PUT("/:userId", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Update employee profile: " + c.Param("userId")})
		})
	}
}

// setupProjectRoutes sets up project management routes
func (s *Server) setupProjectRoutes(api *gin.RouterGroup) {
	projects := api.Group("/projects")
	{
		// TODO: Replace with actual handlers when ProjectHandler is added to container
		// projects.GET("", s.container.ProjectHandler.GetAllProjects)
		// projects.POST("", s.container.ProjectHandler.CreateProject)
		// projects.GET("/:id", s.container.ProjectHandler.GetProjectByID)
		// projects.PUT("/:id", s.container.ProjectHandler.UpdateProject)
		// projects.DELETE("/:id", s.container.ProjectHandler.DeleteProject)

		// Temporary anonymous handlers
		projects.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get all projects"})
		})
		projects.POST("", func(c *gin.Context) {
			c.JSON(http.StatusCreated, gin.H{"message": "Create new project"})
		})
		projects.GET("/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get project by ID: " + c.Param("id")})
		})
		projects.PUT("/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Update project: " + c.Param("id")})
		})
		projects.DELETE("/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Delete project: " + c.Param("id")})
		})
	}
}

// setupAllocationRoutes sets up project allocation routes
func (s *Server) setupAllocationRoutes(api *gin.RouterGroup) {
	allocations := api.Group("/allocations")
	{
		allocations.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get all allocations"})
		})
		allocations.POST("", func(c *gin.Context) {
			c.JSON(http.StatusCreated, gin.H{"message": "Create new allocation"})
		})
		allocations.DELETE("/:id", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Release allocation: " + c.Param("id")})
		})
	}
}

// setupMatchRoutes sets up AI matching routes
func (s *Server) setupMatchRoutes(api *gin.RouterGroup) {
	matches := api.Group("/matches")
	{
		matches.POST("/generate", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Generate AI matches for project"})
		})
	}
}

// setupNotificationRoutes sets up notification routes
func (s *Server) setupNotificationRoutes(api *gin.RouterGroup) {
	notifications := api.Group("/notifications")
	{
		notifications.GET("", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Get user notifications"})
		})
		notifications.PUT("/:id/read", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{"message": "Mark notification as read: " + c.Param("id")})
		})
	}
}
