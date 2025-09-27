# Dummy Data Documentation

This folder contains comprehensive dummy data for the Talent Fit application. The data is structured to match the API specifications and provide realistic scenarios for UI development.

## Structure

### `/data/employees.ts`
- **Employee profiles** with personal and professional details
- 8 diverse employees across different roles and statuses
- Helper functions for filtering by availability, skills, geo, etc.
- Status types: `available`, `rolling_off`, `allocated`, `bench`

### `/data/projects.ts`
- **Project opportunities** with client details and requirements  
- 7 projects across different industries and priorities
- Helper functions for filtering by priority, industry, skills
- Status types: `Open`, `Closed`

### `/data/allocations.ts`
- **Project allocations** linking employees to projects
- Active and historical allocation records
- Helper functions for finding allocations by project or employee
- Allocation types: `Full-time`, `Part-time`, `Extra`

### `/data/matches.ts`
- **AI matching suggestions** between employees and projects
- Match scores (0-100) with detailed breakdowns
- **Alerts and notifications** for proactive insights
- Alert types: `roll_off`, `project_gap`, `allocation_suggestion`, etc.

### `/data/notifications.ts`
- **In-app notifications** for managers and employees
- Priority levels and read/unread status
- Action URLs for deep linking

### `/data/metadata.ts`
- **Skills catalog** organized by categories
- **Industry and geography** reference data
- **App configuration** and utility functions
- Helper functions for dropdowns and filters

### `/data/index.ts`
- Central export file for easy imports
- Mock API responses for development
- Sample dashboard statistics

## Usage Examples

```typescript
// Import specific data sets
import { employeesData, getAvailableEmployees } from '@/data/employees';
import { projectsData, getUrgentProjects } from '@/data/projects';
import { getMatchSuggestions } from '@/data/matches';

// Import everything from central file
import { 
  employeesData, 
  projectsData, 
  skillsData,
  mockAuthUser 
} from '@/data';

// Use helper functions
const availableEngineers = getAvailableEmployees();
const urgentProjects = getUrgentProjects();
const matchSuggestions = getMatchSuggestions(456); // project ID
```

## Key Features

### Realistic Data
- Diverse employee profiles across different time zones
- Projects with varying priorities and requirements
- Realistic matching scores and explanations

### Helper Functions
- Pre-built filtering functions for common UI scenarios
- Status and priority utilities with color coding
- Date-based calculations for roll-offs and deadlines

### TypeScript Support
- Full type definitions for all data structures
- Proper interfaces matching API specifications
- Type-safe helper functions

### UI-Focused
- Avatar placeholders for employee photos
- Status indicators with semantic colors
- Progress tracking for projects
- Notification states and priorities

## Development Workflow

1. **Start with dummy data** for rapid UI development
2. **Build components** using the helper functions
3. **Test different scenarios** using the various data states
4. **Replace with API calls** when backend is ready

## Data Scenarios Covered

- **Available employees** ready for new projects
- **Rolling off employees** ending contracts soon  
- **High-priority projects** needing immediate attention
- **Perfect matches** with high confidence scores
- **Critical alerts** requiring manager action
- **Cross-timezone teams** for global projects

This dummy data enables full UI development without backend dependencies while maintaining realistic data relationships and business logic.
