const db = require("../db");

// GET /api/resources
exports.getAll = async (req, res) => {
  try {
    const { category, search } = req.query;
    let sql = `SELECT r.*, u.first_name, u.last_name FROM resources r JOIN users u ON r.uploaded_by = u.id WHERE 1=1`;
    const params = [];
    let idx = 1;
    if (category) { sql += ` AND r.category = $${idx++}`; params.push(category); }
    if (search) { sql += ` AND (r.file_name ILIKE $${idx} OR r.description ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    sql += " ORDER BY r.uploaded_at DESC";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/resources
exports.upload = async (req, res) => {
  try {
    const { category, description } = req.body;
    const file_url = req.file ? `/uploads/resources/${req.file.filename}` : null;
    const file_name = req.file ? req.file.originalname : req.body.file_name;
    const file_type = file_name?.split(".").pop()?.toUpperCase() || "FILE";
    const file_size = req.file ? `${Math.round(req.file.size / 1024)} KB` : req.body.file_size;

    const result = await db.query(
      `INSERT INTO resources (uploaded_by, file_name, file_url, file_type, file_size, category, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, file_name, file_url, file_type, file_size, category, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/resources/:id
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM resources WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
