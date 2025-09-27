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
		auth.POST("/generate-token", s.container.TokenHandler.GenerateToken)
		auth.POST("/validate-token", s.container.TokenHandler.ValidateToken)
		auth.POST("/refresh-token", s.container.TokenHandler.RefreshToken)
		auth.POST("/revoke-token", s.container.TokenHandler.RevokeToken)
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
		profiles.GET("", s.container.EmployeeProfileHandler.GetAllProfiles)
		profiles.GET("/:id", s.container.EmployeeProfileHandler.GetProfileByID)
		profiles.GET("/user/:userId", s.container.EmployeeProfileHandler.GetProfileByUserID)
		profiles.POST("", s.container.EmployeeProfileHandler.CreateProfile)
		profiles.PUT("/user/:userId", s.container.EmployeeProfileHandler.UpdateProfile)
		profiles.DELETE("/user/:userId", s.container.EmployeeProfileHandler.DeleteProfile)
		profiles.GET("/available", s.container.EmployeeProfileHandler.GetAvailableEmployees)
		profiles.GET("/search/skills", s.container.EmployeeProfileHandler.SearchBySkills)
		profiles.GET("/search/geo", s.container.EmployeeProfileHandler.SearchByGeo)
		profiles.PUT("/user/:userId/availability", s.container.EmployeeProfileHandler.UpdateAvailabilityFlag)
	}
}

// setupProjectRoutes sets up project management routes
func (s *Server) setupProjectRoutes(api *gin.RouterGroup) {
	projects := api.Group("/projects")
	{
		projects.GET("", s.container.ProjectHandler.GetAllProjects)
		projects.POST("", s.container.ProjectHandler.CreateProject)
		projects.GET("/:id", s.container.ProjectHandler.GetProjectByID)
		projects.PUT("/:id", s.container.ProjectHandler.UpdateProject)
		projects.DELETE("/:id", s.container.ProjectHandler.DeleteProject)
	}
}

// setupAllocationRoutes sets up project allocation routes
func (s *Server) setupAllocationRoutes(api *gin.RouterGroup) {
	allocations := api.Group("/allocations")
	{
		allocations.GET("", s.container.ProjectAllocationHandler.GetAllAllocations)
		allocations.GET("/:id", s.container.ProjectAllocationHandler.GetAllocationByID)
		allocations.POST("", s.container.ProjectAllocationHandler.CreateAllocation)
		allocations.PUT("/:id", s.container.ProjectAllocationHandler.UpdateAllocation)
		allocations.DELETE("/:id", s.container.ProjectAllocationHandler.DeleteAllocation)
		allocations.POST("/:id/release", s.container.ProjectAllocationHandler.ReleaseEmployee)
	}
}

// setupMatchRoutes sets up AI matching routes
func (s *Server) setupMatchRoutes(api *gin.RouterGroup) {
	matches := api.Group("/matches")
	{
		matches.GET("/projects/:id", s.container.MatchHandler.GetProjectMatches)
		matches.GET("/employees/:id", s.container.MatchHandler.GetEmployeeMatches)
		matches.POST("/projects/:id/suggestions", s.container.MatchHandler.GenerateMatchSuggestions)
		matches.GET("/projects/:projectId/employees/:employeeId/explanation", s.container.MatchHandler.GetMatchExplanation)
		matches.GET("/insights", s.container.MatchHandler.GetProactiveInsights)
	}
}

// setupNotificationRoutes sets up notification routes
func (s *Server) setupNotificationRoutes(api *gin.RouterGroup) {
	notifications := api.Group("/notifications")
	{
		notifications.GET("", s.container.NotificationHandler.GetAllNotifications)
		notifications.GET("/:id", s.container.NotificationHandler.GetNotificationByID)
		notifications.POST("", s.container.NotificationHandler.CreateNotification)
		notifications.PUT("/:id", s.container.NotificationHandler.UpdateNotification)
		notifications.DELETE("/:id", s.container.NotificationHandler.DeleteNotification)
		notifications.POST("/:id/read", s.container.NotificationHandler.MarkAsRead)
	}

	// User-specific notification routes
	users := api.Group("/users")
	{
		users.GET("/:userId/notifications", s.container.NotificationHandler.GetUserNotifications)
		users.GET("/:userId/notifications/unread", s.container.NotificationHandler.GetUnreadNotifications)
		users.POST("/:userId/notifications/read", s.container.NotificationHandler.MarkAllAsRead)
	}
}
