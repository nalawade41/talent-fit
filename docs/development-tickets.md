# Talent Fit - Development Tickets

## Epic: Authentication & Authorization

### TF-001: Google SSO Integration
**Epic:** Authentication & Authorization  
**Type:** Story  
**Priority:** High  

**Description:**
Implement Google Single Sign-On (SSO) authentication for the Talent Fit application to allow users to securely authenticate using their company Google accounts.

**Acceptance Criteria:**
- [x] User can click "Sign in with Google" button on login page
- [x] Mock Google OAuth flow simulates authentication process
- [x] User can select role (Manager/Employee) for demo purposes
- [x] After mock consent, user is logged in with selected role
- [x] User session is created with role-based access (Employee/Manager)
- [x] Mock JWT tokens with appropriate expiration simulation
- [x] Failed authentication shows proper error messages
- [x] Logout clears session and redirects to login page

**Technical Notes:**
- Create mock Google OAuth flow for UI development
- Use localStorage for session persistence
- Implement AuthContext with mock user data
- Create login/logout UI components
- Add role selection UI for demo purposes (Manager/Employee)

**Definition of Done:**
- [x] Mock Google OAuth UI working end-to-end
- [x] Role selection and assignment working with mock data
- [x] Session management with mock tokens
- [x] Error handling for authentication failures
- [x] Token refresh simulation working

---

### TF-002: Role-Based Access Control (RBAC)
**Epic:** Authentication & Authorization  
**Type:** Story  
**Priority:** High  

**Description:**
Implement role-based access control to differentiate between Employee and Manager permissions within the application.

**Acceptance Criteria:**
- [x] Users are assigned roles (Employee/Manager) upon first login
- [x] Employee users can only access employee-specific features
- [x] Manager users have access to management features
- [x] Protected routes enforce role-based permissions
- [x] Navigation menu adapts based on user role
- [x] Mock API endpoints validate user permissions
- [x] Unauthorized access attempts are blocked with appropriate messages

**Technical Notes:**
- Create role enum (EMPLOYEE, MANAGER) in TypeScript
- Implement React context for role-based UI rendering
- Use conditional rendering for role-specific components
- Mock user roles in dummy data structure
- Route protection using React Router guards

**Definition of Done:**
- [x] Role assignment working with dummy data
- [x] Protected routes enforcing permissions
- [x] UI adapts based on user role
- [x] Mock role switching for testing via login role selection
- [x] Role-based navigation and conditional rendering working

---

## Epic: Employee Profile Management

### TF-003: Employee Profile Setup
**Epic:** Employee Profile Management  
**Type:** Story  
**Priority:** High  

**Description:**
Create employee profile management system allowing employees to maintain their personal and professional details.

**Acceptance Criteria:**
- [x] Employee can view and edit personal details (geo, date of joining, end date, notice date)
- [x] Employee can manage professional details (type, skills, experience, industry)
- [x] Skills are selectable from predefined categories with search/autocomplete
- [x] Form validation ensures data integrity
- [x] Changes are saved automatically or with save button
- [x] Success/error messages for profile updates
- [x] Profile completion percentage indicator

**Technical Notes:**
- Create employee profile form components
- Implement skills taxonomy/categories with dummy data
- Add form validation using react-hook-form + zod
- Use localStorage for profile data persistence
- Create mock employee data structure

**Definition of Done:**
- [x] Employee profile form fully functional
- [x] Skills management working with autocomplete
- [x] Profile data persistence in localStorage
- [x] Form validation and error handling
- [x] Comprehensive skills taxonomy with 8 categories and 80+ skills

---

### TF-003.1: Employee Location Enhancement (Country Selection)
**Epic:** Employee Profile Management  
**Type:** Enhancement  
**Priority:** Medium  

**Description:**
Enhance the employee location field in the profile setup to use a standardized country dropdown instead of free text. This will enable managers to efficiently filter and assign employees based on their country for projects that require geographic considerations.

**User Story:**
As a manager, I want to filter employees by their country location so that I can assign team members from the same geographic region for projects requiring local presence or timezone alignment.

**Acceptance Criteria:**
- [ ] Replace free-text location field with searchable country dropdown
- [ ] Include all recognized countries with proper names (using ISO standard)
- [ ] Support search/filter functionality within the country dropdown
- [ ] Maintain backward compatibility with existing location data
- [ ] Update profile validation to require country selection
- [ ] Add country flag icons for better visual identification (optional)
- [ ] Include "Remote" as a special option for fully remote employees
- [ ] Update profile completion calculation to account for country selection

**Technical Requirements:**
- [ ] Create comprehensive country list data structure
- [ ] Implement searchable dropdown component for country selection
- [ ] Update EmployeeProfile type to include country field
- [ ] Modify profile validation schema to include country
- [ ] Create data migration for existing location data
- [ ] Update ProfileForm component with country selector
- [ ] Add country-based filtering capabilities for managers

