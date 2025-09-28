package services

import (
  "context"
  "fmt"
  "log"
  "strconv"

  "github.com/talent-fit/backend/internal/domain"
  "github.com/talent-fit/backend/internal/entities"
  "github.com/talent-fit/backend/internal/models"
)

// ProjectAllocationService implements the domain.ProjectAllocationService interface
type ProjectAllocationService struct {
	allocationRepo domain.ProjectAllocationRepository
	profileRepo    domain.EmployeeProfileRepository
    orchestrator   domain.NotificationOrchestrator
}

// NewProjectAllocationService creates a new project allocation service
func NewProjectAllocationService(allocationRepo domain.ProjectAllocationRepository, profileRepo domain.EmployeeProfileRepository, orchestrator domain.NotificationOrchestrator) domain.ProjectAllocationService {
	return &ProjectAllocationService{
		allocationRepo: allocationRepo,
		profileRepo:    profileRepo,
        orchestrator:   orchestrator,
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
func (s *ProjectAllocationService) GetAllocationsByEmployee(ctx context.Context, userId string) ([]*models.ProjectAllocationModel, error) {
  resEntities, err := s.allocationRepo.GetByEmployeeID(ctx, userId)
	if err != nil {
		return nil, err
	}

	allocationModels := make([]*models.ProjectAllocationModel, len(resEntities))
	for i, entity := range resEntities {
		var model models.ProjectAllocationModel
		model.FromEntity(entity)
		allocationModels[i] = &model
	}
	return allocationModels, nil
}

// updateEmployeeAvailability updates the employee's availability flag
func (s *ProjectAllocationService) updateEmployeeAvailability(ctx context.Context, employeeID int, available bool) error {
	userIDStr := strconv.FormatUint(uint64(employeeID), 10)

	// Get current profile
	profile, err := s.profileRepo.GetByUserID(ctx, userIDStr)
	if err != nil {
		return fmt.Errorf("failed to get employee profile for user %d: %w", employeeID, err)
	}

	// Update availability flag
	profile.AvailabilityFlag = available

	// Save updated profile
	_, err = s.profileRepo.Update(ctx, userIDStr, profile)
	if err != nil {
		return fmt.Errorf("failed to update availability flag for user %d: %w", employeeID, err)
	}

	log.Printf("Updated availability flag for employee %d to %t", employeeID, available)
	return nil
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

		// Set employee availability to false when allocated to a project
		err = s.updateEmployeeAvailability(ctx, entity.EmployeeID, false)
		if err != nil {
			log.Printf("Warning: Failed to update availability flag for employee %d: %v", entity.EmployeeID, err)
			// Don't fail the allocation creation, just log the warning
		}

		model.FromEntity(createdAllocation)
		result = append(result, model)

        // Trigger: Allocation assigned -> notify employee
        subject := "Project allocation assigned"
        body := "You have been allocated to project " + createdAllocation.Project.Name
        msg := domain.NotificationMessage{
            Type:    domain.NotificationTypeAllocationAssigned,
            Subject: subject,
            Body:    body,
            Metadata: map[string]string{
                "projectId": strconv.FormatInt(int64(createdAllocation.ProjectID), 10),
                "employeeId": strconv.FormatInt(int64(createdAllocation.EmployeeID), 10),
            },
            Recipients: []domain.Recipient{{
                UserID:  uint(createdAllocation.EmployeeID),
                Email:   createdAllocation.Employee.Email,
                SlackID: createdAllocation.Employee.SlackUserID,
                Role:    createdAllocation.Employee.Role,
            }},
        }
        _ = s.orchestrator.Dispatch(ctx, msg)
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
  isEmployeeInNewList := func(employeeID int) bool {
    for _, newAlloc := range allocation {
      if newAlloc.EmployeeID == employeeID {
        return true
      }
    }
    return false
  }

  // Helper function to check if an employee already exists in current allocations
  existingAllocationForEmployee := func(employeeID int) *entities.ProjectAllocation {
    for _, existing := range existingAllocations {
      if existing.EmployeeID == employeeID {
        return existing
      }
    }
    return nil
  }

	// Step 1: Delete allocations that are not in the new list (soft delete)
	for _, existing := range existingAllocations {
		if !isEmployeeInNewList(existing.EmployeeID) {
			if err := s.allocationRepo.Delete(ctx, int64(existing.ID)); err != nil {
				return nil, err
			}

			// Set employee availability to true when removed from project
			err = s.updateEmployeeAvailability(ctx, existing.EmployeeID, true)
			if err != nil {
				log.Printf("Warning: Failed to update availability flag for employee %d: %v", existing.EmployeeID, err)
				// Don't fail the update, just log the warning
			}
		}
	}

  // Convert projectID string to int
  projectIDInt, err := strconv.Atoi(projectID)
  if err != nil {
    return nil, err
  }

	// Step 2: Process incoming allocations (create new or keep existing)
	var result []*models.ProjectAllocationModel
	for _, newAlloc := range allocation {
		// Set the project ID to ensure consistency
		newAlloc.ProjectID = projectIDInt

		// Check if this is a new allocation (ID == 0) or employee doesn't exist
		existingAlloc := existingAllocationForEmployee(newAlloc.EmployeeID)

		if newAlloc.ID == 0 || existingAlloc == nil {
			// Create new allocation
			entity := newAlloc.ToEntity()
			entity.ID = 0 // Ensure it's treated as new
			createdAllocation, err := s.allocationRepo.Create(ctx, entity)
			if err != nil {
				return nil, err
			}

			// Set employee availability to false when allocated to a project
			err = s.updateEmployeeAvailability(ctx, entity.EmployeeID, false)
			if err != nil {
				log.Printf("Warning: Failed to update availability flag for employee %d: %v", entity.EmployeeID, err)
				// Don't fail the allocation creation, just log the warning
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
