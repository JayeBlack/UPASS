const db = require("../db");

// GET /api/results/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.*, c.code, c.name AS course_name, c.credits
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1
       ORDER BY g.academic_year, g.semester, c.code`,
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/results/grades (batch grade entry)
exports.enterGrades = async (req, res) => {
  try {
    const { grades } = req.body; // Array of { student_id, course_id, grade, marks, semester, academic_year }
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: "Grades array required" });
    }

    const results = [];
    for (const g of grades) {
      const r = await db.query(
        `INSERT INTO grades (student_id, course_id, grade, marks, semester, academic_year, entered_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_id, course_id, academic_year) DO UPDATE
         SET grade = $3, marks = $4, entered_by = $7
         RETURNING *`,
        [g.student_id, g.course_id, g.grade, g.marks, g.semester, g.academic_year, req.user.id]
      );
      results.push(r.rows[0]);
    }

    res.status(201).json({ message: `${results.length} grades entered`, grades: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/results/cwa/:studentId
exports.getCWA = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT SUM(g.marks * c.credits) / SUM(c.credits) AS cwa
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1`,
      [req.params.studentId]
    );
    res.json({ cwa: result.rows[0]?.cwa ? parseFloat(result.rows[0].cwa).toFixed(2) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/results/batches
exports.getBatches = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT rb.*, d.name AS department_name, p.name AS program_name
       FROM result_batches rb
       LEFT JOIN departments d ON rb.department_id = d.id
       LEFT JOIN programs p ON rb.program_id = p.id
       ORDER BY rb.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/results/batches/:id/publish
exports.publishBatch = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE result_batches SET status = 'Published', published_at = NOW(), published_by = $1
       WHERE id = $2 RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Batch not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