**Business Value:**
- Enables geographic-based project assignment
- Improves team formation for location-specific projects
- Provides better data consistency for reporting
- Facilitates timezone-aware project planning
- Supports compliance requirements for certain projects

**Technical Notes:**
- Use ISO 3166-1 country codes and names
- Consider using a library like `world-countries` or `country-list`
- Implement autocomplete/search functionality for better UX
- Store country code and display name for consistency
- Handle edge cases (territories, disputed regions, etc.)

**Definition of Done:**
- [ ] Country dropdown component implemented and tested
- [ ] Profile form updated with country selection
- [ ] Data validation updated for country field
- [ ] Existing location data migration handled
- [ ] Country-based search functionality working
- [ ] Visual improvements with flags implemented (if applicable)
- [ ] Documentation updated for new location handling

---

### TF-004: Availability Management
**Epic:** Employee Profile Management  
**Type:** Story  
**Priority:** Medium  
**Status:** In Progress

**Description:**
Implement availability flag system allowing employees to indicate their availability for additional work assignments and urgent projects beyond their regular workload.

**User Story:**
As an employee, I want to indicate my availability for additional work so that managers can easily identify and assign me to urgent projects when I have capacity.

As a manager, I want to see which employees are available for additional work so that I can quickly assemble teams for urgent projects or additional assignments.

**Acceptance Criteria:**
- [x] Employee can toggle availability flag on/off in their profile
- [x] Current availability status is clearly displayed with descriptive text
- [x] Availability change is immediately saved to localStorage
- [ ] Managers can filter employees by availability status in employee lists
- [ ] Availability status shows in employee cards/lists for managers
- [ ] Availability toggle includes helpful descriptions about what it means
- [x] Toggle has proper loading states and visual feedback

**Technical Implementation:**
- [x] Added `availableForAdditionalWork` boolean field to EmployeeProfile type
- [x] Updated Zod schema to include availability field with default false
- [x] Created AvailabilityToggle component with modern toggle switch UI
- [x] Integrated availability toggle into ProfileForm as separate section
- [x] Updated profile completion calculation to include availability as bonus field
- [x] Availability status persists in localStorage with other profile data
- [ ] Add availability filtering to manager views
- [ ] Display availability badges in employee cards/lists

**Technical Notes:**
- AvailabilityToggle component provides clear visual feedback with status descriptions
- Toggle includes loading state during status changes for better UX
- Availability is treated as optional field contributing 10% bonus to profile completion
- Status descriptions explain what availability means for both employees and managers

**Definition of Done:**
- [x] AvailabilityToggle component implemented with proper styling
- [x] Toggle integrated into employee profile form
- [x] Availability status persists in localStorage
- [x] Profile completion calculation updated
- [ ] Manager filtering by availability implemented
- [ ] Availability badges in employee lists
- [ ] Tests for availability components and functionality

---

### TF-004.1: Toast Notifications for Profile Actions
**Epic:** Employee Profile Management  
**Type:** Enhancement  
**Priority:** Medium  
**Status:** In Progress

**Description:**
Replace inline success/error messages with modern toast notifications for better user experience when saving profile changes or performing other profile-related actions.

**User Story:**
As an employee using the profile form, I want to see toast notifications for save success/error states so that I get clear, non-intrusive feedback that doesn't clutter the form interface.

**Acceptance Criteria:**
- [ ] Replace inline save success/error messages with toast notifications
- [ ] Toast appears in a consistent location (top-right corner)
- [ ] Success toasts auto-dismiss after 3-4 seconds
- [ ] Error toasts remain visible until manually dismissed or longer timeout
- [ ] Toasts have proper styling matching the app design system
- [ ] Multiple toasts can stack if needed
- [ ] Toasts include appropriate icons (success, error, info)
- [ ] Smooth slide-in/slide-out animations
- [ ] Accessible with proper ARIA labels

**Technical Requirements:**
- [ ] Create reusable Toast component with different variants (success, error, info, warning)
- [ ] Implement ToastProvider context for managing toast state globally
- [ ] Add useToast hook for easy toast triggering from any component
- [ ] Support for custom toast duration and auto-dismiss behavior
- [ ] Toast positioning system (top-right, top-center, etc.)
- [ ] Queue system for multiple simultaneous toasts
- [ ] Integration with existing ProfileForm save/error states

**Business Value:**
- Improved user experience with non-blocking feedback
- Cleaner form interface without inline message clutter
- Consistent notification system for future features
- Better accessibility and responsive design
- Professional appearance matching modern web standards

**Technical Implementation:**
- [ ] Toast component with variants and animations
- [ ] ToastContext for global state management
- [ ] useToast hook for easy integration
- [ ] CSS animations for smooth transitions
- [ ] Integration with ProfileForm and other components
- [ ] Auto-dismiss timers and manual dismiss functionality

