-- ============================================================
-- Student Programme Assignment Verification Script
-- Run this in your PostgreSQL database to verify student data
-- ============================================================

-- 1. Check all enrolled students with their programmes and departments
SELECT 
    u.id AS user_id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    u.role,
    s.index_number,
    s.admission_cycle,
    p.name AS program_name,
    d.name AS department_name,
    s.status,
    s.created_at
FROM users u
JOIN students s ON u.id = s.user_id
LEFT JOIN programs p ON s.program_id = p.id
LEFT JOIN departments d ON s.department_id = d.id
WHERE u.role = 'Student' AND u.is_active = TRUE
ORDER BY s.created_at DESC;

-- 2. Count students per department
SELECT 
    d.name AS department_name,
    COUNT(s.id) AS student_count
FROM students s
LEFT JOIN departments d ON s.department_id = d.id
GROUP BY d.name
ORDER BY student_count DESC;

-- 3. Count students per programme
SELECT 
    p.name AS program_name,
    COUNT(s.id) AS student_count
FROM students s
LEFT JOIN programs p ON s.program_id = p.id
GROUP BY p.name
ORDER BY student_count DESC;

-- 4. Check students by admission cycle
SELECT 
    s.admission_cycle,
    COUNT(s.id) AS student_count
FROM students s
GROUP BY s.admission_cycle
ORDER BY s.admission_cycle;

-- 5. Find students with missing programme or department (data integrity check)
SELECT 
    u.id AS user_id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    s.index_number,
    s.program_id,
    s.department_id,
    CASE 
        WHEN s.program_id IS NULL THEN '❌ Missing Programme'
        WHEN s.department_id IS NULL THEN '❌ Missing Department'
        ELSE '✅ OK'
    END AS status
FROM users u
JOIN students s ON u.id = s.user_id
WHERE u.role = 'Student' 
  AND (s.program_id IS NULL OR s.department_id IS NULL);

-- 6. Check for students in Computer Science department
SELECT 
    u.id AS user_id,
    u.email,
    CONCAT(u.first_name, ' ', u.last_name) AS full_name,
    s.index_number,
    p.name AS program_name,
    d.name AS department_name,
    s.admission_cycle
FROM users u
JOIN students s ON u.id = s.user_id
LEFT JOIN programs p ON s.program_id = p.id
LEFT JOIN departments d ON s.department_id = d.id
WHERE d.name ILIKE '%computer%science%'
ORDER BY s.created_at DESC;

-- 7. List all available programmes in the database
SELECT 
    p.id,
    p.name,
    p.code,
    d.name AS department_name,
    p.degree_type,
    COUNT(s.id) AS enrolled_students
FROM programs p
LEFT JOIN departments d ON p.department_id = d.id
LEFT JOIN students s ON p.id = s.program_id
WHERE p.is_active = TRUE
GROUP BY p.id, p.name, p.code, d.name, p.degree_type
ORDER BY p.name;

-- 8. List all active departments
SELECT 
    d.id,
    d.name,
    COUNT(s.id) AS enrolled_students
FROM departments d
LEFT JOIN students s ON d.id = s.department_id
GROUP BY d.id, d.name
ORDER BY d.name;

-- ============================================================
-- Expected Results After Bug Fix:
-- ============================================================
-- ✅ All students should have valid program_id and department_id
-- ✅ program_name should match what admin assigned during enrollment
-- ✅ department_name should match what admin assigned during enrollment
-- ✅ admission_cycle should be either 'January' or 'July'
-- ✅ No NULL values in critical fields (program_id, department_id)
