const db = require("../db");

// GET /api/notifications
exports.getForUser = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    await db.query("UPDATE notifications SET is_read = TRUE WHERE user_id = $1", [req.user.id]);
    res.json({ message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/notifications/:id
exports.remove = async (req, res) => {
  try {
    await db.query("DELETE FROM notifications WHERE id = $1 AND user_id = $2", [req.params.id, req.user.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/notifications (admin/system use)
exports.create = async (req, res) => {
  try {
    const { user_id, title, message, type, severity } = req.body;
    const result = await db.query(
      `INSERT INTO notifications (user_id, title, message, type, severity) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, message, type || "general", severity || "info"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
