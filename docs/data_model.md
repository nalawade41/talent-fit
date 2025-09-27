# Data Model (data_model.md)

## User

- id (PK)
- name
- email
- role (Employee, Manager)
- type (Frontend Dev, Backend Dev, Fullstack Dev, AI, UI, UX, Tester, Manager, Architect, Scrum
  Master)

## EmployeeProfile

- userId (FK: User.id)
- geo
- dateOfJoining
- endDate
- noticeDate
- skills [list]
- yearsOfExperience
- industry
- availabilityFlag (boolean)

## Project

- id (PK)
- name
- description
- requiredSeats (int)
- seatsByType { key: type, value: int }
- startDate
- endDate
- status (Open, Closed)

## ProjectAllocation

- id (PK)
- projectId (FK: Project.id)
- employeeId (FK: User.id)
- allocationType (Full-time, Part-time, Extra)
- startDate
- endDate (nullable)

## Notifications

- id (PK)
- type (Roll-off Alert, Project Gap, Allocation Suggestion)
- message
- userId (FK: User.id)
- createdAt
