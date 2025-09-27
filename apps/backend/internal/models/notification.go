package models

import (
	"time"

	"github.com/talent-fit/backend/internal/entities"
)

// NotificationType represents the type of notification
type NotificationType string

const (
	NotificationRolloffAlert         NotificationType = "Roll-off Alert"
	NotificationProjectGap           NotificationType = "Project Gap"
	NotificationAllocationSuggestion NotificationType = "Allocation Suggestion"
)

// NotificationModel represents the notification business model
type NotificationModel struct {
	ID        uint             `json:"id"`
	Type      NotificationType `json:"type"`
	Message   string           `json:"message"`
	UserID    uint             `json:"user_id"`
	CreatedAt time.Time        `json:"created_at"`
	UpdatedAt time.Time        `json:"updated_at"`
	IsRead    bool             `json:"is_read"`

	// Relationships
	User UserModel `json:"user,omitempty"`
}

// ToEntity converts NotificationModel to entity
func (n *NotificationModel) ToEntity() *entities.Notification {
	entity := &entities.Notification{
		ID:        n.ID,
		Type:      string(n.Type),
		Message:   n.Message,
		UserID:    n.UserID,
		CreatedAt: n.CreatedAt,
		UpdatedAt: n.UpdatedAt,
		IsRead:    n.IsRead,
	}
	return entity
}

// FromEntity converts entity to NotificationModel
func (n *NotificationModel) FromEntity(entity *entities.Notification) {
	n.ID = entity.ID
	n.Type = NotificationType(entity.Type)
	n.Message = entity.Message
	n.UserID = entity.UserID
	n.CreatedAt = entity.CreatedAt
	n.UpdatedAt = entity.UpdatedAt
	n.IsRead = entity.IsRead
}
