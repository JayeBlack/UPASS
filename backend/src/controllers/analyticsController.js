const db = require("../db");

// GET /api/analytics/overview
exports.getOverview = async (req, res) => {
  try {
    const { academic_year } = req.query;

    const students = await db.query("SELECT COUNT(*) FROM students WHERE status = 'Active'");
    const programs = await db.query("SELECT COUNT(*) FROM programs WHERE is_active = TRUE");

    const feesSummary = await db.query(`
      SELECT SUM(amount_paid) AS collected, SUM(outstanding) AS outstanding,
             COUNT(*) FILTER (WHERE is_cleared) AS cleared,
             COUNT(*) FILTER (WHERE NOT is_cleared) AS owing
      FROM fee_records
    `);

    const thesisSummary = await db.query(`
      SELECT stage, COUNT(*) AS count FROM thesis_submissions
      GROUP BY stage ORDER BY stage
    `);

    const enrollmentByDept = await db.query(`
      SELECT d.name, COUNT(s.id) AS students
      FROM students s
      JOIN departments d ON s.department_id = d.id
      WHERE s.status = 'Active'
      GROUP BY d.name ORDER BY students DESC
    `);

    res.json({
      totalStudents: parseInt(students.rows[0].count),
      totalPrograms: parseInt(programs.rows[0].count),
      fees: feesSummary.rows[0],
      thesisByStage: thesisSummary.rows,
      enrollmentByDept: enrollmentByDept.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/cwa
exports.getCWAAnalytics = async (req, res) => {
  try {
    const { department, year } = req.query;
    let sql = `
      SELECT p.name AS program, d.name AS department,
             ROUND(AVG(g.marks), 1) AS avg_cwa
      FROM grades g
      JOIN students s ON g.student_id = s.id
      JOIN programs p ON s.program_id = p.id
      JOIN departments d ON s.department_id = d.id
    `;
    const params = [];
    const conditions = [];
    let idx = 1;
    if (department) { conditions.push(`d.name = $${idx++}`); params.push(department); }
    if (year) { conditions.push(`g.academic_year = $${idx++}`); params.push(year); }
    if (conditions.length > 0) sql += " WHERE " + conditions.join(" AND ");
    sql += " GROUP BY p.name, d.name ORDER BY avg_cwa DESC";

    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/analytics/fees
exports.getFeeAnalytics = async (req, res) => {
  try {
    const { department, year } = req.query;

    // Monthly collections
    const collections = await db.query(`
      SELECT TO_CHAR(paid_at, 'Mon') AS month, SUM(amount) AS collected
      FROM payments WHERE status = 'Verified'
      GROUP BY TO_CHAR(paid_at, 'Mon'), EXTRACT(MONTH FROM paid_at)
      ORDER BY EXTRACT(MONTH FROM paid_at)
    `);

    // Compliance by program
    const compliance = await db.query(`
      SELECT p.name AS program,
             ROUND(COUNT(*) FILTER (WHERE f.is_cleared) * 100.0 / NULLIF(COUNT(*), 0), 1) AS rate
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      JOIN programs p ON s.program_id = p.id
      GROUP BY p.name ORDER BY rate DESC
    `);

    res.json({ monthlyCollections: collections.rows, complianceByProgram: compliance.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
