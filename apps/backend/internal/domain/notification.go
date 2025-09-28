package domain

import (
	"context"
)

// NotificationRepository defines the interface for notification data operations
type NotificationRepository interface {
	GetAll(ctx context.Context) error
	GetByID(ctx context.Context, id string) error
	GetByUserID(ctx context.Context, userID string) error
	GetUnreadByUserID(ctx context.Context, userID string) error
	Create(ctx context.Context) error
	Update(ctx context.Context, id string) error
	Delete(ctx context.Context, id string) error
	MarkAsRead(ctx context.Context, id string) error
	MarkAllAsRead(ctx context.Context, userID string) error
}

// NotificationService defines the interface for notification business logic
type NotificationService interface {
	GetAllNotifications(ctx context.Context) error
	GetNotificationByID(ctx context.Context, id string) error
	GetNotificationsByUser(ctx context.Context, userID string) error
	GetUnreadNotifications(ctx context.Context, userID string) error
	CreateNotification(ctx context.Context) error
	UpdateNotification(ctx context.Context, id string) error
	DeleteNotification(ctx context.Context, id string) error
	MarkNotificationAsRead(ctx context.Context, id string) error
	MarkAllNotificationsAsRead(ctx context.Context, userID string) error
	SendRolloffAlert(ctx context.Context, employeeID string) error
	SendProjectGapAlert(ctx context.Context, projectID string) error
	SendAllocationSuggestion(ctx context.Context, projectID string, employeeID string) error
}

// New extensible notification types and orchestrator interfaces
type NotificationType string

const (
    NotificationTypeRolloffAlert        NotificationType = "rolloff_alert"
    NotificationTypeProjectEnding       NotificationType = "project_ending"
    NotificationTypeAllocationAssigned  NotificationType = "allocation_assigned"
)

type Channel string

const (
    ChannelSlack Channel = "slack"
    ChannelInApp Channel = "in_app"
)

type Recipient struct {
    UserID  uint
    Email   string
    SlackID string
    Role    string
}

type NotificationMessage struct {
    Type       NotificationType
    Subject    string
    Body       string
    Metadata   map[string]string
    Recipients []Recipient
}

type Notifier interface {
    Send(ctx context.Context, msg NotificationMessage) error
}

type NotificationOrchestrator interface {
    Dispatch(ctx context.Context, msg NotificationMessage) error
}
