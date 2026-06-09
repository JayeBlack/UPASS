# Quick Reference: Student Enrollment

## 📋 Enrollment Steps (CORRECT ORDER)

### 1️⃣ Select Admission Cohort FIRST
```
┌─────────────────────────────────────┐
│ Admission Cohort *                  │
│ ┌─────────────────────────────────┐ │
│ │ January - June          ▼       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
⚠️ **Important**: This determines which programmes are available!

### 2️⃣ Select Department
```
┌─────────────────────────────────────┐
│ Department *                        │
│ ┌─────────────────────────────────┐ │
│ │ Mining Engineering      ▼       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### 3️⃣ Select Programme
```
┌─────────────────────────────────────┐
│ Programme *                         │
│ ┌─────────────────────────────────┐ │
│ │ Mining Engineering (MSc/MPhil)  │ │
│ │ — July                  ▼       │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```
✅ Only programmes matching department + cohort appear

---

## ✅ DO's

✅ **Select cohort FIRST** (before department/programme)
✅ **Use dropdown selections** (don't try to type programme names manually)
✅ **Match department with programme** (system enforces this)
✅ **Verify student details** before clicking "Enroll Student"
✅ **Note the default password** (shown after enrollment)

---

## ❌ DON'Ts

❌ **Don't skip cohort selection** (defaults to January)
❌ **Don't type programme names** in bulk uploads (use exact dropdown text)
❌ **Don't mix July programmes with January cohort** (or vice versa)
❌ **Don't guess programme names** (always check dropdown)

---

## 🔄 Common Scenarios

### Scenario A: July Intake Student
```
Cohort:     July - December
Department: Mining Engineering
Programme:  Mining Engineering (MSc / MPhil) — July ✅
```

### Scenario B: January Intake Student
```
Cohort:     January - June
Department: Computer Science and Engineering
Programme:  Computer Science and Engineering (MSc / MPhil) ✅
```

### Scenario C: Wrong Cohort Selected
```
Cohort:     January - June ❌
Department: Mining Engineering
Programme:  [Mining Engineering (MSc / MPhil) — July] ← NOT AVAILABLE!
```
**Fix**: Change cohort to `July - December` first

---

## 📄 Bulk Upload Format

```csv
Name,Index Number,Email,Programme,Department,Cohort
John Doe,UMaT/PG/001/25,john@umat.edu.gh,"Mining Engineering (MSc / MPhil) — July",Mining Engineering,July
```

⚠️ **Critical**: Programme name must match dropdown exactly (including dashes, parentheses, and spaces)!

---

## 🆘 Quick Fixes

### Problem: "Programme dropdown is empty"
**Solution**: Wrong cohort selected for that department
- Try switching cohort (January ↔ July)

### Problem: Student can't see courses
**Solution**: Programme name mismatch
- Run: `psql -f backend/fix_programme_names.sql`
- Or contact system administrator

### Problem: "Course catalog not found" error
**Solution**: Database needs fixing
- Run database migration script
- See `PROGRAMME_STANDARDIZATION_GUIDE.md`

---

## 📞 Support

For technical issues:
- Check `PROGRAMME_STANDARDIZATION_GUIDE.md`
- Run `backend/fix_programme_names.sql`
- Contact system administrator

---

**Last Updated**: 2025
**Version**: 2.0 (Standardized Enrollment)
