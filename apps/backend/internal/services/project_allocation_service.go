package services

import (
	"context"

	"github.com/talent-fit/backend/internal/domain"
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

// UpdateAllocation updates a project allocation
func (s *ProjectAllocationService) UpdateAllocation(ctx context.Context, id string, allocation []*models.ProjectAllocationModel) ([]*models.ProjectAllocationModel, error) {
	var result []*models.ProjectAllocationModel
	for _, model := range allocation {
		entity := model.ToEntity()
		updatedAllocation, err := s.allocationRepo.Update(ctx, id, entity)
		if err != nil {
			return nil, err
		}
		model.FromEntity(updatedAllocation)
		result = append(result, model)
	}
	
	return result, nil
}
