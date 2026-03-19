const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role, phone } = req.body;
    if (!email || !password || !first_name || !last_name || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const result = await db.query(
      `INSERT INTO users (email, password_hash, role, first_name, last_name, phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, email, role, first_name, last_name, phone, avatar_url, created_at`,
      [email, password_hash, role, first_name, last_name, phone]
    );

    const user = result.rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const result = await db.query("SELECT * FROM users WHERE email = $1 AND is_active = TRUE", [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    // Fetch role-specific profile data
    let profile = {};
    if (user.role === "Student") {
      const s = await db.query(
        `SELECT s.*, p.name as program_name, d.name as department_name
         FROM students s
         LEFT JOIN programs p ON s.program_id = p.id
         LEFT JOIN departments d ON s.department_id = d.id
         WHERE s.user_id = $1`,
        [user.id]
      );
      if (s.rows.length > 0) profile = s.rows[0];
    } else if (user.role === "Supervisor") {
      const s = await db.query(
        `SELECT s.*, d.name as department_name
         FROM supervisors s
         LEFT JOIN departments d ON s.department_id = d.id
         WHERE s.user_id = $1`,
        [user.id]
      );
      if (s.rows.length > 0) profile = s.rows[0];
    }

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: `${user.first_name} ${user.last_name}`,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar_url: user.avatar_url,
        ...profile,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
exports.me = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, email, role, first_name, last_name, phone, avatar_url FROM users WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
