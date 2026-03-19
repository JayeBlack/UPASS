const db = require("../db");

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
       WHERE cr.student_id = $1
       ORDER BY c.code`,
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/courses/register
exports.register = async (req, res) => {
  try {
    const { student_id, course_id, semester, academic_year } = req.body;
    const result = await db.query(
      `INSERT INTO course_registrations (student_id, course_id, semester, academic_year)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [student_id, course_id, semester, academic_year]
    );
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
