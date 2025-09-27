package services

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
)

// NotificationService implements the domain.NotificationService interface
type NotificationService struct {
	notificationRepo domain.NotificationRepository
}

// NewNotificationService creates a new notification service
func NewNotificationService(notificationRepo domain.NotificationRepository) domain.NotificationService {
	return &NotificationService{
		notificationRepo: notificationRepo,
	}
}

// GetAllNotifications retrieves all notifications
func (s *NotificationService) GetAllNotifications(ctx context.Context) error {
	// TODO: Implement business logic for getting all notifications
	return s.notificationRepo.GetAll(ctx)
}

// GetNotificationByID retrieves a notification by ID
func (s *NotificationService) GetNotificationByID(ctx context.Context, id string) error {
	// TODO: Implement business logic for getting notification by ID
	return s.notificationRepo.GetByID(ctx, id)
}

// GetNotificationsByUser retrieves notifications by user ID
func (s *NotificationService) GetNotificationsByUser(ctx context.Context, userID string) error {
	// TODO: Implement business logic for getting notifications by user
	return s.notificationRepo.GetByUserID(ctx, userID)
}

// GetUnreadNotifications retrieves unread notifications for a user
func (s *NotificationService) GetUnreadNotifications(ctx context.Context, userID string) error {
	// TODO: Implement business logic for getting unread notifications
	return s.notificationRepo.GetUnreadByUserID(ctx, userID)
}

// CreateNotification creates a new notification
func (s *NotificationService) CreateNotification(ctx context.Context) error {
	// TODO: Implement business logic for creating notification
	return s.notificationRepo.Create(ctx)
}

// UpdateNotification updates a notification
func (s *NotificationService) UpdateNotification(ctx context.Context, id string) error {
	// TODO: Implement business logic for updating notification
	return s.notificationRepo.Update(ctx, id)
}

// DeleteNotification deletes a notification
func (s *NotificationService) DeleteNotification(ctx context.Context, id string) error {
	// TODO: Implement business logic for deleting notification
	return s.notificationRepo.Delete(ctx, id)
}

// MarkNotificationAsRead marks a notification as read
func (s *NotificationService) MarkNotificationAsRead(ctx context.Context, id string) error {
	// TODO: Implement business logic for marking notification as read
	return s.notificationRepo.MarkAsRead(ctx, id)
}

// MarkAllNotificationsAsRead marks all notifications as read for a user
func (s *NotificationService) MarkAllNotificationsAsRead(ctx context.Context, userID string) error {
	// TODO: Implement business logic for marking all notifications as read
	return s.notificationRepo.MarkAllAsRead(ctx, userID)
}

// SendRolloffAlert sends a roll-off alert notification
func (s *NotificationService) SendRolloffAlert(ctx context.Context, employeeID string) error {
	// TODO: Implement business logic for sending roll-off alert
	// TODO: Create notification, send email/Slack notification
	return nil
}

// SendProjectGapAlert sends a project gap alert notification
func (s *NotificationService) SendProjectGapAlert(ctx context.Context, projectID string) error {
	// TODO: Implement business logic for sending project gap alert
	// TODO: Create notification, send email/Slack notification
	return nil
}

// SendAllocationSuggestion sends an allocation suggestion notification
func (s *NotificationService) SendAllocationSuggestion(ctx context.Context, projectID string, employeeID string) error {
	// TODO: Implement business logic for sending allocation suggestion
	// TODO: Create notification, send email/Slack notification
	return nil
}