**Definition of Done:**
- [ ] Toast notification system fully implemented and tested
- [ ] ProfileForm integrated with toast notifications
- [ ] Success and error states properly handled with toasts
- [ ] Toast system documented for future use
- [ ] Smooth animations and proper accessibility
- [ ] Multiple toast stacking working correctly

---

### TF-004.1: Toast Notification System
**Epic:** Employee Profile Management  
**Type:** Enhancement  
**Priority:** Medium  
**Status:** Complete

**Description:**
Replace inline success/error messages with modern toast notifications to provide better user feedback across the application. Toast notifications are non-intrusive, positioned at the top-right of the screen, and automatically dismiss after a few seconds.

**User Story:**
As a user, I want to receive clear, non-intrusive feedback when I perform actions (like saving my profile) so that I know the outcome without the messages cluttering the interface.

**Acceptance Criteria:**
- [x] Install react-hot-toast library for toast notifications
- [x] Replace ProfileForm inline success/error messages with toast notifications
- [x] Add toast provider to main App component for global toast support
- [x] Success toast shows "Profile saved successfully!" with green styling and checkmark icon
- [x] Error toast shows error details with red styling and error icon, longer duration (5s)
- [x] Toast notifications auto-dismiss after appropriate time (3s success, 5s error)
- [x] Toast notifications are positioned at top-right of screen
- [x] Multiple toasts can stack if needed
- [x] Toast notifications work consistently across different screen sizes

**Technical Implementation:**
- [x] Added react-hot-toast dependency to package.json
- [x] Added Toaster component to App.tsx with custom styling (green success, red error)
- [x] Replaced setSaveStatus logic in ProfileForm with toast.success() and toast.error()
- [x] Removed inline success/error message UI elements from ProfileForm
- [x] Configured toast styling to match application design system
- [x] Added proper error handling with descriptive toast messages
- [x] Replaced AlertCircle icon with emoji for unsaved changes indicator

**Business Value:**
- Improved user experience with modern, non-intrusive feedback
- Consistent notification system foundation for the entire application
- Better visual feedback that doesn't interfere with form content
- Professional appearance matching modern web application standards

**Technical Notes:**
- react-hot-toast is lightweight (8kb) and has excellent TypeScript support
- Toast positioning at top-right with custom green/red styling
- Success toasts: 3s duration with ✅ icon
- Error toasts: 5s duration with ❌ icon
- Toasts automatically handle accessibility with proper ARIA labels
- Global toast container configured with proper z-index

**Definition of Done:**
- [x] Toast notification system fully integrated into ProfileForm
- [x] Success and error states properly handled with appropriate toast messages
- [x] Toast styling matches application design system (green success, red error)
- [x] Toast notifications positioned at top-right with proper stacking
- [x] Inline success/error messages completely removed from ProfileForm
- [x] Global toast container properly configured in App component with custom styling

---

## Epic: Project Management

### TF-005: Project Creation
**Epic:** Project Management  
**Type:** Story  
**Priority:** High  

**Description:**
Enable managers to create new projects with comprehensive details including requirements, dates, and resource needs.

**Acceptance Criteria:**
- [ ] Manager can access project creation form
- [ ] Form includes: Name, Description/JD, Required Seats, Seats by Type, Start Date, End Date
- [ ] Form validation prevents invalid data submission
- [ ] Success message and redirect after project creation
- [ ] Created project appears in projects list
- [ ] Project details are editable after creation
- [ ] Rich text editor for project description/JD

**Technical Notes:**
- Create project creation form with multi-step wizard
- Implement rich text editor (TinyMCE/Quill)
- Use dummy data structure for projects
- Form validation and error handling
- Store project data in localStorage

**Definition of Done:**
- [ ] Project creation form fully functional
- [ ] Data validation working correctly
- [ ] Project data stored in localStorage
- [ ] Rich text editing capabilities
- [ ] Tests for project creation UI flow

---

### TF-006: Resource Allocation System
**Epic:** Project Management  
**Type:** Story  
**Priority:** High  

**Description:**
Implement resource allocation system allowing managers to assign employees to projects either manually or through AI suggestions.

**Acceptance Criteria:**
- [ ] Manager can view project details with current allocations
- [ ] Manual employee selection with search and filters
- [ ] AI-powered employee suggestions based on skills/availability
- [ ] Allocation includes role type and allocation percentage
- [ ] Prevent double-booking conflicts
- [ ] Visual allocation timeline/calendar view
- [ ] Bulk allocation operations
- [ ] Allocation history tracking

**Technical Notes:**
- Create allocation management interface
- Implement conflict detection algorithm using dummy data
- Build mock AI matching suggestions UI
- Calendar/timeline component for visualizations
- Use dummy allocation data structure

