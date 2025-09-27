# AI Features

## Matching Logic
- Input: Project (required skills, role type, start/end dates).
- Output: Ranked list of employees by suitability.

### Matching Criteria
1. Skill overlap (primary weight).
2. Availability (endDate == null or ending soon).
3. Geo match.
4. Industry experience relevance.
5. Employee availability flag (extra time).

### Ranking Explanation
- AI provides a short justification:  
  Example → "Matched because engineer has React + Node skills, available in 2 weeks, and located in the same geo."

## Proactive Insights
- Identify employees rolling off within the next X days.
- Flag projects with unallocated seats.
- Suggest reallocation of under-utilized employees.

## Data Cleanup (Optional)
- Detect missing skills, duplicate profiles, or inconsistent dates.