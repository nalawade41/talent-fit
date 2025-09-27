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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Project ID is required"})
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
