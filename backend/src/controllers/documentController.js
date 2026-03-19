const db = require("../db");

// GET /api/documents/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM document_requests WHERE student_id = $1 ORDER BY requested_at DESC",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/documents
exports.create = async (req, res) => {
  try {
    const { student_id, doc_type, purpose } = req.body;
    const result = await db.query(
      `INSERT INTO document_requests (student_id, doc_type, purpose) VALUES ($1, $2, $3) RETURNING *`,
      [student_id, doc_type, purpose]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/documents/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const result = await db.query(
      `UPDATE document_requests SET status = $1, completed_at = CASE WHEN $1 = 'Ready' THEN NOW() ELSE NULL END,
       processed_by = $2 WHERE id = $3 RETURNING *`,
      [status, req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Request not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
