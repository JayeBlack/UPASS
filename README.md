# UPASS - University Postgraduate Administration & Support System

A comprehensive system for managing postgraduate students, fees, clearances, thesis submissions, and academic records at UMaT.

## 🚀 New Team Member? Start Here!

**📖 [Complete Setup Guide](NEW_MEMBER_SETUP.md)** - Follow this for detailed setup instructions

### Quick Start

#### For Existing Team Database
```bash
git clone <YOUR_GIT_URL>
cd UPASS/backend
npm install
cp .env.example .env
# Edit .env with team's DATABASE_URL
node run_migrations.js
npm run dev
```

#### For Fresh Local Database
```bash
# 1. Create database
createdb upass_dev

# 2. Import schema
cd backend
psql -d upass_dev -f schema_export.sql

# 3. Setup
npm install
cp .env.example .env
# Edit .env with your local DATABASE_URL
node run_migrations.js
node create_superadmin.js admin@test.com pass123 Admin User
npm run dev
```

**See [NEW_MEMBER_SETUP.md](NEW_MEMBER_SETUP.md) for complete step-by-step instructions!**

---

## 📋 Project Structure

```
UPASS/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth & validation
│   │   └── db/           # Database connection
│   ├── migrations/       # Database migrations
│   ├── schema_export.sql # Full database schema
│   └── .env             # Environment config
├── src/                 # React frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth, etc)
│   └── lib/             # Utilities & API client
├── supabase/            # Supabase functions (thesis storage)
└── public/              # Static assets
```

---

## 🛠 Technologies

### Frontend
- **React** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn-ui** - UI components
- **React Router** - Navigation

### Backend
- **Node.js** + **Express**
- **PostgreSQL** - Main database
- **Supabase** - File storage (thesis documents)
- **JWT** - Authentication
- **bcrypt** - Password hashing

---

## 👥 User Roles

- **Student** - View fees, submit thesis, check clearance
- **Supervisor** - Manage students, review thesis, post resources
- **Admin** - Manage users and system settings
- **Dean / ViceDean** - Departmental oversight
- **Registrar** - Student records management
- **AdminAssistant** - Administrative support
- **Accountant / AccountingAssistant** - Fee management
- **ExamsOfficer** - Exam and results management

---

## 🔑 Key Features

- ✅ Student enrollment & management
- ✅ Fee tracking & clearance
- ✅ Thesis submission & review
- ✅ Supervisor-student assignment
- ✅ Department-based access control
- ✅ Analytics dashboard
- ✅ Document uploads
- ✅ Announcement system
- ✅ Exam timetable management
- ✅ Grade/result management

---

## 📚 Documentation

- **[NEW_MEMBER_SETUP.md](NEW_MEMBER_SETUP.md)** - Complete setup guide for new team members
- **[backend/SETUP_INSTRUCTIONS.md](backend/SETUP_INSTRUCTIONS.md)** - Backend-specific setup
- **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Deployment checklist
- **[CLEANUP_GUIDE.md](CLEANUP_GUIDE.md)** - File cleanup reference

---

## 🗄 Database

### Setup Commands

```bash
# Export current schema (if needed)
cd backend
node export_schema.js

# Import schema to new database
psql -d database_name -f schema_export.sql

# Run migrations (creates departments)
node run_migrations.js

# Verify database
node check_db.js
```

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

## 🔐 Default Passwords

- **Students**: Index number (e.g., PG1234567)
- **Staff**: Email prefix before @ (e.g., "john" for john@umat.edu.gh)
- All users must change password on first login

---

## 🚀 Development

### Backend
```bash
cd backend
npm run dev  # Runs on port 5000
```

### Frontend
```bash
npm run dev  # Runs on port 5173
```

### Environment Variables

**Backend** (`backend/.env`):
```
DATABASE_URL=postgresql://user:pass@host:port/dbname
JWT_SECRET=your-secret-key
PORT=5000
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
```

**Frontend** (`.env`):
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 🧪 Useful Scripts

### Backend Scripts
```bash
cd backend

# Database management
node run_migrations.js           # Run migrations
node export_schema.js            # Export database schema
node create_superadmin.js        # Create super admin user

# Verification
node check_db.js                 # Check database health
node verify_departments.js       # Verify staff departments
node check_students.js           # Verify student data
node check_table_structure.js    # Check table schemas
node verify_grade_system.js      # Verify grade entry system

# Utility
node scripts/generate_jwt.js     # Generate JWT secret
```

---

## 📝 Grade Entry System

The exams officer can upload grades via Excel/CSV files:

### Quick Start
```bash
# 1. Login as Exams Officer
# 2. Navigate to Grade Entry page
# 3. Upload sample_grades.csv (or your own file)
# 4. Calculate CWA
# 5. Publish Results
```

### Documentation
- **[GRADE_ENTRY_TESTING.md](GRADE_ENTRY_TESTING.md)** - Complete testing guide
- **[GRADE_UPLOAD_TEMPLATE.md](GRADE_UPLOAD_TEMPLATE.md)** - File format specification
- **[GRADE_ENTRY_QUICKREF.md](GRADE_ENTRY_QUICKREF.md)** - Quick reference card
- **[GRADE_SYSTEM_SUMMARY.md](GRADE_SYSTEM_SUMMARY.md)** - Implementation details

### File Format
```csv
Index Number,Student Name,Course Name,Credit Hours,Marks
UMaT/PG/0234/22,John Doe,Advanced Mathematics,3,85
UMaT/PG/0235/22,Jane Smith,Data Structures,4,92
```

---

## 📝 Contributing

1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and test locally
4. Commit: `git commit -m "Description"`
5. Push: `git push origin feature/your-feature`
6. Create Pull Request

---

## 🆘 Troubleshooting

### "Departments not showing in dropdown"
```bash
cd backend
node run_migrations.js
```

### "Cannot connect to database"
Check `backend/.env` has correct `DATABASE_URL`

### "No super admin exists"
```bash
cd backend
node create_superadmin.js admin@test.com pass123 Admin User
```

### "Tables don't exist"
```bash
cd backend
psql -d your_database -f schema_export.sql
```

---

## 📞 Support

For setup issues, see [NEW_MEMBER_SETUP.md](NEW_MEMBER_SETUP.md) or ask your team lead.

---

## 📄 License

University of Mines and Technology (UMaT) - Internal Project