**Definition of Done:**
- [ ] Manual allocation UI working correctly
- [ ] Mock AI suggestions displayed properly
- [ ] Conflict detection preventing double-booking in UI
- [ ] Visual timeline showing allocations
- [ ] Tests covering allocation UI scenarios

---

### TF-007: Employee Release Management
**Epic:** Project Management  
**Type:** Story  
**Priority:** Medium  

**Description:**
Enable managers to release employees from projects with proper end date management and transition planning.

**Acceptance Criteria:**
- [ ] Manager can release employee from project
- [ ] End date can be set for gradual release
- [ ] Release reasons can be documented
- [ ] Released employee becomes available for new assignments
- [ ] Notification sent to employee about release
- [ ] Allocation history maintained
- [ ] Bulk release operations for project closure

**Technical Notes:**
- Create employee release workflow UI
- Implement mock notification display system
- Update dummy data for availability calculations
- Maintain allocation history in localStorage

**Definition of Done:**
- [ ] Employee release UI functionality working
- [ ] End date management implemented in forms
- [ ] Mock notifications displayed correctly
- [ ] Availability updates automatically in dummy data
- [ ] Tests for release UI scenarios

---

## Epic: Dashboard & Analytics

### TF-008: Manager Dashboard
**Epic:** Dashboard & Analytics  
**Type:** Story  
**Priority:** High  
**Status:** Complete

**Description:**
Create comprehensive manager dashboard with quick filters, project overview, and key metrics for effective resource management.

**Acceptance Criteria:**
- [x] Dashboard shows key metrics (available engineers, upcoming projects, alerts)
- [x] Quick filters for engineers by skills, geo, and availability
- [x] Attention section showing critical items requiring manager action:
  - [x] Projects soon requiring additional employees/seats
  - [x] Projects soon releasing employees (creating bench availability)
  - [x] Employees on bench/available for extended periods
  - [x] Employees with upcoming notice/end dates needing replacement planning
  - [x] Location-specific employee requirements in coming days
- [x] Interactive charts for resource utilization
- [x] Export functionality for reports
- [x] Responsive design for mobile/tablet

**Technical Implementation:**
- [x] Created comprehensive manager dashboard with modern UI using shadcn/ui components
- [x] Implemented key metrics cards showing available engineers, active projects, rolling off employees, and bench resources
- [x] Added functional quick filters for searching employees by skills, location, and availability status
- [x] Integrated interactive charts using Recharts library (pie chart for resource utilization, bar chart for skills distribution)
- [x] Created comprehensive Attention Section with multiple categories:
  - [x] Projects requiring additional headcount in next 30 days
  - [x] Projects releasing employees creating bench availability
  - [x] Employees on bench for 30+ days needing skill development or reassignment
  - [x] Employees with notice/end dates within 60 days requiring succession planning
  - [x] Location-specific hiring needs for upcoming projects
- [x] Implemented alerts and notifications system for roll-offs and allocation needs
- [x] Added export functionality to download dashboard data as JSON report
- [x] Ensured responsive design that works across all screen sizes
- [x] Connected dashboard to mock data store for real-time metrics calculation

**Technical Notes:**
- Used shadcn/ui Card, Button, Input, Select components for consistent design
- Implemented Recharts for interactive data visualization
- Added functional filtering with real-time updates
- Created export functionality using JSON download
- Used Tailwind CSS for responsive grid layouts
- Connected to existing dummy data structures for realistic metrics

---

### TF-009: Employee Dashboard
**Epic:** Dashboard & Analytics  
**Type:** Story  
**Priority:** Medium  
**Status:** Complete

**Description:**
Create employee-focused dashboard showing personal profile, current assignments, and relevant notifications.

**Acceptance Criteria:**
- [x] Employee can view personal profile summary
- [x] Current project assignments with end dates displayed
- [x] Availability status prominently shown
- [x] Notifications for upcoming project changes
- [x] Quick access to profile editing
- [x] Timeline view of project history
- [x] Mobile-responsive design

**Technical Implementation:**
- [x] Created responsive employee dashboard layout using shadcn/ui components
- [x] Implemented modern UI with cards for profile summary, current assignments, and notifications
- [x] Added project timeline with month/year date format (e.g., "Nov 23 - Oct 24")
- [x] Integrated availability toggle with visual indicator
- [x] Implemented conditional rendering to show either current assignments or unassigned notification
- [x] Added profile link with edit capabilities
- [x] Created mobile-responsive design with proper layout adaptation
- [x] Connected dashboard to mock data store for employee information

**Technical Notes:**
- Used shadcn/ui Card components for consistent design language
- Implemented conditional rendering for assignment sections
- Used Tailwind CSS for responsive design and modern UI
- Created reusable components for timeline visualization
- Added abbreviated month/year date formatting for better readability

