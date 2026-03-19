const db = require("../db");

// GET /api/exams/timetable
exports.getTimetable = async (req, res) => {
  try {
    const { semester, academic_year, exam_type } = req.query;
    let sql = `
      SELECT et.*, c.code, c.name AS course_name
      FROM exam_timetable et
      JOIN courses c ON et.course_id = c.id
      WHERE 1=1
    `;
    const params = [];
    let idx = 1;
    if (semester) { sql += ` AND et.semester = $${idx++}`; params.push(semester); }
    if (academic_year) { sql += ` AND et.academic_year = $${idx++}`; params.push(academic_year); }
    if (exam_type) { sql += ` AND et.exam_type = $${idx++}`; params.push(exam_type); }
    sql += " ORDER BY et.exam_date, et.start_time";
    const result = await db.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/exams/timetable
exports.createEntry = async (req, res) => {
  try {
    const { course_id, exam_date, start_time, duration, venue, exam_type, semester, academic_year } = req.body;
    const result = await db.query(
      `INSERT INTO exam_timetable (course_id, exam_date, start_time, duration, venue, exam_type, semester, academic_year)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [course_id, exam_date, start_time, duration, venue, exam_type || "Written", semester, academic_year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
