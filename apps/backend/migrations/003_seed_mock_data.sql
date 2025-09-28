-- Migration: 003_seed_mock_data.sql
-- Description: Seed mock data for testing manager dashboard
-- Notes:
-- - Users: 50 Employees with emails like test_<n>@talentfit.com
-- - Roles covered: Frontend Dev, Backend Dev, Fullstack Dev, AI engineer, UI, UX,
--                  Manual Tester, Automation Tester, Architect, Scrum Master
-- - Projects: 10 projects with staggered dates
-- - Allocations: Mix of active, future ending (rolling off), and bench (no alloc)

BEGIN;

-- 1) Seed Users (50 Employees) and Profiles
-- Clean out previous test data (safe by email prefix)
DELETE FROM project_allocations WHERE employee_id IN (
  SELECT id FROM users WHERE email LIKE 'test_%@talentfit.com'
);
DELETE FROM employee_profiles WHERE user_id IN (
  SELECT id FROM users WHERE email LIKE 'test_%@talentfit.com'
);
DELETE FROM users WHERE email LIKE 'test_%@talentfit.com';

-- Role pool and skills mapping
-- We'll rotate roles to ensure coverage and dashboard diversity

-- Insert 50 users
WITH new_users AS (
  INSERT INTO users (first_name, last_name, email, role)
  SELECT
    'Test' || i::text AS first_name,
    'Employee' || i::text AS last_name,
    'test_' || i::text || '@talentfit.com' AS email,
    'Employee' AS role
  FROM generate_series(1, 50) AS s(i)
  RETURNING id, email
),
role_assignment AS (
  -- Assign roles evenly across 10 categories
  SELECT u.id,
         CASE ((row_number() OVER (ORDER BY u.id) - 1) % 10)
           WHEN 0 THEN 'Frontend Dev'
           WHEN 1 THEN 'Backend Dev'
           WHEN 2 THEN 'Fullstack Dev'
           WHEN 3 THEN 'AI engineer'
           WHEN 4 THEN 'UI'
           WHEN 5 THEN 'UX'
           WHEN 6 THEN 'Manual Tester'
           WHEN 7 THEN 'Automation Tester'
           WHEN 8 THEN 'Architect'
           ELSE 'Scrum Master'
         END AS emp_type
  FROM new_users u
),
skills_map AS (
  SELECT ra.id,
         ra.emp_type,
         CASE ra.emp_type
           WHEN 'Frontend Dev' THEN '["React","TypeScript","CSS","HTML"]'::jsonb
           WHEN 'Backend Dev' THEN '["Go","PostgreSQL","Docker","REST"]'::jsonb
           WHEN 'Fullstack Dev' THEN '["React","Node.js","TypeScript","SQL"]'::jsonb
           WHEN 'AI engineer' THEN '["Python","ML","TensorFlow","NLP"]'::jsonb
           WHEN 'UI' THEN '["Figma","Design Systems","Prototyping"]'::jsonb
           WHEN 'UX' THEN '["User Research","Wireframing","Prototyping"]'::jsonb
           WHEN 'Manual Tester' THEN '["Test Cases","Regression","JIRA"]'::jsonb
           WHEN 'Automation Tester' THEN '["Selenium","Cypress","CI/CD"]'::jsonb
           WHEN 'Architect' THEN '["System Design","Cloud","Microservices"]'::jsonb
           ELSE '["Scrum","Agile","Stakeholder Mgmt"]'::jsonb
         END AS skills
  FROM role_assignment ra
)
INSERT INTO employee_profiles (user_id, geo, date_of_joining, end_date, notice_date, type, skills, years_of_experience, industry, availability_flag, department)
SELECT
  sm.id as user_id,
  (ARRAY['US-East','US-West','EU','IN','APAC'])[1 + ((sm.id % 5))] AS geo,
  NOW() - (INTERVAL '1 year' * ((sm.id % 5))) - (INTERVAL '15 days' * ((sm.id % 3))) AS date_of_joining,
  -- Every 6th employee has an end_date within 60 days to trigger rolling off soon
  CASE WHEN (sm.id % 6) = 0 THEN NOW() + INTERVAL '30 days' ELSE NULL END AS end_date,
  -- Every 10th employee has notice_date within 60 days
  CASE WHEN (sm.id % 10) = 0 THEN NOW() + INTERVAL '45 days' ELSE NULL END AS notice_date,
  ra.emp_type AS type,
  sm.skills,
  2 + (sm.id % 10) AS years_of_experience,
  (ARRAY['Technology','Finance','Healthcare','Retail'])[1 + (sm.id % 4)] AS industry,
  -- Mark available if odd id or no active allocation later; ensures Available tile has data
  CASE WHEN (sm.id % 2) = 1 THEN TRUE ELSE FALSE END AS availability_flag,
  CASE 
    WHEN ra.emp_type IN ('Frontend Dev','Fullstack Dev','UI','UX') THEN 'Product'
    WHEN ra.emp_type IN ('Backend Dev','AI engineer','Architect') THEN 'Engineering'
    ELSE 'QA'
  END AS department
