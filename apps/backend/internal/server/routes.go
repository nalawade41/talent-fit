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
    auth.POST("/google/login", s.container.GoogleAuthHandler.Login)
		auth.POST("/logout", s.container.GoogleAuthHandler.Logout)
	}
}

// setupProtectedRoutes sets up all protected API routes
func (s *Server) setupProtectedRoutes() {
    api := s.router.Group("/api/v1")
    api.Use(middleware.AuthMiddlewareWithConfig(s.config)) // Apply auth middleware to all API routes

	// Employee routes (personal and professional details)
	s.setupEmployeeRoutes(api)

	// Manager routes (employee management and projects)
	s.setupManagerRoutes(api)

	// Notification routes
	s.setupNotificationRoutes(api)
}

// setupEmployeeRoutes sets up employee-specific routes (personal and professional details)
func (s *Server) setupEmployeeRoutes(api *gin.RouterGroup) {
	// Employee details for both personal and professional
	api.GET("/employee/:id", s.container.EmployeeProfileHandler.GetProfileByUserID) // Done
	api.POST("/employee/:id", s.container.EmployeeProfileHandler.CreateProfile)     // Done
	api.PATCH("/employee/:id", s.container.EmployeeProfileHandler.UpdateProfile)    // Done

	// Projects for employee
	api.GET("/employee/:id/projects", s.container.ProjectAllocationHandler.GetAllocationsByEmployee) // Done
	// GET /employee/:id/projects/:id (specific project detail for employee - not implemented yet)
}

// setupManagerRoutes sets up manager-specific routes (employee management and projects)
func (s *Server) setupManagerRoutes(api *gin.RouterGroup) {
	// Employee management for managers (with query parameters for filtering)
	// GET /employees?skills=<>&geo=<>&availability=<>
	api.GET("/employees", s.container.EmployeeProfileHandler.GetAllProfiles) // Will handle query params

	// Project management
	api.GET("/projects", s.container.ProjectHandler.GetAllProjects)     // Done
	api.POST("/projects", s.container.ProjectHandler.CreateProject)     // Done
	api.GET("/project/:id", s.container.ProjectHandler.GetProjectByID)  // Done
	api.PATCH("/project/:id", s.container.ProjectHandler.UpdateProject) // Done

	// Employee suggestions (AI matching)
	api.GET("/employee/suggestions", s.container.MatchHandler.GetProactiveInsights)

	// Project allocations
	api.GET("/project/:id/allocation", s.container.ProjectAllocationHandler.GetAllocationsByProject) // Done
	api.PATCH("/project/:id/allocation", s.container.ProjectAllocationHandler.UpdateAllocation)      // Done
	api.POST("/project/:id/allocation", s.container.ProjectAllocationHandler.CreateAllocation)       // Done
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
