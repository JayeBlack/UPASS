# New Team Member Setup Guide

## Two Setup Scenarios

### Scenario 1: Connect to Existing Team Database (Recommended)
Use this if your team has a shared database that already has all tables and data.

### Scenario 2: Create Your Own Fresh Database
Use this if you need a completely new database instance for local development.

---

## Scenario 1: Connect to Existing Database

### Step 1: Clone Repository
```bash
git clone <YOUR_GIT_URL>
cd UPASS
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
```

### Step 3: Configure Database Connection
Edit `backend/.env` and add the **same DATABASE_URL** your team is using:
```
DATABASE_URL=postgresql://username:password@host:port/database_name
JWT_SECRET=your_jwt_secret
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

### Step 4: Run Migrations (Ensures Departments Exist)
```bash
node run_migrations.js
```

**Important**: This is safe to run even if departments already exist. It won't create duplicates.

### Step 5: Verify Connection
```bash
node check_db.js
```

You should see:
- ✅ 28 tables
- ✅ All users
- ✅ 10 departments
- ✅ Student data
- ✅ Fee records

### Step 6: Start Backend
```bash
npm run dev
```

### Step 7: Frontend Setup
```bash
# Go back to project root
cd ..
npm install

# Create .env file (if not exists)
cp .env.example .env
```

### Step 8: Configure Frontend Environment
Edit `.env` in project root:
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 9: Start Frontend
```bash
npm run dev
```

✅ **Done!** You're connected to the team database.

---

## Scenario 2: Create Fresh Database (Local Development)

### Prerequisites
- PostgreSQL installed locally
- PostgreSQL running on your machine

### Step 1: Clone Repository
```bash
git clone <YOUR_GIT_URL>
cd UPASS
```

### Step 2: Create Empty Database
```bash
# Using psql
createdb upass_dev

# Or using pgAdmin/GUI tool, create database named: upass_dev
```

### Step 3: Import Database Schema
```bash
cd backend

# Import the schema (creates all 28 tables)
psql -d upass_dev -f schema_export.sql

# Or on Windows with full path:
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -d upass_dev -f schema_export.sql
```

### Step 4: Backend Setup
```bash
npm install

# Create .env file
cp .env.example .env
```

### Step 5: Configure Database Connection
Edit `backend/.env` with your **local database**:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/upass_dev
JWT_SECRET=generate-a-random-secret-key
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
```

Generate JWT secret:
```bash
node scripts/generate_jwt.js
```

### Step 6: Run Migrations (Creates Departments)
```bash
node run_migrations.js
```

You should see:
```
📋 10 departments in database:
   ✓ [1] Computer Science
   ✓ [2] Electrical Engineering
   ... etc
```

### Step 7: Create Your Super Admin
```bash
node create_superadmin.js admin@test.com password123 Admin User
```

### Step 8: Verify Database Setup
```bash
node check_db.js
```

You should see:
- ✅ 28 tables
- ✅ 1 admin user
- ✅ 10 departments
- ⚠️ 0 students (empty database)

### Step 9: Start Backend
```bash
npm run dev
```

### Step 10: Frontend Setup
```bash
# Go back to project root
cd ..
npm install

# Create .env file
cp .env.example .env
```

### Step 11: Configure Frontend Environment
Edit `.env` in project root:
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### Step 12: Start Frontend
```bash
npm run dev
```

### Step 13: Login and Create Test Data
1. Go to http://localhost:5173
2. Login with your super admin credentials
3. Create test users/students as needed

✅ **Done!** You have a fresh local database.

---

## 🔄 Staying in Sync with Your Team

### When Team Updates Code

**Every time you pull changes from Git:**

```bash
# 1. Pull latest code
git pull origin main

# 2. Update backend dependencies
cd backend
npm install

# 3. Run migrations (ensures new departments/changes)
node run_migrations.js

# 4. Verify everything is working
node check_db.js

# 5. Update frontend dependencies
cd ..
npm install

# 6. Restart both servers
# Backend (in backend folder)
npm run dev

# Frontend (in project root)
npm run dev
```

### Weekly Health Check

**Run these commands weekly to verify your setup:**

```bash
cd backend

# Check database health
node check_db.js

# Verify departments are correct
node verify_departments.js

# Check student data integrity
node check_students.js
```

