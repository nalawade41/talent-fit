package services

import (
	"context"
	"time"

	"github.com/talent-fit/backend/internal/domain"
)

// DashboardService implements domain.DashboardService
type DashboardService struct {
	projectRepo    domain.ProjectRepository
	allocationRepo domain.ProjectAllocationRepository
	profileRepo    domain.EmployeeProfileRepository
}

// NewDashboardService creates a new dashboard service
func NewDashboardService(projectRepo domain.ProjectRepository, allocationRepo domain.ProjectAllocationRepository, profileRepo domain.EmployeeProfileRepository) domain.DashboardService {
	return &DashboardService{
		projectRepo:    projectRepo,
		allocationRepo: allocationRepo,
		profileRepo:    profileRepo,
	}
}

// GetManagerDashboardMetrics computes summary metrics used on the manager dashboard
func (s *DashboardService) GetManagerDashboardMetrics(ctx context.Context) (*domain.ManagerDashboardMetrics, error) {
	// Available engineers:
	//  - availability_flag = true OR no active allocations
	// Bench resources:
	//  - no allocations at all OR no ACTIVE allocations
	// Allocated engineers:
	//  - have an ACTIVE allocation (allocation end_date is nil or in future)
	// Active projects:
	//  - project.start_date < today AND project.end_date > today
	// Rolling off soon:
	//  - employees with end_date or notice_date within next 60 days
	//  - OR allocations with end_date within next 30 days

	// Fetch source data
	profiles, err := s.profileRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}
	projects, err := s.projectRepo.GetAll(ctx)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	soon30 := now.AddDate(0, 0, 30)
	soon60 := now.AddDate(0, 0, 60)

	// Index allocations by employee for quick checks
	// We do not have a repository method to fetch all allocations, so we will
	// derive allocated state from projects' preloaded allocations.
	// projectRepo.GetAll preloads ProjectAllocations.
	allocatedEmployeeIDs := make(map[int]bool)
	rollingOffFromAlloc := 0

	activeProjects := 0
	for _, p := range projects {
		if p.StartDate.Before(now) && p.EndDate.After(now) {
			activeProjects++
		}
		for _, alloc := range p.ProjectAllocations {
			isActive := alloc.StartDate.Before(now) && (alloc.EndDate == nil || alloc.EndDate.After(now))
			if isActive {
				allocatedEmployeeIDs[int(alloc.EmployeeID)] = true
			}
			if alloc.EndDate != nil && alloc.EndDate.After(now) && alloc.EndDate.Before(soon30) {
				rollingOffFromAlloc++
			}
		}
	}

	allocatedEngineers := len(allocatedEmployeeIDs)

	// Determine availability/bench/rollingOff from profiles
	availableEngineers := 0
	benchResources := 0
	rollingOffFromProfiles := 0
	for _, prof := range profiles {
		_, hasActiveAlloc := allocatedEmployeeIDs[int(prof.UserID)]
		if prof.AvailabilityFlag || !hasActiveAlloc {
			availableEngineers++
		}
		if !hasActiveAlloc {
			benchResources++
		}
		if (prof.EndDate != nil && prof.EndDate.After(now) && prof.EndDate.Before(soon60)) || (prof.NoticeDate != nil && prof.NoticeDate.After(now) && prof.NoticeDate.Before(soon60)) {
			rollingOffFromProfiles++
		}
	}

	metrics := &domain.ManagerDashboardMetrics{
		AvailableEngineers: availableEngineers,
		ActiveProjects:     activeProjects,
		RollingOffSoon:     rollingOffFromAlloc + rollingOffFromProfiles,
		BenchResources:     benchResources,
		AllocatedEngineers: allocatedEngineers,
	}
	return metrics, nil
}


