package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
)

// ProjectHandler handles HTTP requests for projects
type ProjectHandler struct {
	projectService domain.ProjectService
}

// NewProjectHandler creates a new project handler
func NewProjectHandler(projectService domain.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
	}
}

// GetAllProjects handles GET /projects
func (h *ProjectHandler) GetAllProjects(c *gin.Context) {
	// TODO: Implement handler logic
	// TODO: Call service, handle errors, return JSON response
	c.JSON(http.StatusOK, gin.H{"message": "Get all projects - TODO"})
}

// GetProjectByID handles GET /projects/:id
func (h *ProjectHandler) GetProjectByID(c *gin.Context) {
	// TODO: Implement handler logic
	// TODO: Get ID from params, call service, return JSON response
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Get project by ID: " + id + " - TODO"})
}

// CreateProject handles POST /projects
func (h *ProjectHandler) CreateProject(c *gin.Context) {
	// TODO: Implement handler logic
	// TODO: Parse request body, validate, call service, return JSON response
	c.JSON(http.StatusCreated, gin.H{"message": "Create project - TODO"})
}

// UpdateProject handles PUT /projects/:id
func (h *ProjectHandler) UpdateProject(c *gin.Context) {
	// TODO: Implement handler logic
	// TODO: Get ID from params, parse body, call service, return JSON response
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Update project: " + id + " - TODO"})
}

// DeleteProject handles DELETE /projects/:id
func (h *ProjectHandler) DeleteProject(c *gin.Context) {
	// TODO: Implement handler logic
	// TODO: Get ID from params, call service, return JSON response
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Delete project: " + id + " - TODO"})
}
