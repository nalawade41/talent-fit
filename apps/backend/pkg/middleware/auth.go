package middleware

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/talent-fit/backend/internal/config"
)

// GenerateJWTToken creates a signed JWT containing the user email and role
func GenerateJWTToken(cfg *config.Config, email string, role string) (string, error) {
	claims := jwt.MapClaims{
		"sub":   email,
		"role":  role,
		"exp":   time.Now().Add(24 * time.Hour).Unix(),
		"iat":   time.Now().Unix(),
		"iss":   "talent-fit",
		"scope": "api",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(cfg.Auth.JWTSecret))
}

// AuthMiddlewareWithConfig validates JWT tokens using provided config
// and injects user identity and claims into Gin context.
func AuthMiddlewareWithConfig(cfg *config.Config) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing bearer token"})
			return
		}

		raw := strings.TrimPrefix(authHeader, "Bearer ")

		claims := jwt.MapClaims{}
		_, err := jwt.ParseWithClaims(raw, claims, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, errors.New("invalid signing method")
			}
			return []byte(cfg.Auth.JWTSecret), nil
		})
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		// Extract user identity (email) from `sub`
		sub, ok := claims["sub"].(string)
		if !ok || sub == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token subject"})
			return
		}

		// Inject into context for downstream handlers
		c.Set("userEmail", sub)
		c.Set("authClaims", claims)

		c.Next()
	}
}

// Helper to get user email from context
func GetUserEmail(c *gin.Context) (string, bool) {
	v, ok := c.Get("userEmail")
	if !ok {
		return "", false
	}
	email, ok := v.(string)
	return email, ok
}

// Helper to get full JWT claims from context
func GetAuthClaims(c *gin.Context) (jwt.MapClaims, bool) {
	v, ok := c.Get("authClaims")
	if !ok {
		return nil, false
	}
	claims, ok := v.(jwt.MapClaims)
	return claims, ok
}