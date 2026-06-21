# UPASS Deployment & Sync Guide


## 🎯 New Team Member Setup

See **[NEW_MEMBER_SETUP.md](NEW_MEMBER_SETUP.md)** for complete instructions.

**Quick start for existing database:**
```bash
git clone <YOUR_GIT_URL>
cd UPASS/backend
npm install
cp .env.example .env
# Edit .env with team DATABASE_URL
node run_migrations.js
npm run dev
```

**Quick start for fresh database:**
```bash
createdb upass_dev
cd backend
psql -d upass_dev -f schema_export.sql
npm install
cp .env.example .env
# Edit .env with local DATABASE_URL
node run_migrations.js
node create_superadmin.js admin@test.com pass123 Admin User
npm run dev
```

---

## 🔄 Staying in Sync (Critical!)

### Every Time You Pull Code

**All team members must run these commands after every `git pull`:**

```bash
# 1. Pull latest changes
git pull origin main

# 2. Update backend dependencies
cd backend
npm install

# 3. Run migrations (safe - automatically runs all .sql files)
node src/db/migrate.js
node run_migrations.js


# 4. Verify database health
node check_db.js

# 5. Update frontend dependencies
cd ..
npm install

# 6. Restart servers
```

**Why?** This ensures:
- New dependencies are installed
- Database changes are applied (20+ migration files in `src/db/migrations/`)
- All tables and columns are up-to-date
- Everyone has same schema

### Weekly Health Check

**Run these commands weekly:**

```bash
cd backend

# Full database check
node check_db.js

# Department verification
node verify_departments.js

# Student data check
node check_students.js
```

**Expected results:**
- ✅ 28 tables
- ✅ 10 departments
- ✅ All staff have departments
- ✅ No console errors

---

## 📋 Critical Files

### Database Schema
- **`backend/schema_export.sql`** - Complete table definitions (28 tables)
- **`backend/src/db/migrations/`** - All migration files (001-020)
- **`backend/src/db/migrate.js`** - Migration runner (idempotent)
- **`backend/migrations/001_ensure_departments.sql`** - Legacy department migration

### Setup Scripts
- **`backend/create_superadmin.js`** - Create first admin
- **`backend/export_schema.js`** - Generate schema file

### Verification Scripts
- **`backend/check_db.js`** - Full database health check
- **`backend/verify_departments.js`** - Department verification
- **`backend/check_students.js`** - Student data verification
- **`backend/check_table_structure.js`** - Table schema check

---

## 🗄️ Database Info

### Migration System
The system uses **idempotent migrations** in `backend/src/db/migrations/`:
- 20+ migration files (001-020)
- Run with: `node src/db/migrate.js`
- Safe to run multiple times
- Auto-skips existing tables/columns

### Migration Files
1. `001_create_users.sql` - Users and authentication
2. `002_create_departments_programs.sql` - 10 departments
3. `003_create_students.sql` - Student records
4. `008_create_fees.sql` - Fee records and payments
5. `020_add_credit_balance.sql` - Credit balance feature
6. ...and 15 more

### 28 Tables
- users, students, supervisors
- departments, programs, courses
- fee_records, payments, grades
- thesis_submissions, announcements
- clearance_steps, graduands
- and 15 more...

### 10 Departments
1. Computer Science
2. Electrical Engineering
3. Environmental and Safety Engineering
4. Finance Office
5. Geomatic Engineering
6. Mathematical Sciences
7. Mechanical Engineering
8. Mining Engineering
9. Petroleum Engineering
10. School of Postgraduate Studies

---

## 🚨 Common Issues

### "Departments not showing"
```bash
cd backend
node src/db/migrate.js
```

### "Tables don't exist"
```bash
cd backend
psql -d your_database -f schema_export.sql
```

### "Column 'credit_balance' does not exist"
```bash
cd backend
node src/db/migrate.js  # Runs migration 020
```

### "Cannot connect to database"
Check `backend/.env` has correct `DATABASE_URL`

---

## ✅ Sync Checklist

**After every git pull:**
- [ ] `npm install` in backend
- [ ] `npm install` in root
- [ ] `node src/db/migrate.js`
- [ ] `node check_db.js`
- [ ] Restart servers

**Weekly:**
- [ ] Pull latest code
- [ ] Run all checks
- [ ] Verify no errors

---

## 📞 Support

For setup issues, see [NEW_MEMBER_SETUP.md](NEW_MEMBER_SETUP.md) or ask team lead.
