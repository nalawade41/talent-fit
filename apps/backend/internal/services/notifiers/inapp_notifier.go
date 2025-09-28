package notifiers

import (
	"context"
	"log"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"gorm.io/gorm"
)

// InAppNotifier writes notifications into the notifications table for each recipient
type InAppNotifier struct {
    db *gorm.DB
}

func NewInAppNotifier(db *gorm.DB) *InAppNotifier {
    return &InAppNotifier{db: db}
}

func (n *InAppNotifier) Send(ctx context.Context, msg domain.NotificationMessage) error {
    for _, r := range msg.Recipients {
        if r.UserID == 0 {
            // Skip in-app entry if no concrete user target is provided
            continue
        }
        notif := &entities.Notification{
            Type:    string(msg.Type),
            Message: msg.Body,
            UserID:  r.UserID,
        }
        if err := n.db.WithContext(ctx).Create(notif).Error; err != nil {
            log.Printf("failed to create in-app notification for user %d: %v", r.UserID, err)
        }
    }
    return nil
}


