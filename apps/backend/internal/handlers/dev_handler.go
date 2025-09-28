package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/talent-fit/backend/internal/config"
	"github.com/talent-fit/backend/internal/domain"
)

// DevHandler provides dev/test utilities
type DevHandler struct {
    orchestrator domain.NotificationOrchestrator
    cfg          *config.Config
}

func NewDevHandler(orchestrator domain.NotificationOrchestrator, cfg *config.Config) *DevHandler {
    return &DevHandler{orchestrator: orchestrator, cfg: cfg}
}

// SendTestNotification posts a sample message to the default Slack channel (no auth; non-prod only)
func (h *DevHandler) SendTestNotification(c *gin.Context) {
    if h.cfg.IsProduction() {
        c.JSON(http.StatusForbidden, gin.H{"error": "disabled in production"})
        return
    }

    msg := domain.NotificationMessage{
        Type:    domain.NotificationTypeAllocationAssigned,
        Subject: "TalentFit Test",
        Body:    "This is a test notification from TalentFit",
        Metadata: map[string]string{
            "source": "dev-endpoint",
        },
        // No concrete recipients -> Slack notifier will fallback to default channel
        Recipients: []domain.Recipient{{}},
    }

    if err := h.orchestrator.Dispatch(c.Request.Context(), msg); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"ok": true})
}


