# ui_prompt.md

## Overview
Generate a **modern, responsive React + TypeScript UI** for **Talent Fit**, an AI-powered talent matching platform. Use **React + TypeScript + TailwindCSS + shadcn/ui**. Keep code modular and reusable.

---

## Full Prompt
Use this for end-to-end generation of the app UI.

---

## Feature-Specific Prompts

### 🔹 Authentication & Navigation Prompt
- Google SSO login page (clean, minimal)
- Role-based navigation (Employee vs Manager)
- **Employee Navigation**: `Projects | Profile | Logout`
- **Manager Navigation**: `Projects | Alerts | Logout`
- Collapsible sidebar for mobile

---

### 🔹 Employee Dashboard Prompt
- **Project List**: show all projects employee is working on
- **Profile Management**:
  - Editable profile info (name, email, location, skills)
  - Profile picture upload
  - If no picture uploaded, fetch a random avatar from an open API (like [https://picsum.photos](https://picsum.photos) or similar)
- **Logout Button**

---

### 🔹 Manager Dashboard Prompt
- **Projects**:
  - List, create, view, and update projects
  - Card/table views with status indicators
- **Alerts Section**:
  - Roll-off alerts
  - Project gaps
  - Data quality notifications
- **Employee Management**:
  - View employees assigned to them
  - Display hierarchy tree with dummy data (sample visualization only)
- **Logout Button**

---

### 🔹 Project Management Prompt
- Project list (table + card view)
- Create project form (client, role, skills, geo, start date, duration, priority)
- Project detail page:
  - Info panel
  - AI match suggestions with scores + explanations
  - Allocated team member cards
  - Timeline of milestones

---

### 🔹 Engineer Profile Prompt
- Personal info (name, email, location, timezone)
- Professional details (skills, industries, clients)
- Availability status + end dates
- Project history timeline
- Utilization chart (Recharts)
- Profile picture (uploaded or random API fallback)

---

### 🔹 AI Matching Prompt
- Side-by-side comparison of engineer vs project
- Match score breakdown with percentages
- Natural language AI explanation
- Actions: Allocate, Save, Request info

---

### 🔹 Alerts & Notifications Prompt
- Alert dashboard with priority levels
- Roll-off alerts with countdowns
- Project gaps (unfilled positions)
- Data quality issue indicators
- In-app toast notifications

---

## Shared Design & UX Guidelines
- **Colors**: Blues/grays, accents (Green=Available, Yellow=Rolling off, Red=Urgent)
- **Typography**: Inter or similar
- **Principles**: Mobile-first, accessibility, skeleton loaders, optimistic updates
- **Components**: Multi-select tags, date range pickers, charts, interactive tables, drag-and-drop, timelines

---

## Data Models (TypeScript)
```ts
interface Employee {
  id: string;
  name: string;
  email: string;
  country: string;
  status: 'available' | 'rolling_off' | 'allocated' | 'bench';
  primarySkills: string[];
  secondarySkills: string[];
  industryExperience: string[];
  availability: {
    lastDay?: string;
    expectedEndDate?: string;
  };
  utilizationPct: number;
  profilePicUrl?: string; // uploaded or fallback from random API
}

interface Project {
  id: string;
  clientName: string;
  roleTitle: string;
  requiredSkills: string[];
  roleType: 'Frontend' | 'Backend' | 'Fullstack';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'matched' | 'closed';
}

interface Match {
  engineerId: string;
  score: number;
  explanation: string;
}
```

---

## User Flows
1. Employee logs in → views assigned projects → edits profile → uploads profile pic (or sees random avatar)
2. Manager logs in → creates project → AI suggests engineers → reviews matches → allocates
3. Manager views alerts → sees roll-off warning → checks hierarchy tree of employees → plans replacement

