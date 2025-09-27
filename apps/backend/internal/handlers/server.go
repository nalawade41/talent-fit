package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/pkg/middleware"
)

// Server represents the HTTP server
type Server struct {
	config *config.Config
	router *gin.Engine
}

// NewServer creates a new HTTP server instance
func NewServer(cfg *config.Config) *Server {
	// Set Gin mode based on environment
	if cfg.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	router := gin.New()

	// Add global middleware
	router.Use(gin.Logger())
	router.Use(gin.Recovery())

	// CORS middleware
	router.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Origin, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	server := &Server{
		config: cfg,
		router: router,
	}

	// Setup routes
	server.setupRoutes()

	return server
}

// setupRoutes configures all application routes
func (s *Server) setupRoutes() {
	// Health check endpoint (open)
	s.router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status":    "healthy",
			"timestamp": time.Now().UTC(),
			"version":   "1.0.0",
		})
	})

	// Open routes (no authentication required)
	auth := s.router.Group("/auth")
	{
		auth.POST("/generate-token", func(c *gin.Context) {
			c.JSON(http.StatusOK, gin.H{
				"message": "Generate token endpoint",
				"token":   "dummy-jwt-token",
			})
		})
	}

	// Protected API routes (require authentication)
	api := s.router.Group("/api/v1")
	api.Use(middleware.AuthMiddleware()) // Apply auth middleware to all API routes
	{
		// User routes
		users := api.Group("/users")
		{
			users.GET("", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get all users"})
			})
			users.GET("/:id", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get user by ID: " + c.Param("id")})
			})
			users.PUT("/:id", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Update user: " + c.Param("id")})
			})
		}

		// Employee profile routes
		profiles := api.Group("/profiles")
		{
			profiles.GET("/:userId", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Get employee profile: " + c.Param("userId")})
			})
			profiles.PUT("/:userId", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Update employee profile: " + c.Param("userId")})
			})
		}

		// Project routes
		projects := api.Group("/projects")
		{
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

		// Project allocation routes
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

		// AI matching routes
		matches := api.Group("/matches")
		{
			matches.POST("/generate", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Generate AI matches for project"})
			})
		}

		// Notification routes
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
}

// Start starts the HTTP server with graceful shutdown
func (s *Server) Start() error {
	addr := fmt.Sprintf("%s:%s", s.config.Server.Host, s.config.Server.Port)

	srv := &http.Server{
		Addr:    addr,
		Handler: s.router,
	}

	// Channel to listen for interrupt signal to trigger shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Start server in a goroutine
	go func() {
		log.Printf("Server starting on %s", addr)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Wait for interrupt signal
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline for shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown: %v", err)
		return err
	}

	log.Println("Server stopped gracefully")
	return nil
}
