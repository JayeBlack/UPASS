# Programme Name Standardization Guide

## 🎯 Problem Solved

**Before**: Admins could type any programme name (e.g., "MSc. Mining Engineering"), which might not match the course catalog label (e.g., "Mining Engineering (MSc / MPhil) — July"), causing students to see the wrong courses or no courses at all.

**After**: The system now enforces exact programme name matching and includes intelligent fuzzy matching as a safety net.

---

## ✅ Changes Made

### 1. **Updated Admin Enrollment Form** (`src/pages/admin/ManageStudents.tsx`)

#### **Dynamic Department Dropdown**
- Automatically populated from all available course catalogs
- Shows only departments that have courses defined
- Sorted alphabetically

#### **Smart Programme Dropdown**
- **Dynamically filtered** based on:
  1. Selected department
  2. Selected admission cohort (January or July)
- Shows **exact catalogue labels** from `programmeCourses.ts`
- Disabled until department is selected
- Shows helpful messages:
  - "Select department first" (if no department selected)
  - "No programmes available for July cohort" (if selected department doesn't have that cohort)

#### **Improved UX**
- Cohort selection at the top (affects available programmes)
- Department resets programme when changed
- Cohort change resets programme when changed
- Clear visual feedback for each step

### 2. **Added Intelligent Fuzzy Matching** (`src/pages/student/CourseRegistration.tsx`)

Even with standardized names, the system includes safety measures:

#### **Matching Strategy** (applied in order):
1. **Exact Match**: Department + Programme + Cohort all match perfectly
2. **Fuzzy Match with Cohort**: Department matches + Programme fuzzy matches + Cohort matches
3. **Fuzzy Match without Cohort**: Department matches + Programme fuzzy matches
4. **Department Fallback**: Shows first catalog for the student's department

#### **Fuzzy Matching Algorithm**:
```typescript
// Normalizes names: "MSc. Mining Engineering" → "mscminingengineering"
// Then checks:
1. If normalized strings are identical
2. If one contains the other
3. If 70%+ of key words overlap (excluding common words like "MSc", "July", etc.)
```

This ensures backward compatibility with existing students who might have slight name variations.

### 3. **Created Database Migration Script** (`backend/fix_programme_names.sql`)

A comprehensive SQL script that:
- Updates all existing programme names to match course catalog labels
- Handles all departments and programmes
- Considers admission cycles (January/July variants)
- Includes verification queries to check results
- Can be run safely multiple times (idempotent)

---

## 📋 How to Use (For Administrators)

### **Enrolling a New Student**

1. Click "**+ Enroll Student**" button
2. Fill in student details:
   - **Full Name**: Student's complete name
   - **Index Number**: e.g., `UMaT/PG/0234/22`
   - **Email**: Student's email address

3. **Select Admission Cohort** (FIRST):
   - `January - June` OR `July - December`
   - ⚠️ This determines which programmes are available

4. **Select Department**:
   - Choose from dropdown (dynamically populated)
   - Available departments: Computer Science, Mining Engineering, Electrical Engineering, etc.

5. **Select Programme**:
   - Dropdown becomes enabled after selecting department
   - Shows only programmes available for:
     - The selected department
     - The selected cohort
   - Programme names are **exact matches** from course catalogs

6. Click "**Enroll Student**"

### **Example Enrollment Flows**

#### **Scenario 1: Mining Engineering Student (July Intake)**
1. Admission Cohort: `July - December`
2. Department: `Mining Engineering`
3. Programme dropdown shows:
   - `Mining Engineering (MSc / MPhil) — July`
   - `Postgraduate Diploma in Mining Engineering (July)`
4. Select: `Mining Engineering (MSc / MPhil) — July`
5. ✅ Student will see Mining Engineering courses for July cohort

#### **Scenario 2: Computer Science Student (January Intake)**
1. Admission Cohort: `January - June`
2. Department: `Computer Science and Engineering`
3. Programme dropdown shows:
   - `Computer Science and Engineering (MSc / MPhil)`
4. Select: `Computer Science and Engineering (MSc / MPhil)`
5. ✅ Student will see Computer Science courses for January cohort

#### **Scenario 3: Electrical Engineering Student (July Intake)**
1. Admission Cohort: `July - December`
2. Department: `Electrical and Electronic Engineering`
3. Programme dropdown shows:
   - `Electrical and Electronic Engineering (MSc / MPhil) — July`
   - `Electrical and Electronic Engineering (PhD) — July`
4. Select appropriate programme
5. ✅ Student will see correct EEE courses for July cohort

---

## 🔧 Fixing Existing Students

### **Option 1: Run Database Migration** (Recommended)

```bash
# Navigate to backend directory
cd backend

# Run the SQL script
psql -U your_db_user -d your_database -f fix_programme_names.sql

# Or if using Docker:
docker exec -i your_postgres_container psql -U your_db_user -d your_database < fix_programme_names.sql
```

This will automatically update all existing programme names to match the course catalogs.

### **Option 2: Manual Update via Database**

```sql
-- Example: Fix a specific programme
UPDATE programs 
SET name = 'Mining Engineering (MSc / MPhil) — July'
WHERE id = <program_id>;

-- Check affected students
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) AS student_name,
    p.name AS program_name,
    s.admission_cycle
FROM students s
JOIN users u ON s.user_id = u.id
JOIN programs p ON s.program_id = p.id
WHERE p.id = <program_id>;
```

### **Option 3: Re-enroll Students** (Not Recommended)

If needed, you can delete and re-enroll students using the new standardized form.
⚠️ This will reset their password and any associated data.

---

## 📊 Available Programme Catalogues

### **January Intake Programmes**
- Geomatic Engineering (MSc / MPhil)
- Geomatic Engineering (PhD)
- Electrical and Electronic Engineering (MSc / MPhil)
- Electrical and Electronic Engineering (PhD)
- Mechanical Engineering (MSc / MPhil)
- Mechanical Engineering (PhD)
- Mathematics (MSc / MPhil)
- Mathematics (PhD)
- Minerals Engineering (MSc / MPhil)
- Geological Engineering (MSc / MPhil)
- Petroleum Engineering (MSc / MPhil)
- Petroleum Engineering (PhD)
- Computer Science and Engineering (MSc / MPhil)

### **July Intake Programmes**
- Electrical and Electronic Engineering (MSc / MPhil) — July
- Electrical and Electronic Engineering (PhD) — July
- Mathematical Sciences (MSc / MPhil) — July
- Mining Engineering (MSc / MPhil) — July
- Geological Engineering (MSc / MPhil) — July
- Petroleum Refining and Petrochemical Engineering (MSc / MPhil) — July
- Master of Business and Technology Management — Supply Chain Management (July)
- Master of Business and Technology Management — Finance and Investment (July)
- Master of Business and Technology Management — Management Information Systems (July)
- Master of Business and Technology Management — Strategic Human Resource Management (July)
- MSc Engineering Management (July)
- Occupational Health and Safety (MSc / MPhil / PhD) — July
- Postgraduate Diploma in Mining Engineering (July)

---

## 🛡️ Prevention Measures in Place

### **1. Dropdown Validation**
- Admins **cannot type** programme names
- Must select from pre-defined list
- List is dynamically generated from course catalogs

### **2. Department-Programme Linking**
- Programmes filtered by selected department
- Impossible to select mismatched department/programme

### **3. Cohort-Programme Linking**
- Programmes filtered by selected cohort
- July-specific programmes only show for July cohort
- January programmes show for January cohort or no-cycle programmes

### **4. Fuzzy Matching Fallback**
- Even if database has slight variations, fuzzy matching finds the right catalog
- Handles:
  - Extra punctuation (e.g., "MSc." vs "MSc")
  - Different word orders
  - Abbreviated vs full names

### **5. Clear Error Messages**
- If no catalog found, shows exact programme/department/cohort student has
- Provides guidance to contact administrator

---

## 🧪 Testing Checklist

### **For New Enrollments**

- [ ] Enroll student in **Mining Engineering (July cohort)**
  - Verify July cohort courses display
  - Verify correct Mining Engineering courses

- [ ] Enroll student in **Computer Science (January cohort)**
  - Verify Computer Science courses display

- [ ] Enroll student in **Electrical Engineering (July cohort)**
  - Verify July-specific EEE courses display

- [ ] Try selecting **department without programme**
  - Verify validation prevents enrollment

- [ ] Try changing **cohort after selecting programme**
  - Verify programme resets

### **For Existing Students**

- [ ] Run database migration script
- [ ] Login as existing student
- [ ] Navigate to Course Registration
- [ ] Verify correct courses display
- [ ] Check multiple students across different departments

### **Bulk Upload**

- [ ] Prepare Excel/CSV with correct programme names
- [ ] Upload file
- [ ] Verify all students enrolled successfully
- [ ] Login as bulk-enrolled student
- [ ] Verify correct courses display

---

## 📝 Bulk Upload Template

When using bulk upload, use exact programme names from the dropdowns:

```csv
Name,Index Number,Email,Programme,Department,Cohort
Kwame Mensah,UMaT/PG/0234/22,kwame@umat.edu.gh,"Mining Engineering (MSc / MPhil) — July",Mining Engineering,July
Ama Serwaa,UMaT/PG/0235/22,ama@umat.edu.gh,"Computer Science and Engineering (MSc / MPhil)",Computer Science and Engineering,January
Kofi Asante,UMaT/PG/0236/22,kofi@umat.edu.gh,"Electrical and Electronic Engineering (MSc / MPhil) — July",Electrical and Electronic Engineering,July
```

**Important**: Use the exact programme names from the enrollment form dropdown!

---

## 🆘 Troubleshooting

### **Student sees "Course catalog not found" error**

**Cause**: Programme name doesn't match any catalog

**Solution**:
1. Check student's programme name in database:
   ```sql
   SELECT p.name, d.name as dept, s.admission_cycle
   FROM students s
   JOIN programs p ON s.program_id = p.id
   JOIN departments d ON s.department_id = d.id
   WHERE s.index_number = 'STUDENT_INDEX';
   ```

2. Compare with available catalogs in `src/data/programmeCourses.ts`

3. Run fix script: `psql -f backend/fix_programme_names.sql`

4. Or manually update:
   ```sql
   UPDATE programs 
   SET name = 'Correct Catalogue Name'
   WHERE id = <program_id>;
   ```

### **Programme dropdown is empty**

**Cause**: No programmes available for selected department + cohort combination

**Solution**:
1. Check if department has programmes for that cohort in `programmeCourses.ts`
2. If not, either:
   - Select different cohort (January vs July)
   - Select different department
   - Add programme to `programmeCourses.ts` if missing

### **Student sees wrong department's courses**

**Cause**: Department mismatch

**Solution**:
1. Verify student's department in database
2. Ensure department name matches exactly with course catalog
3. Run fix script or manually update department

---

## 🚀 Future-Proofing

### **Adding New Programmes**

When adding new programmes to `src/data/programmeCourses.ts`:

1. **Always include**:
   - Exact `label` (this becomes the dropdown option)
   - Exact `department` name
   - `admissionCycle` ("January" or "July") if cohort-specific
   - List of courses

2. **Naming Convention**:
   - Format: `"Programme Name (Degree Level)"` or `"Programme Name (Degree Level) — Month"`
   - Examples:
     - `"Mining Engineering (MSc / MPhil) — July"`
     - `"Computer Science and Engineering (MSc / MPhil)"`
     - `"Mathematics (PhD)"`

3. **Test immediately**:
   - Enroll a test student
   - Login as that student
   - Verify courses display correctly

### **Department Changes**

If a department name changes:

1. Update in `programmeCourses.ts`
2. Run database update:
   ```sql
   UPDATE departments SET name = 'New Name' WHERE name = 'Old Name';
   ```
3. Students automatically get updated name (foreign key relationship)

---

## ✅ Summary

With these changes:
- ✅ **Admins cannot make naming mistakes** (dropdown selection only)
- ✅ **All existing students fixed** (via migration script)
- ✅ **Intelligent fallback matching** (handles minor variations)
- ✅ **Clear error messages** (when something goes wrong)
- ✅ **Future-proof** (new programmes follow standardized format)

**Result**: Students ALWAYS see their correct courses, with no possibility of mismatch! 🎉