FROM skills_map sm
JOIN role_assignment ra ON ra.id = sm.id;

-- 2) Seed 10 Projects with staggered dates: some active, some not yet started, some ending soon
DELETE FROM project_allocations WHERE project_id IN (SELECT id FROM projects WHERE name LIKE 'Demo Project %');
DELETE FROM projects WHERE name LIKE 'Demo Project %';

WITH new_projects AS (
  INSERT INTO projects (name, description, required_seats, seats_by_type, start_date, end_date, status, summary)
  SELECT
    'Demo Project ' || i::text AS name,
    'Demo seeded project #' || i::text AS description,
    5 + (i % 4) AS required_seats,
    '{"Frontend Dev":2,"Backend Dev":2,"QA":1}'::jsonb AS seats_by_type,
    -- Alternating start/end to produce active and future/past projects
    CASE WHEN i <= 7 THEN NOW() - (INTERVAL '20 days' * i) ELSE NOW() + (INTERVAL '10 days' * (i-7)) END AS start_date,
    CASE WHEN i <= 7 THEN NOW() + (INTERVAL '60 days' * (8 - i)) ELSE NOW() + (INTERVAL '120 days' * (i-7)) END AS end_date,
    CASE WHEN i <= 7 THEN 'Open' ELSE 'Planning' END AS status,
    'Seed summary for demo project ' || i::text AS summary
  FROM generate_series(1, 10) AS s(i)
  RETURNING id
)
SELECT 1;

-- 3) Create allocations to ensure:
--   - Allocated Engineers present (active allocations)
--   - Rolling Off Soon present (alloc ends within 30 days)
--   - Bench Resources present (no allocations)

-- Allocate 30 employees across first 6 projects with active allocations
WITH emp AS (
  SELECT user_id FROM employee_profiles ORDER BY user_id LIMIT 40 -- pick first 40 for allocations pool
), proj AS (
  SELECT id FROM projects WHERE name LIKE 'Demo Project %' ORDER BY id LIMIT 6
)
INSERT INTO project_allocations (project_id, employee_id, allocation_type, start_date, end_date)
SELECT 
  p.id AS project_id,
  e.user_id AS employee_id,
  CASE WHEN (e.user_id % 3) = 0 THEN 'Part-Time' ELSE 'Full-Time' END AS allocation_type,
  NOW() - INTERVAL '15 days' AS start_date,
  -- Every 5th allocation ends within 30 days to trigger rolling-off
  CASE WHEN ((row_number() OVER (ORDER BY e.user_id)) % 5) = 0 THEN NOW() + INTERVAL '20 days' ELSE NULL END AS end_date
FROM emp e
JOIN proj p ON ((e.user_id + p.id) % 7) = 0; -- deterministic spread

-- Allocate another 10 employees to the next 2 projects to vary distribution
WITH emp AS (
  SELECT user_id FROM employee_profiles ORDER BY user_id OFFSET 10 LIMIT 30
), proj AS (
  SELECT id FROM projects WHERE name LIKE 'Demo Project %' ORDER BY id OFFSET 6 LIMIT 2
)
INSERT INTO project_allocations (project_id, employee_id, allocation_type, start_date, end_date)
SELECT 
  p.id,
  e.user_id,
  'Full-Time',
  NOW() - INTERVAL '10 days',
  CASE WHEN ((row_number() OVER (ORDER BY e.user_id)) % 6) = 0 THEN NOW() + INTERVAL '25 days' ELSE NULL END
FROM emp e
JOIN proj p ON ((e.user_id + p.id) % 5) = 0;

-- Leave at least ~10 employees without allocations to populate Bench and Available
-- Already ensured by limiting allocation pools; also many have availability_flag = true

COMMIT;


