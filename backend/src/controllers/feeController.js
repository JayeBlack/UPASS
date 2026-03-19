const db = require("../db");

// GET /api/fees/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM fee_records WHERE student_id = $1 ORDER BY academic_year DESC, semester",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/fees (all — admin/accountant)
exports.getAll = async (req, res) => {
  try {
    const { department, status, search } = req.query;
    let sql = `
      SELECT f.*, s.index_number, u.first_name, u.last_name, d.name AS department_name
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;
    if (department) { sql += ` AND d.name = $${idx++}`; params.push(department); }
    if (status === "cleared") { sql += " AND f.is_cleared = TRUE"; }
    if (status === "owing") { sql += " AND f.is_cleared = FALSE"; }
    if (search) {
      sql += ` AND (u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx} OR s.index_number ILIKE $${idx})`;
      params.push(`%${search}%`); idx++;
    }
    sql += " ORDER BY u.last_name";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/fees/payment
exports.makePayment = async (req, res) => {
  try {
    const { fee_record_id, amount, payment_method, reference, receipt_url } = req.body;
    const payment = await db.query(
      `INSERT INTO payments (fee_record_id, amount, payment_method, reference, receipt_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [fee_record_id, amount, payment_method, reference, receipt_url]
    );

    // Update fee record
    await db.query(
      `UPDATE fee_records SET amount_paid = amount_paid + $1, updated_at = NOW() WHERE id = $2`,
      [amount, fee_record_id]
    );

    // Auto-update status
    await db.query(
      `UPDATE fee_records SET
        status = CASE WHEN amount_paid >= total_amount THEN 'Paid' ELSE 'Partial' END,
        is_cleared = (amount_paid >= total_amount)
       WHERE id = $1`,
      [fee_record_id]
    );

    res.status(201).json(payment.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/fees/:id/clearance
exports.toggleClearance = async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE fee_records SET is_cleared = NOT is_cleared, updated_at = NOW() WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Fee record not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/fees/summary (analytics)
exports.getSummary = async (req, res) => {
  try {
    const { academic_year, department } = req.query;
    let sql = `
      SELECT
        COUNT(*) AS total_students,
        SUM(total_amount) AS total_fees,
        SUM(amount_paid) AS total_paid,
        SUM(outstanding) AS total_outstanding,
        COUNT(*) FILTER (WHERE is_cleared) AS cleared_count,
        COUNT(*) FILTER (WHERE NOT is_cleared) AS owing_count,
        ROUND(COUNT(*) FILTER (WHERE is_cleared) * 100.0 / NULLIF(COUNT(*), 0), 1) AS compliance_rate
      FROM fee_records f
      JOIN students s ON f.student_id = s.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;
    if (academic_year) { sql += ` AND f.academic_year = $${idx++}`; params.push(academic_year); }
    if (department) { sql += ` AND d.name = $${idx++}`; params.push(department); }

    const result = await db.query(sql, params);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
