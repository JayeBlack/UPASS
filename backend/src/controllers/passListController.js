const db = require("../db");

// GET /api/passlist
exports.getAll = async (req, res) => {
  try {
    const { department, program, year, status } = req.query;
    let sql = `
      SELECT g.*, s.index_number, u.first_name, u.last_name,
             p.name AS program_name, d.name AS department_name
      FROM graduands g
      JOIN students s ON g.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;
    if (department) { sql += ` AND d.name = $${idx++}`; params.push(department); }
    if (program) { sql += ` AND p.name = $${idx++}`; params.push(program); }
    if (year) { sql += ` AND g.academic_year = $${idx++}`; params.push(year); }
    if (status) { sql += ` AND g.status = $${idx++}`; params.push(status); }
    sql += " ORDER BY u.last_name";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/passlist/generate
exports.generate = async (req, res) => {
  try {
    const { academic_year, min_cwa } = req.body;
    // Auto-generate pass list from grades
    const result = await db.query(`
      INSERT INTO graduands (student_id, academic_year, cwa, status)
      SELECT s.id, $1,
             ROUND(SUM(g.marks * c.credits) / SUM(c.credits), 2),
             CASE WHEN SUM(g.marks * c.credits) / SUM(c.credits) >= $2 THEN 'Eligible' ELSE 'Ineligible' END
      FROM students s
      JOIN grades g ON g.student_id = s.id
      JOIN courses c ON g.course_id = c.id
      WHERE s.status = 'Active'
      GROUP BY s.id
      ON CONFLICT DO NOTHING
      RETURNING *
    `, [academic_year || "2025/2026", min_cwa || 45]);

    res.json({ message: `${result.rows.length} graduands processed`, data: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
