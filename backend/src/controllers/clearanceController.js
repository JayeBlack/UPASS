const db = require("../db");

// GET /api/clearance/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM clearance_steps WHERE student_id = $1 ORDER BY step_order",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clearance/pending (for dean/admin)
exports.getPending = async (req, res) => {
  try {
    const { department } = req.query;
    let sql = `
      SELECT cs.*, s.index_number, u.first_name, u.last_name, p.name AS program_name, d.name AS department_name
      FROM clearance_steps cs
      JOIN students s ON cs.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE cs.status IN ('pending', 'not_started')
    `;
    const params = [];
    if (department) {
      sql += " AND d.name = $1";
      params.push(department);
    }
    sql += " ORDER BY cs.created_at DESC";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clearance/:id/approve
exports.approve = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE clearance_steps SET status = 'cleared', cleared_by = $1, cleared_at = NOW()
       WHERE id = $2 RETURNING *`,
      [req.body.cleared_by || "System", req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Step not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clearance/:id/reject
exports.reject = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE clearance_steps SET status = 'not_started', note = $1
       WHERE id = $2 RETURNING *`,
      [req.body.note || "Rejected", req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Step not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/clearance/init/:studentId (initialize clearance steps)
exports.initSteps = async (req, res) => {
  try {
    const steps = [
      { department: "School Fees", description: "All outstanding fees must be settled", step_order: 1 },
      { department: "Library", description: "Return all borrowed books and clear fines", step_order: 2 },
      { department: "Department", description: "Academic clearance from your department", step_order: 3 },
      { department: "Thesis Submission", description: "Final bound thesis submitted", step_order: 4 },
      { department: "ICT Directorate", description: "Return all university-issued devices", step_order: 5 },
      { department: "Dean of Postgraduate", description: "Final approval from the Dean", step_order: 6 },
    ];

    for (const s of steps) {
      await db.query(
        `INSERT INTO clearance_steps (student_id, department, description, step_order)
         VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`,
        [req.params.studentId, s.department, s.description, s.step_order]
      );
    }
    res.status(201).json({ message: "Clearance steps initialized" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
