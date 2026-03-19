const db = require("../db");

// GET /api/thesis/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM thesis_submissions WHERE student_id = $1 ORDER BY submitted_at DESC",
      [req.params.studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/thesis/pending (for supervisors)
exports.getPending = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT ts.*, u.first_name, u.last_name, s.index_number
       FROM thesis_submissions ts
       JOIN students s ON ts.student_id = s.id
       JOIN users u ON s.user_id = u.id
       WHERE ts.status = 'Pending'
       ORDER BY ts.submitted_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/thesis/upload
exports.upload = async (req, res) => {
  try {
    const { student_id, stage } = req.body;
    const file_url = req.file ? `/uploads/thesis/${req.file.filename}` : null;
    const file_name = req.file ? req.file.originalname : null;

    const result = await db.query(
      `INSERT INTO thesis_submissions (student_id, stage, file_url, file_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [student_id, stage, file_url, file_name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/thesis/:id/review
exports.review = async (req, res) => {
  try {
    const { status } = req.body; // Approved, Rejected
    const result = await db.query(
      `UPDATE thesis_submissions SET status = $1, reviewed_at = NOW(), reviewed_by = $2
       WHERE id = $3 RETURNING *`,
      [status, req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Submission not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/thesis/:id/remarks
exports.addRemark = async (req, res) => {
  try {
    const { remark_text } = req.body;
    const result = await db.query(
      `INSERT INTO thesis_remarks (submission_id, author_id, remark_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.params.id, req.user.id, remark_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/thesis/:id/remarks
exports.getRemarks = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT tr.*, u.first_name, u.last_name
       FROM thesis_remarks tr
       JOIN users u ON tr.author_id = u.id
       WHERE tr.submission_id = $1
       ORDER BY tr.created_at DESC`,
      [req.params.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
