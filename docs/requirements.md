# Requirements (requirements.md)

## General
- Google Single Sign-On (SSO).
- Role-based access control: Employee, Manager.

## Employee
- Maintain personal details: Geo, Date of Joining, End Date, Notice Date.
- Maintain professional details: Type, Skills, Years of Experience, Industry.
- Availability flag for extra work.
- View assigned projects with end dates.

## Manager
### Dashboard
- Quick filters to view:
  - Engineers by Skills, Geo, and Availability.
  - Upcoming projects.

### Projects
- Create new projects:
  - Fields: Name, Description/JD, Required Seats, Seats by Type, Start Date, End Date.
- Allocate resources:
  - Manual selection or AI-powered suggestions based on skills and availability.
  - Track allocation type and role type.
- Release employees from projects with end dates.
- Update/close projects:
  - Modify End Date.
  - Adjust Required Seats (upsell).

## AI Features
- Match engineers ↔ projects based on skills, role type, and availability.
- Rank matches with reasoning.
- Proactive alerts for:
  - Employees rolling off soon.
  - Projects missing allocations.