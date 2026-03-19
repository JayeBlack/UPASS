const db = require("../db");

// GET /api/students
exports.getAll = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let sql = `
      SELECT s.*, u.first_name, u.last_name, u.email, u.avatar_url,
             p.name AS program_name, d.name AS department_name
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;

    if (department) { sql += ` AND d.name = $${idx++}`; params.push(department); }
    if (status) { sql += ` AND s.status = $${idx++}`; params.push(status); }
    if (search) {
      sql += ` AND (u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR s.index_number ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }
    sql += " ORDER BY u.last_name";

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/students/:id
exports.getById = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u.first_name, u.last_name, u.email, u.avatar_url,
              p.name AS program_name, d.name AS department_name
       FROM students s
       JOIN users u ON s.user_id = u.id
       LEFT JOIN programs p ON s.program_id = p.id
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/students (enroll)
exports.create = async (req, res) => {
  try {
    const { user_id, index_number, program_id, department_id, admission_year, study_mode } = req.body;
    if (!user_id || !index_number || !program_id || !department_id || !admission_year) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.query(
      `INSERT INTO students (user_id, index_number, program_id, department_id, admission_year, study_mode)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, index_number, program_id, department_id, admission_year, study_mode || "Full-time"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Student already exists" });
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  try {
    const { status, study_mode } = req.body;
    const result = await db.query(
      `UPDATE students SET status = COALESCE($1, status), study_mode = COALESCE($2, study_mode), updated_at = NOW()
       WHERE id = $3 RETURNING *`,
      [status, study_mode, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/students/:id (soft delete via status)
exports.remove = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE students SET status = 'Inactive', updated_at = NOW() WHERE id = $1 RETURNING id",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
