package services

import (
	"context"
	"strconv"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
)

// ProjectAllocationService implements the domain.ProjectAllocationService interface
type ProjectAllocationService struct {
	allocationRepo domain.ProjectAllocationRepository
}

// NewProjectAllocationService creates a new project allocation service
func NewProjectAllocationService(allocationRepo domain.ProjectAllocationRepository) domain.ProjectAllocationService {
	return &ProjectAllocationService{
		allocationRepo: allocationRepo,
	}
}

// GetAllocationsByProject retrieves allocations by project ID
func (s *ProjectAllocationService) GetAllocationsByProject(ctx context.Context, projectID string) ([]*models.ProjectAllocationModel, error) {
	entities, err := s.allocationRepo.GetByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}
	
	allocationModels := make([]*models.ProjectAllocationModel, len(entities))
	for i, entity := range entities {
		var model models.ProjectAllocationModel
		model.FromEntity(entity)
		allocationModels[i] = &model
	}
	return allocationModels, nil
}

// GetAllocationsByEmployee retrieves allocations by employee ID
func (s *ProjectAllocationService) GetAllocationsByEmployee(ctx context.Context, employeeID string) ([]*models.ProjectAllocationModel, error) {
	entities, err := s.allocationRepo.GetByEmployeeID(ctx, employeeID)
	if err != nil {
		return nil, err
	}
	
	allocationModels := make([]*models.ProjectAllocationModel, len(entities))
	for i, entity := range entities {
		var model models.ProjectAllocationModel
		model.FromEntity(entity)
		allocationModels[i] = &model
	}
	return allocationModels, nil
}

// CreateAllocation creates a new project allocation
func (s *ProjectAllocationService) CreateAllocation(ctx context.Context, allocation []*models.ProjectAllocationModel) ([]*models.ProjectAllocationModel, error) {
	var result []*models.ProjectAllocationModel
	for _, model := range allocation {
		entity := model.ToEntity()
		createdAllocation, err := s.allocationRepo.Create(ctx, entity)
		if err != nil {
			return nil, err
		}
		model.FromEntity(createdAllocation)
		result = append(result, model)
	}
	
	return result, nil
}

// UpdateAllocation updates project allocations (create new, delete removed)
func (s *ProjectAllocationService) UpdateAllocation(ctx context.Context, projectID string, allocation []*models.ProjectAllocationModel) ([]*models.ProjectAllocationModel, error) {
	// Get existing allocations for this project
	existingAllocations, err := s.allocationRepo.GetByProjectID(ctx, projectID)
	if err != nil {
		return nil, err
	}

	// Helper function to check if an employee is in the incoming allocation list
	isEmployeeInNewList := func(employeeID int64) bool {
		for _, newAlloc := range allocation {
			if newAlloc.EmployeeID == employeeID {
				return true
			}
		}
		return false
	}

	// Helper function to check if an employee already exists in current allocations
	existingAllocationForEmployee := func(employeeID int64) *entities.ProjectAllocation {
		for _, existing := range existingAllocations {
			if existing.EmployeeID == int64(employeeID) {
				return existing
			}
		}
		return nil
	}

	// Step 1: Delete allocations that are not in the new list (soft delete)
	for _, existing := range existingAllocations {
		if !isEmployeeInNewList(int64(existing.EmployeeID)) {
			if err := s.allocationRepo.Delete(ctx, int64(existing.ID)); err != nil {
				return nil, err
			}
		}
	}

	// Convert projectID string to int64
	projectIDInt64, err := strconv.ParseInt(projectID, 10, 64)
	if err != nil {
		return nil, err
	}

	// Step 2: Process incoming allocations (create new or keep existing)
	var result []*models.ProjectAllocationModel
	for _, newAlloc := range allocation {
		// Set the project ID to ensure consistency
		newAlloc.ProjectID = projectIDInt64
		
		// Check if this is a new allocation (ID == 0) or employee doesn't exist
		existingAlloc := existingAllocationForEmployee(int64(newAlloc.EmployeeID))
		
		if newAlloc.ID == 0 || existingAlloc == nil {
			// Create new allocation
			entity := newAlloc.ToEntity()
			entity.ID = 0 // Ensure it's treated as new
			createdAllocation, err := s.allocationRepo.Create(ctx, entity)
			if err != nil {
				return nil, err
			}
			newAlloc.FromEntity(createdAllocation)
			result = append(result, newAlloc)
		} else {
			// Keep existing allocation (convert existing entity to model)
			var model models.ProjectAllocationModel
			model.FromEntity(existingAlloc)
			result = append(result, &model)
		}
	}
	
	return result, nil
}
