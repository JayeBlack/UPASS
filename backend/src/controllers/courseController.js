const db = require("../db");
const { createNotification } = require("./notificationController");

// GET /api/courses
exports.getAll = async (req, res) => {
  try {
    const { program_id, semester, academic_year } = req.query;
    let sql = "SELECT c.*, p.name AS program_name FROM courses c LEFT JOIN programs p ON c.program_id = p.id WHERE c.is_active = TRUE";
    const params = [];
    let idx = 1;
    if (program_id) { sql += ` AND c.program_id = $${idx++}`; params.push(program_id); }
    if (semester) { sql += ` AND c.semester = $${idx++}`; params.push(semester); }
    if (academic_year) { sql += ` AND c.academic_year = $${idx++}`; params.push(academic_year); }
    sql += " ORDER BY c.code";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/courses/registered/:studentId
exports.getRegistered = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT cr.*, c.code, c.name, c.credits, c.course_type
       FROM course_registrations cr
       JOIN courses c ON cr.course_id = c.id
       WHERE cr.student_id = $1 AND cr.status = 'Registered'
       ORDER BY c.code`,
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/courses/all-registrations (Admin view)
exports.getAllRegistrations = async (req, res) => {
  try {
    const { department, program, academic_year } = req.query;
    let sql = `
      SELECT cr.*, 
             c.code, c.name, c.credits, c.course_type,
             s.index_number,
             CONCAT(u.first_name, ' ', u.last_name) as student_name,
             p.name as program_name,
             d.name as department_name
      FROM course_registrations cr
      JOIN courses c ON cr.course_id = c.id
      JOIN students s ON cr.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE cr.status = 'Registered'
    `;
    const params = [];
    let idx = 1;
    
    if (department) { 
      sql += ` AND d.name = $${idx++}`; 
      params.push(department); 
    }
    if (program) { 
      sql += ` AND p.name = $${idx++}`; 
      params.push(program); 
    }
    if (academic_year) { 
      sql += ` AND cr.academic_year = $${idx++}`; 
      params.push(academic_year); 
    }
    
    sql += ' ORDER BY d.name, p.name, s.index_number, c.code';
    
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/courses/register
exports.register = async (req, res) => {
  try {
    const { student_id, course_code, course_name, credits, course_type, semester, academic_year } = req.body;
    
    // First, find or create the course
    let courseId;
    const existingCourse = await db.query(
      'SELECT id FROM courses WHERE code = $1',
      [course_code]
    );
    
    if (existingCourse.rows.length > 0) {
      courseId = existingCourse.rows[0].id;
    } else {
      // Create new course
      const newCourse = await db.query(
        `INSERT INTO courses (name, code, credits, semester, academic_year, course_type, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, TRUE)
         RETURNING id`,
        [course_name, course_code, credits || 3, semester || 1, academic_year || '2025/2026', course_type || 'core']
      );
      courseId = newCourse.rows[0].id;
    }
    
    // Register the course
    const result = await db.query(
      `INSERT INTO course_registrations (student_id, course_id, semester, academic_year, status)
       VALUES ($1, $2, $3, $4, 'Registered')
       ON CONFLICT (student_id, course_id, academic_year) DO NOTHING
       RETURNING *`,
      [student_id, courseId, semester, academic_year]
    );
    
    if (result.rows.length === 0) {
      return res.status(409).json({ error: "Already registered for this course" });
    }
    // Notify student
    const studentUser = await db.query('SELECT user_id FROM students WHERE id = $1', [student_id]);
    if (studentUser.rows.length > 0) {
      await createNotification(
        studentUser.rows[0].user_id, 'course',
        'Course Registered',
        `You have been registered for ${course_name} (${course_code}).`,
        'success'
      );
    }
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Already registered for this course" });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/courses/register/:id
exports.dropCourse = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE course_registrations SET status = 'Dropped' WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Registration not found" });
    res.json({ message: "Course dropped" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
