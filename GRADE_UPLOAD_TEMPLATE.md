# Grade Upload Template

## Excel/CSV Format for Grade Entry

When uploading grades through the Exams Officer's Grade Entry page, use the following format:

### Column Structure

| Index Number | Student Name | Course Name | Credit Hours | Marks |
|--------------|--------------|-------------|--------------|-------|
| UMaT/PG/0234/22 | John Doe | Advanced Mathematics | 3 | 85 |
| UMaT/PG/0235/22 | Jane Smith | Data Structures | 4 | 92 |

### Column Details

1. **Index Number** (Required)
   - Format: `UMaT/PG/XXXX/YY`
   - Example: `UMaT/PG/0234/22`
   - Must match existing student records

2. **Student Name** (Required)
   - Full name of the student
   - Example: `John Doe`

3. **Course Name** (Required)
   - Full course name
   - Example: `Advanced Mathematics`
   - If course doesn't exist, it will be created automatically

4. **Credit Hours** (Required)
   - Must be a positive number
   - Example: `3`

5. **Marks** (Required)
   - Must be between 0 and 100
   - Example: `85`
   - Grade is calculated automatically:
     - 80-100: A
     - 70-79: B
     - 60-69: C
     - 50-59: D
     - 0-49: F

### File Format Support

- **.xlsx** (Excel)
- **.xls** (Excel legacy)
- **.csv** (Comma-separated values)

### Example CSV Content

```csv
Index Number,Student Name,Course Name,Credit Hours,Marks
UMaT/PG/0234/22,John Doe,Advanced Mathematics,3,85
UMaT/PG/0234/22,John Doe,Data Structures,4,78
UMaT/PG/0235/22,Jane Smith,Advanced Mathematics,3,92
UMaT/PG/0235/22,Jane Smith,Data Structures,4,88
```

### Upload Process

1. Prepare your Excel/CSV file with the correct format
2. Select Semester and Academic Year
3. Click "Upload CSV / Excel" button
4. Select your file
5. System validates all rows automatically
6. Fix any validation errors (shown in red)
7. Click "Calculate CWA" to compute student averages
8. Click "Publish Results" to make grades visible to students

### Validation Rules

- All fields are required
- Index number must match format `UMaT/PG/XXXX/YY`
- Credit hours must be a positive number
- Marks must be between 0 and 100
- Student must exist in the system

### Notes

- Duplicate entries for the same student and course will update existing grades
- Students receive automatic notifications when results are published
- CWA (Cumulative Weighted Average) is calculated as: Σ(marks × credits) / Σ(credits)
