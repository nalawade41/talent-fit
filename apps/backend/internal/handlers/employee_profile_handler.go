package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
)

// EmployeeProfileHandler handles HTTP requests for employee profiles
type EmployeeProfileHandler struct {
	profileService domain.EmployeeProfileService
}

// NewEmployeeProfileHandler creates a new employee profile handler
func NewEmployeeProfileHandler(profileService domain.EmployeeProfileService) *EmployeeProfileHandler {
	return &EmployeeProfileHandler{
		profileService: profileService,
	}
}

// GetAllProfiles handles GET /profiles
func (h *EmployeeProfileHandler) GetAllProfiles(c *gin.Context) {
	// TODO: Implement handler logic
	c.JSON(http.StatusOK, gin.H{"message": "Get all employee profiles - TODO"})
}

// GetProfileByUserID handles GET /profiles/user/:userId
func (h *EmployeeProfileHandler) GetProfileByUserID(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	profile, err := h.profileService.GetProfileByUserID(ctx, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profile)
}

// CreateProfile handles POST /profiles
func (h *EmployeeProfileHandler) CreateProfile(c *gin.Context) {
	ctx := c.Request.Context()
	var profile models.EmployeeProfileModel
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	createdProfile, err := h.profileService.CreateProfile(ctx, &profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProfile)
}

// UpdateProfile handles PUT /profiles/user/:userId
func (h *EmployeeProfileHandler) UpdateProfile(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.Param("userId")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var profile models.EmployeeProfileModel
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updatedProfile, err := h.profileService.UpdateProfile(ctx, userID, &profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedProfile)
}
