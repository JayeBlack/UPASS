const db = require("../db");

// GET /api/results/student/:studentId
exports.getByStudent = async (req, res) => {
  try {
    const userId = req.params.studentId;
    
    // First, find the student record using user_id
    const studentRes = await db.query(
      `SELECT id FROM students WHERE user_id = $1`,
      [userId]
    );
    
    if (studentRes.rows.length === 0) {
      return res.json([]); // No student record found, return empty array
    }
    
    const studentId = studentRes.rows[0].id;
    
    // Now fetch grades for this student
    const result = await db.query(
      `SELECT g.*, c.code, c.name AS course_name, c.credits
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1
       ORDER BY g.academic_year, g.semester, c.code`,
      [studentId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/results/batch-upload (upload grades from CSV/Excel)
exports.batchUpload = async (req, res) => {
  try {
    const { grades, semester, academicYear } = req.body;
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: "Grades array required" });
    }

    const results = [];
    const failedRows = [];

    for (let i = 0; i < grades.length; i++) {
      const g = grades[i];
      try {
        // Find student by index number
        const studentRes = await db.query(
          `SELECT s.id, s.student_id FROM students s WHERE s.index_number = $1`,
          [g.indexNumber]
        );
        
        if (studentRes.rows.length === 0) {
          failedRows.push({ row: i + 2, indexNumber: g.indexNumber, reason: "Student not found" });
          continue;
        }

        const studentId = studentRes.rows[0].id;

        // Find or create course
        let courseRes = await db.query(
          `SELECT id FROM courses WHERE name = $1 AND academic_year = $2`,
          [g.courseName, academicYear]
        );

        let courseId;
        if (courseRes.rows.length === 0) {
          // Create new course if it doesn't exist
          const createRes = await db.query(
            `INSERT INTO courses (code, name, credits, academic_year, semester)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id`,
            [g.courseName.toUpperCase().replace(/\s+/g, "_"), g.courseName, g.credits, academicYear, semester]
          );
          courseId = createRes.rows[0].id;
        } else {
          courseId = courseRes.rows[0].id;
        }

        // Insert or update grade
        const gradeRes = await db.query(
          `INSERT INTO grades (student_id, course_id, grade, marks, semester, academic_year, entered_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (student_id, course_id, academic_year) DO UPDATE
           SET grade = $3, marks = $4, entered_by = $7, entered_at = NOW()
           RETURNING *`,
          [studentId, courseId, g.grade, g.marks, semester, academicYear, req.user.id]
        );
        results.push(gradeRes.rows[0]);
      } catch (err) {
        failedRows.push({ row: i + 2, indexNumber: g.indexNumber, reason: err.message });
      }
    }

    // Create result batch record
    const batchRes = await db.query(
      `INSERT INTO result_batches (semester, academic_year, status, published_at, published_by, student_count)
       VALUES ($1, $2, $3, NOW(), $4, $5)
       RETURNING id`,
      [semester, academicYear, "Published", req.user.id, results.length]
    );

    res.status(201).json({
      batchId: batchRes.rows[0].id,
      message: `${results.length} grades uploaded`,
      gradesUploaded: results.length,
      failed: failedRows.length,
      failedRows: failedRows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/results/batch/:id (delete a result batch)
exports.deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;

    // Get batch details
    const batchRes = await db.query(
      `SELECT * FROM result_batches WHERE id = $1`,
      [id]
    );

    if (batchRes.rows.length === 0) {
      return res.status(404).json({ error: "Batch not found" });
    }

    const batch = batchRes.rows[0];

    // Delete all grades associated with this batch
    await db.query(
      `DELETE FROM grades 
       WHERE academic_year = $1 AND semester = $2 AND entered_by = $3`,
      [batch.academic_year, batch.semester, req.user.id]
    );

    // Delete the batch
    await db.query(
      `DELETE FROM result_batches WHERE id = $1`,
      [id]
    );

    res.json({ message: "Batch deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/results/grades (batch grade entry)
exports.enterGrades = async (req, res) => {
  try {
    const { grades } = req.body; // Array of { student_id, course_id, grade, marks, semester, academic_year }
    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({ error: "Grades array required" });
    }

    const results = [];
    for (const g of grades) {
      const r = await db.query(
        `INSERT INTO grades (student_id, course_id, grade, marks, semester, academic_year, entered_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_id, course_id, academic_year) DO UPDATE
         SET grade = $3, marks = $4, entered_by = $7
         RETURNING *`,
        [g.student_id, g.course_id, g.grade, g.marks, g.semester, g.academic_year, req.user.id]
      );
      results.push(r.rows[0]);
    }

    res.status(201).json({ message: `${results.length} grades entered`, grades: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/results/cwa/:studentId
exports.getCWA = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT SUM(g.marks * c.credits) / SUM(c.credits) AS cwa
       FROM grades g
       JOIN courses c ON g.course_id = c.id
       WHERE g.student_id = $1`,
      [req.params.studentId]
    );
    res.json({ cwa: result.rows[0]?.cwa ? parseFloat(result.rows[0].cwa).toFixed(2) : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/results/batches
exports.getBatches = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT rb.*, d.name AS department_name, p.name AS program_name
       FROM result_batches rb
       LEFT JOIN departments d ON rb.department_id = d.id
       LEFT JOIN programs p ON rb.program_id = p.id
       ORDER BY rb.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/results/batches/:id/publish
exports.publishBatch = async (req, res) => {
  try {
    const result = await db.query(
      `UPDATE result_batches SET status = 'Published', published_at = NOW(), published_by = $1
       WHERE id = $2 RETURNING *`,
      [req.user.id, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Batch not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
