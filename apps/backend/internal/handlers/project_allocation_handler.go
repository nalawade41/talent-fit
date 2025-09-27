package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
)

// ProjectAllocationHandler handles HTTP requests for project allocations
type ProjectAllocationHandler struct {
	allocationService domain.ProjectAllocationService
}

// NewProjectAllocationHandler creates a new project allocation handler
func NewProjectAllocationHandler(allocationService domain.ProjectAllocationService) *ProjectAllocationHandler {
	return &ProjectAllocationHandler{
		allocationService: allocationService,
	}
}

// GetAllAllocations handles GET /allocations
func (h *ProjectAllocationHandler) GetAllAllocations(c *gin.Context) {
	// TODO: Implement handler logic
	c.JSON(http.StatusOK, gin.H{"message": "Get all allocations - TODO"})
}

// GetAllocationByID handles GET /allocations/:id
func (h *ProjectAllocationHandler) GetAllocationByID(c *gin.Context) {
	// TODO: Implement handler logic
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Get allocation by ID: " + id + " - TODO"})
}

// CreateAllocation handles POST /allocations
func (h *ProjectAllocationHandler) CreateAllocation(c *gin.Context) {
	ctx := c.Request.Context()

	var allocation []*models.ProjectAllocationModel
	if err := c.ShouldBindJSON(&allocation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdAllocation, err := h.allocationService.CreateAllocation(ctx, allocation)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdAllocation)
}

// UpdateAllocation handles PUT /allocations/:id
func (h *ProjectAllocationHandler) UpdateAllocation(c *gin.Context) {
	ctx := c.Request.Context()

	id := c.Param("id")
	if id == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Allocation ID is required"})
		return
	}

	var allocation []*models.ProjectAllocationModel
	if err := c.ShouldBindJSON(&allocation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedAllocation, err := h.allocationService.UpdateAllocation(ctx, id, allocation)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedAllocation)
}

// DeleteAllocation handles DELETE /allocations/:id
func (h *ProjectAllocationHandler) DeleteAllocation(c *gin.Context) {
	// TODO: Implement handler logic
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Delete allocation: " + id + " - TODO"})
}

// ReleaseEmployee handles POST /allocations/:id/release
func (h *ProjectAllocationHandler) ReleaseEmployee(c *gin.Context) {
	// TODO: Implement handler logic for releasing employee from project
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Release employee from allocation: " + id + " - TODO"})
}

// GetAllocationsByProject handles GET /project/:id/allocation
func (h *ProjectAllocationHandler) GetAllocationsByProject(c *gin.Context) {
	ctx := c.Request.Context()

	projectID := c.Param("id")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project ID is required"})
		return
	}

	allocations, err := h.allocationService.GetAllocationsByProject(ctx, projectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, allocations)
}

// GetAllocationsByEmployee handles GET /employee/:id/projects
func (h *ProjectAllocationHandler) GetAllocationsByEmployee(c *gin.Context) {
	ctx := c.Request.Context()

	employeeID := c.Param("id")
	if employeeID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Employee ID is required"})
		return
	}

	allocations, err := h.allocationService.GetAllocationsByEmployee(ctx, employeeID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, allocations)
}
