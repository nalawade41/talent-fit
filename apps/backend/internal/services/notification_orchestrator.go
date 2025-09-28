package services

import (
	"context"
	"log"

	"github.com/talent-fit/backend/internal/domain"
)

// Simple orchestrator: always persists in-app, then attempts Slack
type Orchestrator struct {
    InApp  domain.Notifier
    Slack  domain.Notifier
}

func NewOrchestrator(inApp domain.Notifier, slack domain.Notifier) domain.NotificationOrchestrator {
    return &Orchestrator{InApp: inApp, Slack: slack}
}

func (o *Orchestrator) Dispatch(ctx context.Context, msg domain.NotificationMessage) error {
    // In-app is best-effort required (UI depends on it)
    if o.InApp != nil {
        if err := o.InApp.Send(ctx, msg); err != nil {
            log.Printf("in-app notification failed: %v", err)
        }
    }

    // Slack is optional; log failures
    if o.Slack != nil {
        if err := o.Slack.Send(ctx, msg); err != nil {
            log.Printf("slack notification failed: %v", err)
        }
    }
    return nil
}


