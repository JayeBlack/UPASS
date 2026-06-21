# ✅ Grade Entry System - Final Checklist

## Before Testing

### Backend Setup
- [ ] Backend running on port 5000
  ```bash
  cd backend
  npm run dev
  ```
- [ ] Database migrations completed
  ```bash
  node run_migrations.js
  ```
- [ ] Verify system components
  ```bash
  node verify_grade_system.js
  ```

### Frontend Setup
- [ ] Frontend running on port 5173
  ```bash
  npm run dev
  ```
- [ ] Environment variables configured
  - [ ] `VITE_API_URL=http://localhost:5000/api`

### Database Setup
- [ ] Students exist in database
- [ ] At least one Exams Officer account exists
- [ ] All required tables exist (run migrations)

## Testing Workflow

### 1. Prepare Test File
- [ ] Use `sample_grades.csv` or create custom file
- [ ] Update index numbers to match actual students
- [ ] Verify file format matches template

### 2. Login & Navigate
- [ ] Login as Exams Officer
- [ ] Navigate to Grade Entry page
- [ ] Verify page loads without errors

### 3. Upload File
- [ ] Select Semester (e.g., Semester 1)
- [ ] Select Academic Year (e.g., 2024/2025)
- [ ] Click "Upload CSV / Excel"
- [ ] Select your file
- [ ] Wait for upload and validation

### 4. Verify Upload
- [ ] Success message displayed
- [ ] All rows appear in table
- [ ] Valid rows show green checkmark ✓
- [ ] Invalid rows show warnings (if any)
- [ ] Error messages are clear

### 5. Fix Validation Errors (if any)
- [ ] Review error messages
- [ ] Edit rows directly in table, or
- [ ] Fix source file and re-upload

### 6. Calculate CWA
- [ ] All rows are valid (all green)
- [ ] Click "Calculate CWA" button
- [ ] CWA Results table appears
- [ ] Verify CWA calculations look correct

### 7. Publish Results
- [ ] Click "Publish Results" button
- [ ] Wait for confirmation message
- [ ] Status changes to "Published" (green badge)
- [ ] No error messages

### 8. Verify Student View
- [ ] Logout from Exams Officer
- [ ] Login as student (use index from upload)
- [ ] Navigate to Results page
- [ ] Grades are visible
- [ ] CWA is displayed
- [ ] Chart shows data
- [ ] All course details correct

### 9. Verify Notifications
- [ ] Check student notifications
- [ ] "Results Published" notification appears
- [ ] Notification details correct

### 10. Test Delete (Optional)
- [ ] Login back as Exams Officer
- [ ] Click "Delete Published Results"
- [ ] Confirm deletion
- [ ] Verify grades removed from student page

## Common Issues to Check

### Backend Issues
- [ ] Port 5000 not in use by another app
- [ ] Database connection successful
- [ ] No migration errors
- [ ] `uploads/` directory exists and is writable

### Frontend Issues
- [ ] Port 5173 not in use
- [ ] API URL configured correctly
- [ ] No console errors
- [ ] Token stored in localStorage

### File Issues
- [ ] File format is .csv, .xlsx, or .xls
- [ ] Headers are in first row
- [ ] No extra columns or missing columns
- [ ] Index numbers match exact format
- [ ] No special characters causing issues

### Data Issues
- [ ] Students exist with those index numbers
- [ ] Marks are between 0-100
- [ ] Credits are positive numbers
- [ ] No empty required fields

## Success Indicators

✅ **Upload Success**
- File parses without errors
- All data appears in table
- Validation runs automatically

✅ **Validation Success**
- All rows show green checkmarks
- No warning messages
- Calculate CWA button is enabled

✅ **Publish Success**
- "Results published" confirmation
- Status badge turns green
- Batch ID returned

✅ **Student View Success**
- Grades visible immediately
- CWA calculated correctly
- Semester grouping correct
- Chart displays properly

✅ **Notification Success**
- Student receives notification
- Notification type is "exam"
- Message mentions semester and year

## Performance Benchmarks

- [ ] File upload < 2 seconds (100 rows)
- [ ] Validation instant
- [ ] CWA calculation instant
- [ ] Publishing < 5 seconds (50 students)
- [ ] Student page loads < 1 second

## Documentation Review

- [ ] Read GRADE_ENTRY_TESTING.md
- [ ] Review GRADE_UPLOAD_TEMPLATE.md
- [ ] Check GRADE_ENTRY_QUICKREF.md
- [ ] Understand GRADE_SYSTEM_SUMMARY.md

## Database Verification (Optional)

```sql
-- Check grades were inserted
SELECT COUNT(*) FROM grades;

-- View recent grades
SELECT g.*, s.index_number, c.name
FROM grades g
JOIN students s ON g.student_id = s.id
JOIN courses c ON g.course_id = c.id
ORDER BY g.entered_at DESC
LIMIT 10;

-- Check result batches
SELECT * FROM result_batches
ORDER BY created_at DESC;
```

## Final Sign-Off

- [ ] All tests passed
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Documentation reviewed
- [ ] Team members trained

## 🎉 Ready for Production!

Once all items are checked, the grade entry system is ready for use by exams officers. Students will receive their grades immediately upon publication.

---

**Date Tested:** _____________

**Tested By:** _____________

**Notes:** 
_____________________________________________
_____________________________________________
_____________________________________________
