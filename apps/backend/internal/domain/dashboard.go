package domain

import (
	"context"
)

// ManagerDashboardMetrics represents the summary counts needed on the manager dashboard
type ManagerDashboardMetrics struct {
	AvailableEngineers int `json:"availableEngineers"`
	ActiveProjects     int `json:"activeProjects"`
	RollingOffSoon     int `json:"rollingOffSoon"`
	BenchResources     int `json:"benchResources"`
	AllocatedEngineers int `json:"allocatedEngineers"`
}

// DashboardService defines the interface for computing dashboard metrics
type DashboardService interface {
	GetManagerDashboardMetrics(ctx context.Context) (*ManagerDashboardMetrics, error)
}


