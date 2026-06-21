# Grade Entry System - Testing Guide

## Overview
This guide will help you test the Grade Entry system to ensure Excel/CSV uploads work perfectly and grades are successfully sent to student pages.

## Prerequisites

1. Backend server running on port 5000
2. Frontend running on port 5173
3. Database with students already enrolled
4. Exams Officer account

## Testing Steps

### 1. Prepare Test Data

Create an Excel or CSV file with the following format:

**sample_grades.csv:**
```csv
Index Number,Student Name,Course Name,Credit Hours,Marks
UMaT/PG/0234/22,John Doe,Advanced Mathematics,3,85
UMaT/PG/0234/22,John Doe,Data Structures,4,78
UMaT/PG/0235/22,Jane Smith,Advanced Mathematics,3,92
UMaT/PG/0235/22,Jane Smith,Data Structures,4,88
```

**Important:** Use actual student index numbers from your database!

### 2. Login as Exams Officer

1. Navigate to http://localhost:5173
2. Login with Exams Officer credentials
3. Navigate to Grade Entry page

### 3. Upload Grades File

1. Select **Semester** (e.g., Semester 1)
2. Select **Academic Year** (e.g., 2024/2025)
3. Click **"Upload CSV / Excel"** button
4. Select your prepared file
5. Wait for validation

**Expected Result:**
- Success message: "X rows imported"
- All rows appear in the table
- Valid rows show ✓ (green checkmark)
- Invalid rows show ⚠ (warning) with error details

### 4. Fix Validation Errors

If any rows are invalid:
- Check error messages in the Status column
- Common errors:
  - Invalid index number format
  - Missing required fields
  - Invalid marks (must be 0-100)
  - Invalid credits (must be positive)

Edit the rows directly in the table or remove and re-upload.

### 5. Calculate CWA

1. Ensure all rows are valid (all green checkmarks)
2. Click **"Calculate CWA"** button

**Expected Result:**
- CWA Results table appears below
- Shows each student's:
  - Index number
  - Name
  - Number of courses
  - Total credits
  - Calculated CWA

### 6. Publish Results

1. Click **"Publish Results"** button
2. Wait for confirmation

**Expected Result:**
- Success message: "Results published — visible to students"
- Status badge changes to "Published" (green)
- Batch ID is saved

### 7. Verify Student Can See Results

1. Logout from Exams Officer account
2. Login as a student (use one of the index numbers from your upload)
3. Navigate to **Results** page

**Expected Result:**
- Student sees their grades in a table
- Grades are grouped by semester
- CWA is calculated and displayed
- Chart shows performance analysis
- All course details are visible:
  - Course code
  - Course name
  - Credits
  - Grade (A, B, C, D, F)
  - Marks (%)

### 8. Verify Notifications

1. Check student's notifications panel
2. Should see notification: "Results Published"

### 9. Test Delete Functionality (Optional)

1. Login back as Exams Officer
2. On Grade Entry page, click **"Delete Published Results"**

**Expected Result:**
- Success message: "Results deleted"
- Grades removed from students' pages
- Status returns to "Draft"

## Common Issues & Solutions

### Issue: "Import failed: Failed to parse file"
**Solution:** 
- Check file format is .csv, .xlsx, or .xls
- Ensure file is not corrupted
- Check backend server is running

### Issue: "Student not found: UMaT/PG/XXXX/YY"
**Solution:**
- Verify student exists in database with that exact index number
- Check for typos in index number
- Ensure student record is properly created

### Issue: Rows showing validation errors
**Solution:**
- Check index number format: UMaT/PG/XXXX/YY
- Ensure marks are between 0-100
- Ensure credits are positive numbers
- Ensure all fields are filled

### Issue: "Calculate CWA first"
**Solution:**
- You must click "Calculate CWA" before publishing
- This is a safety measure to review results

### Issue: Results not showing on student page
**Solution:**
- Verify you clicked "Publish Results" (not just Calculate CWA)
- Check that student is logged in with correct account
- Clear browser cache and refresh

## Database Verification

To verify grades in database (PostgreSQL):

```sql
-- Check grades table
SELECT g.*, s.index_number, c.name as course_name
FROM grades g
JOIN students s ON g.student_id = s.id
JOIN courses c ON g.course_id = c.id
ORDER BY g.entered_at DESC;

-- Check result batches
SELECT * FROM result_batches ORDER BY created_at DESC;
```

## API Endpoints Used

1. **POST** `/api/results/parse-grades-file` - Parse uploaded file
2. **POST** `/api/results/batch-upload` - Publish grades
3. **GET** `/api/results/student/:studentId` - Get student grades
4. **DELETE** `/api/results/batch/:id` - Delete batch

## Expected Performance

- File upload: < 2 seconds (for ~100 rows)
- Validation: Instant (client-side)
- CWA calculation: Instant (client-side)
- Publishing: < 5 seconds (for ~50 students)

## Success Criteria

✅ File uploads without errors
✅ All valid rows are imported
✅ Invalid rows show clear error messages
✅ CWA is calculated correctly
✅ Publishing succeeds with confirmation
✅ Students can see their grades immediately
✅ Grades are grouped by semester
✅ CWA formula is correct: Σ(marks × credits) / Σ(credits)
✅ Students receive notifications
✅ Delete function works properly

## Notes

- Maximum file size: 50MB (configurable in backend)
- Supports Excel (.xlsx, .xls) and CSV files
- First row must be headers
- Empty rows are automatically skipped
- Duplicate entries update existing grades
- Grades are tied to academic year (one grade per course per year)
