# Talent Fit Platform – Refined Challenge Brief

## 1. Problem Summary
Current engineer ↔ opportunity matching relies on a large spreadsheet. It is manual, error‑prone, slow to query, and does not surface proactive insights (upcoming roll‑offs, strong matches, missing data).

## 2. Goal
Build an internal prototype web app that centralizes engineer data, enables fast search/filter, and uses AI to recommend & explain matches between engineers and client opportunities.

## 3. Primary Users
- Talent / Delivery Managers (core user)
- Engineering Leadership (roll-off forecasting)
- (Optional later) Sales / Account Managers

## 4. Core Use Cases (MVP)
1. View list of engineers with key attributes (status, skills, geo, availability dates).
2. Filter/search by: skill, role (FE/BE/Fullstack), availability window, country/time zone, industry experience.
3. View engineer profile details (skills, history, notes).
4. Add / edit engineer records (mock/sample data only).
5. Create & manage “opportunity” records (role requirements, tech stack, industry, urgency).
6. AI: Suggest top N engineers for an opportunity (with reasoning).
7. AI: Flag engineers rolling off soon (next X weeks).
8. Authentication: Google SSO (internal only).
9. Basic notifications (in-app list or simple email/Slack simulation).

## 5. Stretch Features (Optional)
- AI: Explain gaps (e.g., “Missing secondary stack”, “No industry tag”).
- Data quality score per engineer.
- Duplicate detection (fuzzy name/email).
- Slack webhook integration.
- Utilization dashboard (available vs. booked vs. rolling-off).
- “What-if” scenario (e.g., if contract ends early).

## 6. Key Data Fields (MVP)
Engineer:
- id, name, email, country, timezone, employmentType (FT/Contract), currentClient, status (available / rolling_off / allocated / bench), primarySkills[], secondarySkills[], skillLevel (optional), industryExperience[], lastDay (if rolling off), expectedEndDate, noticeDate, notes, utilization %, targetRate (optional), updatedAt.

Opportunity:
- id, clientName, roleTitle, requiredSkills[], niceToHaveSkills[], roleType (FE/BE/Fullstack), industry, geoPreference, startDateTarget, duration, priority (low/med/high), notes, createdAt, status (open/matched/closed).

Match Record (system generated):
- id, opportunityId, engineerId, score (0–100), explanation, createdAt.

## 7. Matching Logic (Baseline → AI)
Baseline scoring (deterministic):
- Skill overlap (weight 50%)
- Availability window (20%)
- Role type alignment (10%)
- Industry experience overlap (10%)
- Geo/timezone compatibility (10%)

AI enhancement:
Use embedding similarity or LLM prompt to re-rank top candidates and generate explanation (e.g., “Matches 4/5 core skills, available in 10 days, prior fintech experience”).

## 8. AI Ideas (Prompt Concepts)
- “Given engineer JSON and opportunity JSON, produce: score (0–100) + 2-sentence rationale.”
- “Given list of engineers, flag any with missing 'industryExperience' or 'expectedEndDate'.”
- “Given all engineers, list those rolling off in next 21 days.”

## 9. Screens (MVP)
1. Login (Google SSO)
2. Engineer List + Filters
3. Engineer Detail
4. Opportunity List
5. Opportunity Detail (with suggested matches)
6. Matches / Recommendations panel
7. Roll-Off / Alerts dashboard
8. Data Quality panel (stretch)

## 10. Navigation IA
Top Nav: Engineers | Opportunities | Matches | Alerts | (Optional) Data Quality | Logout

## 11. Non-Functional (Prototype Level)
- Fast search (client-side or simple API filtering).
- Seed mock data JSON or in-memory DB (SQLite / Postgres optional).
- Clear separation: API (Go) + Web (Next.js).
- Auth gate at edge (middleware) via Google OAuth.
- Basic audit: updatedAt field.

## 12. Success Indicators (Demo Criteria)
- Can demo: create/update engineer + opportunity.
- Show AI-produced match list & explanation.
- Show roll-off alert list.
- Filter by skills + availability.
- Auth prevents anonymous access.

## 13. Suggested Tech Stack
- Backend: Go (REST or GraphQL) + simple in-memory or SQLite.
- Frontend: Next.js (App Router), Tailwind.
- Auth: NextAuth.js with Google provider (frontend) or custom OIDC + session.
- AI: OpenAI / Anthropic / local embedding (if allowed).
- Matching: initial deterministic + AI re-rank function.

## 14. API Endpoints (Example)
GET /api/engineers  
POST /api/engineers  
GET /api/engineers/:id  
GET /api/opportunities  
POST /api/opportunities  
GET /api/opportunities/:id/matches  
GET /api/alerts/rolloffs  
GET /api/data-quality (stretch)

## 15. Backlog (Prioritized)
P1:
- Auth (Google SSO)
- Engineer CRUD + list filters
- Opportunity CRUD
- Basic deterministic matching
- Roll-off alert logic
- UI pages (core 5 screens)

P2:
- AI re-rank & explanation
- Match persistence
- Notifications panel

P3 (Stretch):
- Data quality scoring
- Slack/email integration
- Duplicate detection

## 16. Sample Matching Pseudocode
```
score = skillOverlap*0.5 + availabilityFit*0.2 + roleMatch*0.1 + industryOverlap*0.1 + geoFit*0.1
```

## 17. Out of Scope (For Now)
- Real HRIS / ATS integration
- Billing / invoicing
- Complex permission tiers
- Full analytics suite

## 18. Demo Script (Suggested)
1. Login (Google SSO)
2. Show engineer list → filter by “Python” + “Available Soon”
3. Open opportunity “Fintech Backend API”
4. Click “Generate Matches” → show scores + AI explanations
5. Show “Roll-Offs in Next 21 Days”
6. (Optional) Show data quality flags

---

End of refined challenge brief.