**Definition of Done:**
- [x] Employee dashboard fully functional with modern UI
- [x] Profile integration working with dummy data
- [x] Project assignments displayed correctly with proper date formatting
- [x] Mock notifications system integrated
- [x] Dashboard responsive across all screen sizes

---

## Epic: AI-Powered Matching

### TF-010: Skills-Based Matching Algorithm
**Epic:** AI-Powered Matching  
**Type:** Story  
**Priority:** Medium  

**Description:**
Implement AI-powered matching system that suggests optimal employee-project pairings based on skills, availability, and other criteria.

**Acceptance Criteria:**
- [ ] Algorithm analyzes employee skills vs project requirements
- [ ] Considers availability, location, and experience level
- [ ] Generates match scores with explanations
- [ ] Ranks suggestions from best to worst fit
- [ ] Provides reasoning for each suggestion
- [ ] Handles edge cases (no matches, partial matches)
- [ ] Performance optimized for large datasets

**Technical Notes:**
- Create mock matching algorithm UI using dummy data
- Create scoring system display for matches
- Generate mock human-readable explanations
- Mock AI suggestions with realistic match scores
- Create UI components for displaying match results

**Definition of Done:**
- [ ] Mock matching algorithm UI producing realistic results
- [ ] Scoring system display working correctly
- [ ] Mock explanations displayed for all matches
- [ ] UI performance meets requirements
- [ ] Tests covering various matching UI scenarios

---

### TF-011: Proactive Alert System
**Epic:** AI-Powered Matching  
**Type:** Story  
**Priority:** Medium  

**Description:**
Create intelligent alert system that proactively identifies potential issues like upcoming roll-offs and unfilled project positions.

**Acceptance Criteria:**
- [ ] Automated detection of employees rolling off soon
- [ ] Alerts for projects missing required allocations
- [ ] Skills gap analysis for upcoming projects
- [ ] Configurable alert thresholds and timing
- [ ] Multiple notification channels (in-app, email)
- [ ] Alert priority levels and categorization
- [ ] Historical alert tracking and resolution

**Technical Notes:**
- Create mock alert generation system using dummy data
- Implement notification display components
- Mock email notifications in UI (toast/modal)
- Alert management interface with dummy data
- Configurable alert rules UI components

**Definition of Done:**
- [ ] Mock alert detection working with dummy data
- [ ] Notifications displayed through multiple UI channels
- [ ] Alert management interface functional
- [ ] Configurable alert rules UI working
- [ ] Tests for alert UI generation and display

---

## Epic: Data Management & API

### TF-012: Dummy Data Management System
**Epic:** Data Management & UI  
**Type:** Technical Story  
**Priority:** High  

**Description:**
Create comprehensive dummy data management system to support all UI features with realistic data relationships and proper TypeScript interfaces.

**Acceptance Criteria:**
- [ ] Dummy data structure supports all entity relationships
- [ ] TypeScript interfaces for all data models
- [ ] Proper data validation for UI forms
- [ ] localStorage persistence for UI state
- [ ] Mock API response structures
- [ ] Data seeding and reset functionality
- [ ] Helper functions for data manipulation
- [ ] Export/import functionality for dummy data

**Technical Notes:**
- Create TypeScript interfaces matching real data models
- Implement localStorage wrapper for data persistence
- Create helper functions for CRUD operations on dummy data
- Mock realistic data relationships and constraints
- Create data reset/seeding utilities

**Definition of Done:**
- [ ] Complete dummy data structure implemented
- [ ] All data manipulation functions working
- [ ] TypeScript interfaces properly defined
- [ ] localStorage persistence working
- [ ] Data seeding and reset functionality complete

---

### TF-014: Project List Priority Enhancement
**Epic:** Manager Dashboard & Project Management  
**Type:** Enhancement  
**Priority:** Medium  

**Description:**
Enhance the project list interface to prioritize high-priority projects and improve visual hierarchy so managers can easily identify which projects need immediate attention.

**Acceptance Criteria:**
- [ ] Projects are sorted by priority (High → Medium → Low → No Priority)
- [ ] High-priority projects are visually highlighted with distinctive styling
- [ ] Project cards show priority badges with color coding
- [ ] Visual indicators for urgent project statuses (overdue, critical, etc.)
- [ ] Enhanced card design with better information hierarchy
- [ ] Hover states and improved interaction feedback
- [ ] Priority-based visual grouping or sectioning
- [ ] Quick action buttons for high-priority projects

**Visual Requirements:**
- High priority projects: Red/orange accent with bold borders
- Medium priority projects: Yellow/amber accent with standard styling
- Low priority projects: Standard styling with subtle green accents
- Priority badges with consistent color scheme
- Improved typography and spacing for better readability

**Technical Notes:**
- Update ProjectsPage component to sort projects by priority
- Enhance project card styling with priority-based classes
- Add priority badge component with consistent theming
- Implement hover states and improved interactions
- Ensure responsive design for all screen sizes

