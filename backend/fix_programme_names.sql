-- ============================================================
-- Fix Existing Student Programme Names
-- Updates programme names to match course catalog labels exactly
-- Run this script to fix all existing students in the database
-- ============================================================

-- Backup existing data first (optional but recommended)
-- CREATE TABLE students_backup AS SELECT * FROM students;
-- CREATE TABLE programs_backup AS SELECT * FROM programs;

BEGIN;

-- 1. Update Mining Engineering programmes
UPDATE programs 
SET name = 'Mining Engineering (MSc / MPhil) — July'
WHERE LOWER(name) LIKE '%mining%engineering%' 
  AND LOWER(name) LIKE '%msc%'
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

UPDATE programs 
SET name = 'Postgraduate Diploma in Mining Engineering (July)'
WHERE LOWER(name) LIKE '%mining%engineering%' 
  AND LOWER(name) LIKE '%diploma%'
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

-- 2. Update Electrical and Electronic Engineering programmes
UPDATE programs 
SET name = 'Electrical and Electronic Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%electrical%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'January'
  );

UPDATE programs 
SET name = 'Electrical and Electronic Engineering (MSc / MPhil) — July'
WHERE LOWER(name) LIKE '%electrical%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

UPDATE programs 
SET name = 'Electrical and Electronic Engineering (PhD)'
WHERE LOWER(name) LIKE '%electrical%engineering%' 
  AND LOWER(name) LIKE '%phd%'
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'January'
  );

UPDATE programs 
SET name = 'Electrical and Electronic Engineering (PhD) — July'
WHERE LOWER(name) LIKE '%electrical%engineering%' 
  AND LOWER(name) LIKE '%phd%'
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

-- 3. Update Computer Science programmes
UPDATE programs 
SET name = 'Computer Science and Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%computer%science%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%');

-- 4. Update Mechanical Engineering programmes
UPDATE programs 
SET name = 'Mechanical Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%mechanical%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'January'
  );

UPDATE programs 
SET name = 'Mechanical Engineering (PhD)'
WHERE LOWER(name) LIKE '%mechanical%engineering%' 
  AND LOWER(name) LIKE '%phd%';

-- 5. Update Geomatic Engineering programmes
UPDATE programs 
SET name = 'Geomatic Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%geomatic%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%');

UPDATE programs 
SET name = 'Geomatic Engineering (PhD)'
WHERE LOWER(name) LIKE '%geomatic%engineering%' 
  AND LOWER(name) LIKE '%phd%';

-- 6. Update Mathematics programmes
UPDATE programs 
SET name = 'Mathematics (MSc / MPhil)'
WHERE LOWER(name) LIKE '%mathematic%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'January'
  );

UPDATE programs 
SET name = 'Mathematical Sciences (MSc / MPhil) — July'
WHERE LOWER(name) LIKE '%mathematic%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

UPDATE programs 
SET name = 'Mathematics (PhD)'
WHERE LOWER(name) LIKE '%mathematic%' 
  AND LOWER(name) LIKE '%phd%';

-- 7. Update Minerals Engineering programmes
UPDATE programs 
SET name = 'Minerals Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%mineral%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%');

-- 8. Update Geological Engineering programmes
UPDATE programs 
SET name = 'Geological Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%geological%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'January'
  );

UPDATE programs 
SET name = 'Geological Engineering (MSc / MPhil) — July'
WHERE LOWER(name) LIKE '%geological%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%')
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

-- 9. Update Petroleum Engineering programmes
UPDATE programs 
SET name = 'Petroleum Engineering (MSc / MPhil)'
WHERE LOWER(name) LIKE '%petroleum%engineering%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%');

UPDATE programs 
SET name = 'Petroleum Engineering (PhD)'
WHERE LOWER(name) LIKE '%petroleum%engineering%' 
  AND LOWER(name) LIKE '%phd%';

-- 10. Update Petroleum Refining programmes
UPDATE programs 
SET name = 'Petroleum Refining and Petrochemical Engineering (MSc / MPhil) — July'
WHERE LOWER(name) LIKE '%petroleum%refining%' 
  AND (LOWER(name) LIKE '%msc%' OR LOWER(name) LIKE '%mphil%');

-- 11. Update Management Studies programmes
UPDATE programs 
SET name = 'Master of Business and Technology Management — Supply Chain Management (July)'
WHERE LOWER(name) LIKE '%supply%chain%' 
  AND LOWER(name) LIKE '%management%';

UPDATE programs 
SET name = 'Master of Business and Technology Management — Finance and Investment (July)'
WHERE LOWER(name) LIKE '%finance%' 
  AND LOWER(name) LIKE '%investment%';

UPDATE programs 
SET name = 'Master of Business and Technology Management — Management Information Systems (July)'
WHERE LOWER(name) LIKE '%information%systems%' 
  AND LOWER(name) LIKE '%management%';

UPDATE programs 
SET name = 'Master of Business and Technology Management — Strategic Human Resource Management (July)'
WHERE LOWER(name) LIKE '%human%resource%' 
  AND LOWER(name) LIKE '%management%';

UPDATE programs 
SET name = 'MSc Engineering Management (July)'
WHERE LOWER(name) LIKE '%engineering%management%' 
  AND LOWER(name) LIKE '%msc%';

-- 12. Update Occupational Health and Safety programmes
UPDATE programs 
SET name = 'Occupational Health and Safety (MSc / MPhil / PhD) — July'
WHERE LOWER(name) LIKE '%occupational%health%safety%' 
  AND id IN (
    SELECT DISTINCT program_id FROM students WHERE admission_cycle = 'July'
  );

COMMIT;

-- ============================================================
-- Verification Queries
-- Run these to verify the updates worked correctly
-- ============================================================

-- Check updated programme names
SELECT DISTINCT 
    p.name AS program_name,
    d.name AS department_name,
    COUNT(s.id) AS student_count,
    STRING_AGG(DISTINCT s.admission_cycle, ', ') AS cohorts
FROM programs p
LEFT JOIN students s ON p.id = s.program_id
LEFT JOIN departments d ON s.department_id = d.id
GROUP BY p.name, d.name
ORDER BY p.name;

-- Check students with their updated programmes
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    s.index_number,
    p.name AS program_name,
    d.name AS department_name,
    s.admission_cycle
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN programs p ON s.program_id = p.id
LEFT JOIN departments d ON s.department_id = d.id
ORDER BY s.created_at DESC
LIMIT 20;

-- ============================================================
-- Notes:
-- ============================================================
-- 1. This script updates programme names in the 'programs' table
-- 2. Student records automatically inherit the updated names via foreign key
-- 3. All students will now see correct course catalogs
-- 4. The fuzzy matching in the frontend will handle any minor variations
-- 5. New enrollments use exact catalog names from the dropdown
