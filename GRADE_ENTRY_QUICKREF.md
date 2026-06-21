# Grade Entry - Quick Reference

## 📋 File Format

### Required Columns (in order):
1. Index Number → `UMaT/PG/XXXX/YY`
2. Student Name → `John Doe`
3. Course Name → `Advanced Mathematics`
4. Credit Hours → `3`
5. Marks → `85` (0-100)

### ✅ Valid Example Row:
```
UMaT/PG/0234/22,John Doe,Advanced Mathematics,3,85
```

## 🎯 Grading Scale
- **A**: 80-100
- **B**: 70-79
- **C**: 60-69
- **D**: 50-59
- **F**: 0-49

## 📊 CWA Formula
```
CWA = Σ(marks × credits) / Σ(credits)
```

## 🔄 Workflow

1. **Select** Semester & Academic Year
2. **Upload** Excel/CSV file
3. **Review** validation results
4. **Fix** any errors (shown in red)
5. **Calculate** CWA
6. **Publish** results to students

## ⚠️ Common Errors

| Error | Fix |
|-------|-----|
| Invalid index number | Use format: `UMaT/PG/XXXX/YY` |
| Student not found | Verify student exists in system |
| Invalid marks | Must be 0-100 |
| Invalid credits | Must be positive number |
| Missing field | All columns required |

## 🔍 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged in as Exams Officer
- [ ] File follows correct format
- [ ] Student index numbers exist in database
- [ ] All rows valid (green checkmarks)
- [ ] CWA calculated
- [ ] Results published
- [ ] Student can see grades
- [ ] Student received notification

## 🎬 Quick Test

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Start frontend (new terminal)
npm run dev

# 3. Login as Exams Officer
# 4. Go to Grade Entry
# 5. Upload sample_grades.csv
# 6. Follow workflow steps above
```

## 📁 Sample Files

- `sample_grades.csv` - Test data file
- `GRADE_UPLOAD_TEMPLATE.md` - Detailed format guide
- `GRADE_ENTRY_TESTING.md` - Full testing guide

## 🚨 Important Notes

- ✅ One file can have multiple students
- ✅ One student can have multiple courses
- ✅ Duplicate entries update existing grades
- ✅ Empty rows are automatically skipped
- ✅ Students notified automatically on publish
- ❌ Cannot publish without calculating CWA first
- ❌ Cannot edit after publishing (must delete & re-upload)
