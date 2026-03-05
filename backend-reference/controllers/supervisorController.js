const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// GET /api/supervisors
exports.getAll = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, staff_id, first_name, last_name, email, department, phone, avatar_url, title, is_active, created_at FROM supervisors WHERE is_active = TRUE ORDER BY last_name"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/supervisors/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT id, staff_id, first_name, last_name, email, department, phone, avatar_url, title, is_active, created_at FROM supervisors WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Supervisor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/supervisors
exports.create = async (req, res) => {
  try {
    const { staff_id, first_name, last_name, email, password, department, phone, avatar_url, title } = req.body;

    if (!staff_id || !first_name || !last_name || !email || !password || !department) {
      return res.status(400).json({ error: "Missing required fields: staff_id, first_name, last_name, email, password, department" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO supervisors (staff_id, first_name, last_name, email, password_hash, department, phone, avatar_url, title)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, staff_id, first_name, last_name, email, department, phone, avatar_url, title, created_at`,
      [staff_id, first_name, last_name, email, password_hash, department, phone, avatar_url, title || "Dr."]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Supervisor with this email or staff_id already exists" });
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/supervisors/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, department, phone, avatar_url, title } = req.body;

    const result = await db.query(
      `UPDATE supervisors
       SET first_name = COALESCE($1, first_name),
           last_name  = COALESCE($2, last_name),
           email      = COALESCE($3, email),
           department = COALESCE($4, department),
           phone      = COALESCE($5, phone),
           avatar_url = COALESCE($6, avatar_url),
           title      = COALESCE($7, title),
           updated_at = NOW()
       WHERE id = $8
       RETURNING id, staff_id, first_name, last_name, email, department, phone, avatar_url, title, updated_at`,
      [first_name, last_name, email, department, phone, avatar_url, title, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Supervisor not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/supervisors/:id (soft delete)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "UPDATE supervisors SET is_active = FALSE, updated_at = NOW() WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Supervisor not found" });
    res.json({ message: "Supervisor deactivated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/supervisors/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const result = await db.query("SELECT * FROM supervisors WHERE email = $1 AND is_active = TRUE", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const supervisor = result.rows[0];
    const isMatch = await bcrypt.compare(password, supervisor.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: supervisor.id, email: supervisor.email, role: "Supervisor" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      supervisor: {
        id: supervisor.id,
        staff_id: supervisor.staff_id,
        first_name: supervisor.first_name,
        last_name: supervisor.last_name,
        email: supervisor.email,
        department: supervisor.department,
        title: supervisor.title,
        avatar_url: supervisor.avatar_url,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
