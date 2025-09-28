package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
)

// MatchHandler handles HTTP requests for AI matching
type MatchHandler struct {
	matchService domain.MatchService
}

// NewMatchHandler creates a new match handler
func NewMatchHandler(matchService domain.MatchService) *MatchHandler {
	return &MatchHandler{
		matchService: matchService,
	}
}

// GetProjectMatches handles GET /matches/projects/:id
func (h *MatchHandler) GetProjectMatches(c *gin.Context) {
	// TODO: Implement handler logic for getting project matches
	projectID := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Get matches for project: " + projectID + " - TODO"})
}

// GetEmployeeMatches handles GET /matches/employees/:id
func (h *MatchHandler) GetEmployeeMatches(c *gin.Context) {
	// TODO: Implement handler logic for getting employee matches
	employeeID := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Get matches for employee: " + employeeID + " - TODO"})
}

// GenerateMatchSuggestions handles GET /employee/suggestions
func (h *MatchHandler) GenerateMatchSuggestions(c *gin.Context) {
	ctx := c.Request.Context()
	
	// Get project ID from query parameter
	projectID := c.Param("id")
	if projectID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "project_id query parameter is required"})
		return
	}

	// Call service to generate match suggestions
	log.Printf("Generating AI match suggestions for project ID: %s", projectID)
	suggestions, err := h.matchService.GenerateMatchSuggestions(ctx, projectID)
	if err != nil {
		log.Printf("Error generating match suggestions for project %s: %v", projectID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Successfully generated %d match suggestions for project %s", len(suggestions), projectID)
	
	// Return successful response
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data": suggestions,
		"count": len(suggestions),
		"message": "AI match suggestions generated successfully",
	})
}

// GetMatchExplanation handles GET /matches/projects/:projectId/employees/:employeeId/explanation
func (h *MatchHandler) GetMatchExplanation(c *gin.Context) {
	// TODO: Implement handler logic for getting match explanation
	projectID := c.Param("projectId")
	employeeID := c.Param("employeeId")
	c.JSON(http.StatusOK, gin.H{
		"message": "Get match explanation for project: " + projectID + " and employee: " + employeeID + " - TODO",
	})
}

// GetProactiveInsights handles GET /matches/insights
func (h *MatchHandler) GetProactiveInsights(c *gin.Context) {
	// TODO: Implement handler logic for getting proactive insights
	c.JSON(http.StatusOK, gin.H{"message": "Get proactive insights - TODO"})
}