**Expected output:**
- ✅ All 28 tables exist
- ✅ 10 departments active
- ✅ All staff users have departments
- ✅ Student records have programs and departments

### If Something Breaks

**Run these in order:**

```bash
cd backend

# 1. Check database connection
node check_db.js

# 2. Re-run migrations (safe, won't duplicate)
node run_migrations.js

# 3. Verify departments
node verify_departments.js

# 4. If still broken, ask team lead
```

---

## 🔍 Verification Commands

### Check Database Health
```bash
cd backend
node check_db.js
```

**Shows:**
- Table count (should be 28)
- User count by role
- Student count by status
- Department list
- Fee summary
- Grade count

### Check Departments
```bash
cd backend
node verify_departments.js
```

**Shows:**
- All 10 departments
- Staff users with departments
- Users missing departments (should be empty)
- Supervisor department assignments

### Check Students
```bash
cd backend
node check_students.js
```

**Shows:**
- Total students
- Student programs
- Student departments
- User-student links

### Check Table Structure
```bash
cd backend
node check_table_structure.js
```

**Shows:**
- Table schemas
- Column types
- Relationships

---

## 🚨 Common Issues & Solutions

### "relation does not exist" error
**Problem**: Tables not created
**Solution**:
```bash
cd backend
psql -d upass_dev -f schema_export.sql
```

### "departments not showing in dropdown"
**Problem**: Departments not in database
**Solution**:
```bash
cd backend
node run_migrations.js
```

### "cannot connect to database"
**Problem**: Wrong DATABASE_URL
**Solution**: Check `backend/.env` has correct connection string

### "No schema_export.sql file"
**Problem**: Schema file missing
**Solution**:
```bash
cd backend
node export_schema.js
```

### "column 'created_at' does not exist"
**Problem**: Old migration file
**Solution**: Pull latest code with `git pull origin main`

### "npm install fails"
**Problem**: Dependency conflicts
**Solution**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📋 Quick Commands Reference

### Daily Development
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd UPASS
npm run dev
```

### After Git Pull
```bash
cd backend
npm install
node run_migrations.js
node check_db.js
```

### Create Users
```bash
cd backend
node create_superadmin.js <email> <password> <first> <last>
```

### Database Checks
```bash
cd backend
node check_db.js              # Full health check
node verify_departments.js     # Department verification
node check_students.js         # Student data check
```

### Export Schema (if needed)
```bash
cd backend
node export_schema.js
```

---

## 📁 File Structure

```
UPASS/
├── backend/
│   ├── migrations/
│   │   └── 001_ensure_departments.sql
│   ├── src/
│   ├── .env                    ← Configure this!
│   ├── .env.example
│   ├── schema_export.sql       ← Import this for fresh DB
│   ├── run_migrations.js       ← Run after git pull
│   ├── create_superadmin.js    ← Create admin user
│   ├── check_db.js             ← Verify setup
│   ├── verify_departments.js   ← Check departments
│   ├── check_students.js       ← Check student data
│   └── export_schema.js        ← Export schema if needed
├── src/                        ← Frontend code
├── .env                        ← Configure this!
├── .env.example
├── package.json
└── README.md
```

---

## ✅ Sync Checklist

**After every `git pull`:**
- [ ] Run `npm install` in backend
- [ ] Run `npm install` in project root
- [ ] Run `node run_migrations.js` in backend
- [ ] Run `node check_db.js` to verify
- [ ] Restart backend server
- [ ] Restart frontend server

**Weekly maintenance:**
- [ ] Pull latest code
- [ ] Run all verification scripts
- [ ] Check for console errors
- [ ] Test key features

---

## 📞 Getting Help

**If you're stuck:**

1. Run `node check_db.js` and share output
2. Check `.env` files are configured correctly
3. Verify PostgreSQL is running
4. Ask team lead with error messages

---

## 🎯 Summary

**First Time Setup**:
- Existing Database: Steps 1-9 (10 minutes)
- Fresh Database: Steps 1-13 (20 minutes)

**Staying in Sync**:
- After git pull: 5 commands (2 minutes)
- Weekly check: 3 commands (1 minute)

**Key Files to Configure**:
- `backend/.env` - Database connection
- `.env` - Frontend API URL

Both scenarios work perfectly! Choose based on your needs.