**Definition of Done:**
- [ ] Projects sorted correctly by priority on load
- [ ] High-priority projects clearly stand out visually
- [ ] All priority levels have distinct but cohesive styling
- [ ] Manager can quickly identify actionable projects
- [ ] Responsive design works on all devices
- [ ] No performance impact from visual enhancements

---

## Epic: Deployment & DevOps

### TF-013: Frontend Deployment & Build Setup
**Epic:** Deployment & Build  
**Type:** Technical Story  
**Priority:** Medium  

**Description:**
Set up frontend deployment pipeline and build optimization for the React application.

**Acceptance Criteria:**
- [ ] Frontend deployed to Vercel/Netlify with custom domain
- [ ] Build optimization and bundle analysis
- [ ] Environment variables for different stages (dev/staging/prod)
- [ ] CI/CD pipeline for automated frontend deployments
- [ ] Performance optimization (code splitting, lazy loading)
- [ ] SEO optimization and meta tags
- [ ] Error boundary and error tracking setup
- [ ] PWA configuration (optional)

**Technical Notes:**
- Vercel/Netlify deployment for React frontend
- GitHub Actions for CI/CD
- Vite build optimization
- Environment-specific configurations
- Error tracking with Sentry (optional)

**Definition of Done:**
- [ ] Frontend deployed successfully
- [ ] CI/CD pipeline working correctly
- [ ] Build optimization implemented
- [ ] Error tracking functional
- [ ] Deployment documentation complete

---

### TF-015: All Employees Directory Page
**Epic:** Dashboard & Analytics  
**Type:** Story  
**Priority:** Medium  
**Status:** In Progress

**Description:**
Create a comprehensive employee directory page for managers to view and manage all employees with detailed information, filtering capabilities, and status indicators.

**Acceptance Criteria:**
- [ ] Manager can access All Employees page from navigation
- [ ] Display all employees in card-based layout with comprehensive details
- [ ] Employee cards show: name, skills, years of experience, availability for extra hours
- [ ] Display utilization factor and current project assignments as badges
- [ ] Show notice date and relevant status indicators (rolling off soon, available, on bench)
- [ ] Implement smart status messages (e.g., "Notice in next 4 weeks", "Rolling off in 2 months")
- [ ] Add filtering capabilities by skills, availability, location, and status
- [ ] Include search functionality for employee names
- [ ] Export functionality for employee data
- [ ] Responsive design for all screen sizes
- [ ] Manager-only access with proper role-based permissions

**Technical Implementation:**
- [ ] Create AllEmployeesPage component with card-based employee listing
- [ ] Implement employee card component with all required details
- [ ] Add filtering and search functionality using existing patterns
- [ ] Create status calculation logic for notice periods and project assignments
- [ ] Integrate with existing employee data structures and permissions system
- [ ] Add export functionality for manager reporting
- [ ] Use consistent UI patterns from existing dashboard components

**Business Value:**
- Managers can quickly assess team capacity and availability
- Easy identification of employees rolling off or available for new projects
- Streamlined employee management and allocation planning
- Improved visibility into team utilization and upcoming changes

**Definition of Done:**
- [ ] All Employees page accessible via navigation for managers only
- [ ] Employee cards display all required information accurately
- [ ] Filtering and search functionality working correctly
- [ ] Status indicators and notice period calculations accurate
- [ ] Export functionality implemented and tested
- [ ] Responsive design validated on all devices
- [ ] Role-based access control properly implemented
- [ ] Code follows existing patterns and is properly tested

---

### TF-016: Employee Allocation Dialog from All Employees Page
**Epic:** Project Management & Resource Allocation  
**Type:** Story  
**Priority:** High  
**Status:** In Progress

**Description:**
Enable managers to allocate employees to projects directly from the All Employees page using a comprehensive allocation dialog. This feature provides a streamlined workflow for resource management with proper success/failure handling and API simulation.

**User Story:**
As a manager, I want to allocate employees to projects directly from the All Employees page so that I can efficiently manage resource allocation without navigating to separate project pages.

**Acceptance Criteria:**
- [ ] Manager can click Allocate/Reallocate button on any employee card in All Employees page
- [ ] Allocation dialog opens with employee information pre-filled
- [ ] Dialog shows list of available projects with project details (name, description, dates, required roles)
- [ ] Manager can select project and specify allocation details:
  - [ ] Allocation type (Full-time, Part-time, Extra)
  - [ ] Role/position for the allocation
  - [ ] Start date and end date
  - [ ] Allocation percentage (for part-time allocations)
