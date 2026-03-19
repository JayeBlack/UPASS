const db = require("../db");

// GET /api/supervisors
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.avatar_url, d.name AS department_name
       FROM supervisors s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.is_active = TRUE
       ORDER BY u.last_name`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/supervisors/:id
exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.avatar_url, d.name AS department_name
       FROM supervisors s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Supervisor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/supervisors/:id/students
exports.getAssignedStudents = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email,
              p.name AS program_name, ss.assigned_at,
              (SELECT stage FROM thesis_submissions WHERE student_id = s.id ORDER BY submitted_at DESC LIMIT 1) AS current_stage
       FROM student_supervisors ss
       JOIN students s ON ss.student_id = s.id
       JOIN users u ON s.user_id = u.id
       LEFT JOIN programs p ON s.program_id = p.id
       WHERE ss.supervisor_id = $1
       ORDER BY u.last_name`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/supervisors/:id/assign
exports.assignStudent = async (req, res) => {
  try {
    const { student_id, is_primary } = req.body;
    const result = await db.query(
      `INSERT INTO student_supervisors (student_id, supervisor_id, is_primary)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, req.params.id, is_primary !== false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Already assigned" });
    res.status(500).json({ error: err.message });
  }
};
