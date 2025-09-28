package services

import (
  "context"
  "fmt"
  "log"

	"github.com/talent-fit/backend/internal/domain"
	"github.com/talent-fit/backend/internal/entities"
	"github.com/talent-fit/backend/internal/models"
	"github.com/talent-fit/backend/internal/utils"
)

// ProjectService implements the domain.ProjectService interface
type ProjectService struct {
  projectRepo      domain.ProjectRepository
  embeddingService domain.EmbeddingService
  embeddingUtils   *utils.EmbeddingEntityUtils
  allocationRepo   domain.ProjectAllocationRepository
  orchestrator     domain.NotificationOrchestrator
}

// NewProjectService creates a new project service
func NewProjectService(projectRepo domain.ProjectRepository, embeddingService domain.EmbeddingService, allocationRepo domain.ProjectAllocationRepository, orchestrator domain.NotificationOrchestrator) domain.ProjectService {
  return &ProjectService{
    projectRepo:      projectRepo,
    embeddingService: embeddingService,
    embeddingUtils:   utils.NewEmbeddingEntityUtils(embeddingService),
    allocationRepo:   allocationRepo,
    orchestrator:     orchestrator,
  }
}

// GetAllProjects retrieves all projects
func (s *ProjectService) GetAllProjects(ctx context.Context) ([]*models.ProjectModel, error) {
  entities, err := s.projectRepo.GetAll(ctx)
  if err != nil {
    return nil, err
  }
  var result []*models.ProjectModel
  for _, entity := range entities {
    model := &models.ProjectModel{}
    model.FromEntity(entity)
    result = append(result, model)
  }
  return result, nil
}

// GetProjectByID retrieves a project by ID
func (s *ProjectService) GetProjectByID(ctx context.Context, id int) (*models.ProjectModel, error) {
  entity, err := s.projectRepo.GetByID(ctx, id)
  if err != nil {
    return nil, err
  }
  model := &models.ProjectModel{}
  model.FromEntity(entity)
  return model, nil
}

// CreateProject creates a new project
func (s *ProjectService) CreateProject(ctx context.Context, project *models.ProjectModel) (*models.ProjectModel, error) {
  entity := project.ToEntity()

  // Generate project summary if description exists
  if entity.Description != "" {
    summary, err := s.embeddingService.SummarizeProject(ctx, entity.Description, entity.SeatsByType)
    if err != nil {
      log.Printf("Warning: Failed to generate project summary: %v", err)
    } else {
      entity.Summary = summary
    }
  }

  // Generate embedding before creating
  err := s.embeddingUtils.GenerateProjectEmbedding(ctx, entity)
  if err != nil {
    // Log the error but don't fail the creation - embedding generation is optional
    log.Printf("Warning: Failed to generate embedding for project: %v", err)
  }

  createdEntity, err := s.projectRepo.Create(ctx, entity)
  if err != nil {
    return nil, err
  }
  model := &models.ProjectModel{}
  model.FromEntity(createdEntity)
  return model, nil
}

// UpdateProject updates a project
func (s *ProjectService) UpdateProject(ctx context.Context, id int, project *models.ProjectModel) (*models.ProjectModel, error) {
  entity := project.ToEntity()

  // Get existing project to compare changes
  existingEntity, err := s.projectRepo.GetByID(ctx, id)
  if err != nil {
    return nil, fmt.Errorf("failed to get existing project: %w", err)
  }

  // Check if description or seats by type have changed
  descriptionChanged := existingEntity.Description != entity.Description
  seatsChanged := !compareSeatsByType(existingEntity.SeatsByType, entity.SeatsByType)

  // Only regenerate summary and embedding if relevant fields changed
  if (descriptionChanged || seatsChanged) && entity.Description != "" {
    // Generate project summary
    summary, err := s.embeddingService.SummarizeProject(ctx, entity.Description, entity.SeatsByType)
    if err != nil {
      log.Printf("Warning: Failed to generate project summary: %v", err)
    } else {
      entity.Summary = summary
    }

    if entity.Summary != "" {
      // Generate embedding (force update since content changed)
      err = s.embeddingUtils.UpdateProjectEmbedding(ctx, entity, true)
      if err != nil {
        log.Printf("Warning: Failed to generate embedding for project update: %v", err)
      }
    } else {
      entity.Embedding = existingEntity.Embedding
    }
  } else {
    // Keep existing summary and embedding if no relevant changes
    entity.Summary = existingEntity.Summary
    entity.Embedding = existingEntity.Embedding
  }

  updatedEntity, err := s.projectRepo.Update(ctx, id, entity)
  if err != nil {
    return nil, err
  }
  model := &models.ProjectModel{}
  model.FromEntity(updatedEntity)

  // Trigger: Project ending date set/changed -> notify employees and manager (fallback channel)
  if !existingEntity.EndDate.Equal(entity.EndDate) {
    // Gather recipients: all allocated employees (current allocations)
    allocs, err := s.allocationRepo.GetByProjectID(ctx, strconv.Itoa(id))
    if err == nil {
      var recipients []domain.Recipient
      for _, a := range allocs {
        recipients = append(recipients, domain.Recipient{
          UserID:  uint(a.EmployeeID),
          Email:   a.Employee.Email,
          SlackID: a.Employee.SlackUserID,
          Role:    a.Employee.Role,
        })
      }
      subject := "Project ending"
      body := fmt.Sprintf("Project %s ends on %s", updatedEntity.Name, updatedEntity.EndDate.Format("2006-01-02"))
      msg := domain.NotificationMessage{
        Type:       domain.NotificationTypeProjectEnding,
        Subject:    subject,
        Body:       body,
        Metadata:   map[string]string{"projectId": strconv.Itoa(id), "endDate": updatedEntity.EndDate.Format("2006-01-02")},
        Recipients: recipients,
      }
      _ = s.orchestrator.Dispatch(ctx, msg)
    }
  }
  return model, nil
}

// compareSeatsByType compares two SeatsByType maps for equality
func compareSeatsByType(a, b entities.SeatsByType) bool {
  if len(a) != len(b) {
    return false
  }
  for key, valueA := range a {
    if valueB, exists := b[key]; !exists || valueA != valueB {
      return false
    }
  }
  return true
}