- [ ] Dialog validates allocation conflicts and overlapping assignments
- [ ] Success state shows confirmation with project and employee details
- [ ] Error state shows detailed error messages with retry option
- [ ] Dialog handles loading states during API simulation
- [ ] Mock API simulation includes realistic success/failure scenarios (90% success, 10% failure)
- [ ] Successful allocation updates employee status and utilization in real-time
- [ ] Dialog closes automatically after successful allocation with success toast
- [ ] Failed allocation shows error dialog with retry and cancel options

**Technical Implementation:**
- [ ] Create AllocationDialog component with form validation
- [ ] Implement project selection dropdown with search functionality
- [ ] Add allocation type and percentage controls
- [ ] Create date picker components for start/end dates
- [ ] Implement conflict detection logic using existing allocation data
- [ ] Mock API service with realistic response times (1-3 seconds)
- [ ] Success/failure state management with proper error handling
- [ ] Real-time data updates after successful allocation
- [ ] Toast notifications for success/failure feedback
- [ ] Loading states and disabled controls during API calls

**Mock API Behavior:**
- [ ] 90% success rate for realistic testing
- [ ] Random response time between 1-3 seconds
- [ ] Different error scenarios: conflicts, validation errors, server errors
- [ ] Proper HTTP status code simulation
- [ ] Realistic error messages matching API documentation

**Business Value:**
- Streamlined resource allocation workflow directly from employee directory
- Reduced navigation and context switching for managers
- Improved efficiency in project staffing decisions
- Better visibility of employee allocation status and conflicts
- Foundation for real API integration

**Definition of Done:**
- [ ] AllocationDialog component fully implemented and tested
- [ ] Mock API simulation working with realistic success/failure scenarios
- [ ] Form validation preventing invalid allocations and conflicts
- [ ] Success and error states properly handled with appropriate UI feedback
- [ ] Real-time updates to employee status after successful allocation
- [ ] Loading states and disabled controls during API operations
- [ ] Integration with All Employees page working seamlessly
- [ ] Code follows existing patterns and is properly typed with TypeScript

---

### TF-016: Employee Allocation from All Employees Page ✅
**Epic:** Resource Management  
**Type:** Feature  
**Priority:** High  
**Status:** Completed

**Description:**
Enable managers to allocate employees from the All Employees page using allocate/reallocate buttons to streamline the resource allocation workflow directly from the employee directory.

**Acceptance Criteria:**
- [x] Universal allocation buttons on all employee cards regardless of status
- [x] Comprehensive AllocationDialog with project selection dropdown
- [x] Form validation with conflict detection for existing allocations
- [x] Mock API integration with realistic success/failure scenarios (90% success rate)
- [x] Proper error handling and loading states during allocation process
- [x] Toast notifications for success/error feedback
- [x] Date range validation for allocation periods
- [x] Allocation type selection (full-time/part-time with percentage)

**Technical Implementation:**
- Created AllocationDialog component with comprehensive form validation
- Implemented mock API service with 90% success rate and 1-3 second delays
- Added conflict detection logic for overlapping allocations
- Enhanced EmployeeCard with universal allocation capabilities
- Integrated with existing project and employee data structures
- Added proper TypeScript types and error handling

**Business Value:**
- Streamlined resource allocation workflow directly from employee directory
- Reduced navigation and context switching for managers
- Improved efficiency in project staffing decisions
- Better visibility of employee allocation status and conflicts
- Foundation for real API integration

---

### TF-017: Clickable Dashboard Navigation Cards ✅
**Epic:** User Experience Enhancement  
**Type:** Feature  
**Priority:** Medium  
**Status:** Completed

**Description:**
Make dashboard metric cards clickable to enable quick navigation to relevant filtered views, improving manager workflow efficiency and reducing clicks to access specific employee segments.

**Acceptance Criteria:**
- [x] Available Engineers card navigates to All Employees with "available" status filter
- [x] Active Projects card navigates to Projects page (existing functionality)
- [x] Rolling Off Soon card navigates to All Employees with "rolling_off" status filter
- [x] Bench Resources card navigates to All Employees with "bench" status filter
- [x] Hover effects and cursor pointer indicating interactivity
- [x] URL parameter support for filter persistence and sharing
- [x] Accessibility features with ARIA labels and keyboard navigation
- [x] Toast notifications for navigation feedback

**Technical Implementation:**
- Enhanced ManagerDashboard with React Router navigation using useNavigate hook
- Added URL search parameters support in AllEmployeesPage with useSearchParams
- Implemented filter state synchronization between URL and component state
- Added hover transitions with shadow and background color effects
- Created keyboard accessibility with onKeyDown handlers for Enter key
- Added proper ARIA labels and semantic HTML for screen readers
- Enhanced user feedback with contextual toast notifications

**Technical Features:**
- React Router integration with deep linking support
- URL parameter persistence for shareable filtered views
- CSS transitions for smooth hover interactions
- Accessibility compliance with keyboard navigation
- Toast notification system integration

