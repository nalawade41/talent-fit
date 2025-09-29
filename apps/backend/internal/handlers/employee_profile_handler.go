package handlers

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/pkg/middleware"
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
	ctx := c.Request.Context()

	// Parse query params
	skillsParam := strings.TrimSpace(c.Query("skills"))     // comma-separated
	geosParam := strings.TrimSpace(c.Query("geo"))          // comma-separated
	availableOnly := strings.EqualFold(c.Query("available"), "true")

	var skills []string
	if skillsParam != "" {
		parts := strings.Split(skillsParam, ",")
		for _, p := range parts {
			v := strings.TrimSpace(p)
			if v != "" {
				skills = append(skills, v)
			}
		}
	}

	var geos []string
	if geosParam != "" {
		parts := strings.Split(geosParam, ",")
		for _, p := range parts {
			v := strings.TrimSpace(p)
			if v != "" {
				geos = append(geos, v)
			}
		}
	}

	profiles, err := h.profileService.SearchProfiles(ctx, skills, geos, availableOnly)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, profiles)
}

// GetProfileByUserID handles GET /employee/me
func (h *EmployeeProfileHandler) GetMe(c *gin.Context) {
	ctx := c.Request.Context()

	// Get user email from context
	email, ok := middleware.GetUserEmail(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User email not found"})
		return
	}
	
	profile, err := h.profileService.GetProfileByUserEmail(ctx, email)
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

	// Get user email from context
	email, ok := middleware.GetUserEmail(c)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User email not found"})
		return
	}

	createdProfile, err := h.profileService.CreateProfile(ctx, email, &profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, createdProfile)
}

// UpdateProfile handles PUT /profiles/user/:userId
func (h *EmployeeProfileHandler) UpdateProfile(c *gin.Context) {
	ctx := c.Request.Context()
	userID := c.Param("id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	var profile models.EmployeeProfileModel
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set the user ID from the URL parameter
	userIDInt, err := strconv.ParseUint(userID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID format"})
		return
	}
	profile.UserID = uint(userIDInt)

	updatedProfile, err := h.profileService.UpdateProfile(ctx, userID, &profile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, updatedProfile)
}
