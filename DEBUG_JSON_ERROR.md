# Debugging JSON Upload Errors

## What to Check

### 1. Check Browser Console (F12)
Open your browser's developer console and look for error messages when uploading the file. The error will show:
- The exact error message
- The response from the server
- Any network errors

### 2. Check Backend Logs
Look at your backend terminal where `npm run dev` is running. You should see:
- The incoming request
- Any parsing errors
- Stack traces if errors occur

### 3. Common JSON Errors and Fixes

#### Error: "Unexpected token < in JSON"
**Cause:** Backend is returning HTML instead of JSON (likely an error page)

**Fix:**
- Check if backend is running (`cd backend && npm run dev`)
- Check if the route is registered correctly
- Verify `VITE_API_URL` in frontend `.env`

#### Error: "Failed to parse file"
**Cause:** Excel/CSV file has formatting issues

**Fix:**
- Ensure file has headers in first row
- Check file encoding (should be UTF-8)
- Verify file is not password-protected
- Try re-saving the file

#### Error: "No file uploaded"
**Cause:** File didn't reach the backend

**Fix:**
- Check network tab in browser (F12 → Network)
- Verify FormData is sending the file
- Check file size (must be < 50MB)

#### Error: "Server returned invalid response"
**Cause:** Backend crashed or returned non-JSON

**Fix:**
- Restart backend server
- Check backend logs for crash errors
- Verify xlsx package is installed (`npm list xlsx`)

### 4. Test Backend Directly

Use Postman or curl to test the endpoint:

```bash
curl -X POST http://localhost:5000/api/results/parse-grades-file \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@sample_grades.csv"
```

Expected response:
```json
{
  "data": [
    ["Index Number", "Student Name", "Course Name", "Credit Hours", "Marks"],
    ["UMaT/PG/0234/22", "John Doe", "Advanced Mathematics", "3", "85"]
  ]
}
```

### 5. Verify Package Installation

```bash
cd backend
npm list xlsx
npm list multer
```

Both should be installed. If not:
```bash
npm install xlsx multer
```

### 6. Check File Format

Your CSV/Excel should look like:

**Row 1 (Headers):**
```
Index Number,Student Name,Course Name,Credit Hours,Marks
```

**Row 2+ (Data):**
```
UMaT/PG/0234/22,John Doe,Advanced Mathematics,3,85
```

### 7. Environment Variables

**Frontend** (`.env` in root):
```
VITE_API_URL=http://localhost:5000/api
```

**Backend** (`backend/.env`):
```
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
PORT=5000
```

### 8. Check Token

The upload requires authentication. Verify:
1. You're logged in
2. Token exists: `localStorage.getItem("token")` in browser console
3. Token is valid (not expired)

### 9. Quick Test Script

Create `backend/test_upload.js`:

```javascript
const xlsx = require('xlsx');

try {
  const workbook = xlsx.readFile('../sample_grades.csv');
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: "" });
  
  console.log('✅ File parsed successfully!');
  console.log('Rows:', data.length);
  console.log('First 3 rows:', data.slice(0, 3));
} catch (err) {
  console.error('❌ Parse error:', err.message);
}
```

Run it:
```bash
cd backend
node test_upload.js
```

### 10. Step-by-Step Debug

1. **Verify backend is running:**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check route is registered:**
   Look in `backend/src/server.js` for:
   ```javascript
   app.use("/api/results", resultRoutes);
   ```

3. **Verify file upload middleware:**
   In `backend/src/routes/resultRoutes.js`:
   ```javascript
   const upload = require("../middleware/upload");
   router.post("/parse-grades-file", ..., upload.single("file"), ...);
   ```

4. **Check uploads directory exists:**
   ```bash
   cd backend
   ls -la uploads/
   ```
   If not: `mkdir uploads`

5. **Test with minimal file:**
   Create `test.csv`:
   ```
   Index Number,Student Name,Course Name,Credit Hours,Marks
   UMaT/PG/0234/22,Test Student,Test Course,3,85
   ```
   Try uploading this.

## Still Having Issues?

Share the following information:
1. **Exact error message** from browser console
2. **Backend logs** from terminal
3. **Network tab** screenshot showing the request/response
4. **File first 5 lines** of your CSV/Excel

## Quick Fixes

### Fix 1: Restart Everything
```bash
# Stop all (Ctrl+C in both terminals)

# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
npm install
npm run dev
```

### Fix 2: Clear Cache
- Clear browser cache (Ctrl+Shift+Delete)
- Clear localStorage: 
  ```javascript
  // In browser console
  localStorage.clear()
  // Then login again
  ```

### Fix 3: Recreate uploads Directory
```bash
cd backend
rm -rf uploads
mkdir uploads
chmod 755 uploads
```

### Fix 4: Check File Permissions
```bash
cd backend
chmod +r ../sample_grades.csv
```

## Success Indicators

When working correctly, you should see:

**Browser Console:**
```
POST http://localhost:5000/api/results/parse-grades-file 200 OK
```

**Backend Logs:**
```
POST /api/results/parse-grades-file 200 52.123 ms
```

**Frontend Toast:**
```
✓ X rows imported
  All rows validated successfully
```
