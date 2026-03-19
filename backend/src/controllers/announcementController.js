const db = require("../db");

// GET /api/announcements
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT a.*, u.first_name, u.last_name,
              (SELECT COUNT(*) FROM announcement_reads ar WHERE ar.announcement_id = a.id) AS acknowledged_count
       FROM announcements a
       JOIN users u ON a.author_id = u.id
       ORDER BY a.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/announcements
exports.create = async (req, res) => {
  try {
    const { text, visibility, attachment_name, attachment_url, scheduled_at } = req.body;
    const result = await db.query(
      `INSERT INTO announcements (author_id, text, visibility, attachment_name, attachment_url, scheduled_at)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, text, visibility || "All Students", attachment_name, attachment_url, scheduled_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/announcements/:id/acknowledge
exports.acknowledge = async (req, res) => {
  try {
    await db.query(
      `INSERT INTO announcement_reads (announcement_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [req.params.id, req.user.id]
    );
    res.json({ message: "Acknowledged" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/announcements/:id
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM announcements WHERE id = $1 AND author_id = $2", [req.params.id, req.user.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
