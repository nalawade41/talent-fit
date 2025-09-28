package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
)

// DashboardHandler handles HTTP requests for dashboard metrics
type DashboardHandler struct {
	dashboardService domain.DashboardService
}

// NewDashboardHandler creates a new dashboard handler
func NewDashboardHandler(dashboardService domain.DashboardService) *DashboardHandler {
	return &DashboardHandler{dashboardService: dashboardService}
}

// GetManagerDashboardMetrics handles GET /manager/dashboard/metrics
func (h *DashboardHandler) GetManagerDashboardMetrics(c *gin.Context) {
	ctx := c.Request.Context()

	metrics, err := h.dashboardService.GetManagerDashboardMetrics(ctx)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, metrics)
}


