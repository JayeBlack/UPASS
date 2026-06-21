const db = require("../db");
const { createNotification } = require("./notificationController");

// Which roles may approve which clearance step departments
const STEP_OWNERS = {
  "School Fees":          ["Accountant", "AccountingAssistant", "Admin"],
  "Library":              ["Registrar", "AdminAssistant", "Admin"],
  "Department":           ["Registrar", "AdminAssistant", "Admin"],
  "Thesis Submission":    ["Registrar", "AdminAssistant", "Admin"],
  "ICT Directorate":      ["Registrar", "AdminAssistant", "Admin"],
  "Dean of Postgraduate": ["Dean", "ViceDean", "Admin"],
};

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

// GET /api/clearance/all-students — grouped student clearance summary for approvals page
exports.getAllStudents = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        s.id AS student_id,
        s.index_number,
        u.first_name,
        u.last_name,
        p.name AS program_name,
        d.name AS department_name,
        json_agg(
          json_build_object(
            'id',         cs.id,
            'department', cs.department,
            'description',cs.description,
            'status',     cs.status,
            'cleared_by', cs.cleared_by,
            'cleared_at', cs.cleared_at,
            'note',       cs.note,
            'step_order', cs.step_order
          ) ORDER BY cs.step_order
        ) AS steps
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN clearance_steps cs ON cs.student_id = s.id
      WHERE s.status = 'Active'
      GROUP BY s.id, s.index_number, u.first_name, u.last_name, p.name, d.name
      ORDER BY u.last_name, u.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/clearance/pending (legacy — kept for backward compat)
exports.getPending = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT cs.*, s.index_number, u.first_name, u.last_name, p.name AS program_name, d.name AS department_name
      FROM clearance_steps cs
      JOIN students s ON cs.student_id = s.id
      JOIN users u ON s.user_id = u.id
      LEFT JOIN programs p ON s.program_id = p.id
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE cs.status IN ('pending', 'not_started')
      ORDER BY cs.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clearance/:id/approve
exports.approve = async (req, res) => {
  try {
    const stepRes = await db.query("SELECT * FROM clearance_steps WHERE id = $1", [req.params.id]);
    if (stepRes.rows.length === 0) return res.status(404).json({ error: "Step not found" });
    const step = stepRes.rows[0];

    // Enforce Dean is last — block if any non-Dean step is still uncleared
    if (step.department === "Dean of Postgraduate") {
      const othersRes = await db.query(
        `SELECT id FROM clearance_steps WHERE student_id = $1 AND department != 'Dean of Postgraduate' AND status != 'cleared'`,
        [step.student_id]
      );
      if (othersRes.rows.length > 0) {
        return res.status(400).json({ error: "All other clearance steps must be approved before the Dean can give final approval." });
      }
    }

    const result = await db.query(
      `UPDATE clearance_steps SET status = 'cleared', cleared_by = $1, cleared_at = NOW()
       WHERE id = $2 RETURNING *`,
      [req.body.cleared_by || req.user.email, req.params.id]
    );

    const studentQuery = await db.query("SELECT user_id FROM students WHERE id = $1", [step.student_id]);
    if (studentQuery.rows.length > 0) {
      await createNotification(
        studentQuery.rows[0].user_id, "clearance",
        "Clearance Step Approved",
        `Your ${step.department} clearance has been approved!`,
        "success"
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/clearance/:id/reject
exports.reject = async (req, res) => {
  try {
    const stepRes = await db.query("SELECT * FROM clearance_steps WHERE id = $1", [req.params.id]);
    if (stepRes.rows.length === 0) return res.status(404).json({ error: "Step not found" });
    const step = stepRes.rows[0];

    const result = await db.query(
      `UPDATE clearance_steps SET status = 'not_started', note = $1
       WHERE id = $2 RETURNING *`,
      [req.body.note || `Rejected by ${req.user.email}`, req.params.id]
    );

    const studentQuery = await db.query("SELECT user_id FROM students WHERE id = $1", [step.student_id]);
    if (studentQuery.rows.length > 0) {
      await createNotification(
        studentQuery.rows[0].user_id, "clearance",
        "Clearance Requires Attention",
        `Your ${step.department} clearance needs attention. Please check details.`,
        "warning"
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/clearance/bulk-approve — approve multiple steps at once
exports.bulkApprove = async (req, res) => {
  try {
    const { step_ids, cleared_by } = req.body;
    if (!Array.isArray(step_ids) || step_ids.length === 0) {
      return res.status(400).json({ error: "step_ids array required" });
    }

    const approved = [];
    const errors = [];

    for (const id of step_ids) {
      try {
        const stepRes = await db.query("SELECT * FROM clearance_steps WHERE id = $1", [id]);
        if (stepRes.rows.length === 0) { errors.push(`Step ${id} not found`); continue; }
        const step = stepRes.rows[0];

        if (step.department === "Dean of Postgraduate") {
          const othersRes = await db.query(
            `SELECT id FROM clearance_steps WHERE student_id = $1 AND department != 'Dean of Postgraduate' AND status != 'cleared'`,
            [step.student_id]
          );
          if (othersRes.rows.length > 0) {
            errors.push(`Cannot approve Dean step for student ${step.student_id} — other steps pending`);
            continue;
          }
        }

        await db.query(
          `UPDATE clearance_steps SET status = 'cleared', cleared_by = $1, cleared_at = NOW() WHERE id = $2`,
          [cleared_by || req.user.email, id]
        );

        const studentQuery = await db.query("SELECT user_id FROM students WHERE id = $1", [step.student_id]);
        if (studentQuery.rows.length > 0) {
          await createNotification(
            studentQuery.rows[0].user_id, "clearance",
            "Clearance Step Approved",
            `Your ${step.department} clearance has been approved!`,
            "success"
          );
        }
        approved.push(id);
      } catch (e) {
        errors.push(`Step ${id}: ${e.message}`);
      }
    }

    res.json({ approved: approved.length, errors: errors.length ? errors : undefined });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/clearance/init/:studentId
exports.initSteps = async (req, res) => {
  try {
    const steps = [
      { department: "School Fees",          description: "All outstanding fees must be settled",       step_order: 1 },
      { department: "Library",              description: "Return all borrowed books and clear fines",   step_order: 2 },
      { department: "Department",           description: "Academic clearance from your department",     step_order: 3 },
      { department: "Thesis Submission",    description: "Final bound thesis submitted",                step_order: 4 },
      { department: "ICT Directorate",      description: "Return all university-issued devices",        step_order: 5 },
      { department: "Dean of Postgraduate", description: "Final approval from the Dean",                step_order: 6 },
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
