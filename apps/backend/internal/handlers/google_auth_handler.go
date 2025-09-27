package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/domain"
)

// GoogleAuthHandler handles Google sign-in
type GoogleAuthHandler struct {
    authService domain.GoogleAuthService
}

// NewGoogleAuthHandler creates a new GoogleAuthHandler
func NewGoogleAuthHandler(authService domain.GoogleAuthService) *GoogleAuthHandler {
    return &GoogleAuthHandler{authService: authService}
}

// Login exchanges Google ID token for app JWT and user info
func (h *GoogleAuthHandler) Login(c *gin.Context) {
    var req struct {
        Credential string `json:"credential"`
    }
    if err := c.ShouldBindJSON(&req); err != nil || req.Credential == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "missing credential"})
        return
    }

    resp, err := h.authService.AuthenticateWithGoogle(c.Request.Context(), req.Credential)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{
        "token": resp.Token,
        "name":  resp.Name,
        "email": resp.Email,
    })
}

// Logout handles POST /auth/logout
func (h *GoogleAuthHandler) Logout(c *gin.Context) {
	// Stateless JWT: clients should discard their token.
	// If server-side invalidation is required, implement a blacklist store here.
	c.JSON(http.StatusOK, gin.H{"ok": true})
}