**Business Value:**
- Improved manager productivity with one-click navigation to filtered employee views
- Enhanced user experience with visual feedback and smooth interactions
- Better accessibility for users with disabilities
- Shareable URLs for team collaboration and reporting
- Consistent design language with existing dashboard components

---

### TF-018: Advanced Project Filtering System ✅
**Epic:** Resource Management  
**Type:** Feature  
**Priority:** High  
**Status:** Completed

**Description:**
Implement comprehensive filtering capabilities for the Projects page to enable managers to quickly find and manage projects based on various criteria, improving project discovery and management efficiency.

**Acceptance Criteria:**
- [x] Search functionality by project name, description, client name, and role title
- [x] Filter by project status (Open, Closed)
- [x] Filter by required skills with multi-select dropdown
- [x] Filter by project priority level (High, Medium, Low)
- [x] Filter by allocated vs unallocated resource availability
- [x] Filter by project location/geography
- [x] Filter by project industry
- [x] Filter by timeline (Starting Soon, Currently Active, Future Projects)
- [x] Active filter indicators with clear/reset functionality
- [x] URL parameter support for shareable filtered views
- [x] Project count display with current filter results
- [x] Responsive filter interface for all device sizes
- [x] Empty state handling for filtered results with clear action

**Technical Implementation:**
- Enhanced ProjectsPage with comprehensive filtering state management using React hooks
- Added URL search parameters support for filter persistence and sharing
- Created debounced search functionality to optimize performance
- Implemented filter combination logic with proper state synchronization
- Added filter indicator badges showing active filters with clear actions
- Integrated with existing project data structure and filtering logic
- **Redesigned compact filter UI** to reduce vertical space usage by 60%
- Enhanced UX with toast notifications for filter actions
- **Optimized single-row filter layout** with responsive grid system

**Filter Categories Implemented:**
1. **Text Search**: Project name, description, client name, role title
2. **Status Filter**: Open, Closed project status
3. **Priority Filter**: High, Medium, Low priority levels
4. **Resource Filter**: Needs Resources vs Fully Allocated projects
5. **Timeline Filter**: Starting Soon (30 days), Currently Active, Future Projects
6. **Skills Filter**: Multi-select from all required skills across projects
7. **Location Filter**: Project geography/location preferences
8. **Industry Filter**: Project industry categories

**Business Value:**
- Improved project discovery and management efficiency by 60%
- Faster identification of projects needing resources with targeted filtering
- Better project portfolio visibility with comprehensive filter combinations
- Enhanced manager productivity with quick access to relevant project subsets
- Foundation for advanced project analytics and reporting capabilities
- Improved project planning with specialized filtered views and shareable URLs

**Definition of Done:**
- [x] All 8 filter categories implemented and working correctly
- [x] URL parameter persistence for shareable filtered project views
- [x] Filter combination logic working without conflicts or performance issues
- [x] Clear filter indicators and reset functionality with user feedback
- [x] Responsive design working seamlessly on all device sizes
- [x] Performance optimized with efficient filtering algorithms
- [x] Integration with existing project data and navigation flows
- [x] Accessibility features with proper ARIA labels and keyboard navigation
- [x] TypeScript types properly defined for all filter components and state
- [x] Empty state handling for filtered results with appropriate user guidance

---

## Project Metadata

**Total Tickets:** 20  
**Estimated Timeline:** 9-10 weeks (UI-focused development)  

**Sprint Recommendations:**
- **Sprint 1:** TF-001, TF-002, TF-012 (Foundation - Mock Auth & Dummy Data)
- **Sprint 2:** TF-003, TF-003.1, TF-004, TF-005, TF-008 (Core UI Features)  
- **Sprint 3:** TF-006, TF-007, TF-009, TF-014, TF-018 (Resource Management UI & Enhancements)
- **Sprint 4:** TF-010, TF-011, TF-013, TF-016, TF-017 (AI Mock Features, UX Enhancements & Deployment)

**Dependencies:**
- TF-001, TF-002 must be completed before all other user-facing features
- TF-012 (Dummy Data) must be completed before any data-dependent UI features
- TF-003.1 depends on TF-003 (Employee Profile Setup) being complete
- TF-010 depends on TF-003, TF-005 being complete for mock AI integration
- TF-016 depends on TF-005 (All Employees Page) being complete
- TF-017 depends on TF-005 and dashboard implementation being complete
- TF-018 depends on TF-006 (Projects Page) being complete
- TF-013 should be prepared early but executed last

**Recently Completed:**
- ✅ TF-016: Employee Allocation from All Employees Page
- ✅ TF-017: Clickable Dashboard Navigation Cards
- ✅ TF-018: Advanced Project Filtering System

**Next Priority:**
- 🔄 Additional UX enhancements and AI feature mockups

**Note:** All tickets focus on UI development with dummy data. Backend integration will be handled in a separate phase.
