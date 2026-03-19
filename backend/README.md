# UMaT Postgraduate Administrative Support System — Backend API

## Architecture

```
backend/
├── src/
│   ├── server.js                 # Express app entry point
│   ├── db/
│   │   ├── index.js              # PostgreSQL connection pool
│   │   ├── migrate.js            # Migration runner
│   │   └── migrations/           # SQL migration files (run in order)
│   ├── controllers/              # Business logic per module
│   ├── routes/                   # Express route definitions
│   └── middleware/
│       ├── auth.js               # JWT auth + role-based authorization
│       └── upload.js             # Multer file upload handler
├── uploads/                      # Uploaded files (thesis, resources, receipts)
├── .env.example                  # Environment variable template
├── package.json
└── README.md
```

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials and JWT secret

# 3. Create database
createdb umat_postgrad_db

# 4. Run migrations
npm run migrate

# 5. Start development server
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint             | Auth | Description           |
|--------|----------------------|------|-----------------------|
| POST   | /api/auth/register   | No   | Register a new user   |
| POST   | /api/auth/login      | No   | Login, returns JWT    |
| GET    | /api/auth/me         | Yes  | Get current user      |

### Students
| Method | Endpoint              | Auth   | Description                |
|--------|-----------------------|--------|----------------------------|
| GET    | /api/students         | Yes    | List all students          |
| GET    | /api/students/:id     | Yes    | Get student by ID          |
| POST   | /api/students         | Admin  | Enroll a new student       |
| PUT    | /api/students/:id     | Admin  | Update student             |
| DELETE | /api/students/:id     | Admin  | Deactivate student         |

### Supervisors
| Method | Endpoint                       | Auth | Description              |
|--------|--------------------------------|------|--------------------------|
| GET    | /api/supervisors               | Yes  | List supervisors         |
| GET    | /api/supervisors/:id           | Yes  | Get supervisor           |
| GET    | /api/supervisors/:id/students  | Yes  | Get assigned students    |
| POST   | /api/supervisors/:id/assign    | Yes  | Assign student           |

### Courses
| Method | Endpoint                             | Auth | Description            |
|--------|--------------------------------------|------|------------------------|
| GET    | /api/courses                         | Yes  | List courses           |
| GET    | /api/courses/registered/:studentId   | Yes  | Student's courses      |
| POST   | /api/courses/register                | Yes  | Register for course    |
| DELETE | /api/courses/register/:id            | Yes  | Drop course            |

### Thesis
| Method | Endpoint                     | Auth       | Description             |
|--------|------------------------------|------------|-------------------------|
| GET    | /api/thesis/student/:id      | Yes        | Student's submissions   |
| GET    | /api/thesis/pending          | Supervisor | Pending reviews         |
| POST   | /api/thesis/upload           | Yes        | Upload thesis chapter   |
| PUT    | /api/thesis/:id/review       | Supervisor | Review submission       |
| POST   | /api/thesis/:id/remarks      | Yes        | Add remark              |
| GET    | /api/thesis/:id/remarks      | Yes        | Get remarks             |

### Results & Grades
| Method | Endpoint                         | Auth   | Description           |
|--------|----------------------------------|--------|-----------------------|
| GET    | /api/results/student/:id         | Yes    | Student's results     |
| GET    | /api/results/cwa/:id             | Yes    | Student's CWA         |
| GET    | /api/results/batches             | Yes    | Result batches        |
| POST   | /api/results/grades              | Exams  | Batch grade entry     |
| PUT    | /api/results/batches/:id/publish | Exams  | Publish results       |

### Fees
| Method | Endpoint                   | Auth       | Description              |
|--------|----------------------------|------------|--------------------------|
| GET    | /api/fees/student/:id      | Yes        | Student's fees           |
| GET    | /api/fees                  | Admin/Acct | All fee records          |
| GET    | /api/fees/summary          | Admin/Acct | Fee analytics summary    |
| POST   | /api/fees/payment          | Yes        | Make payment             |
| PUT    | /api/fees/:id/clearance    | Admin/Acct | Toggle clearance         |

### Clearance
| Method | Endpoint                      | Auth  | Description             |
|--------|-------------------------------|-------|-------------------------|
| GET    | /api/clearance/student/:id    | Yes   | Student's steps         |
| GET    | /api/clearance/pending        | Dean  | Pending approvals       |
| PUT    | /api/clearance/:id/approve    | Dean  | Approve step            |
| PUT    | /api/clearance/:id/reject     | Dean  | Reject step             |
| POST   | /api/clearance/init/:id       | Admin | Init clearance steps    |

### Documents
| Method | Endpoint                    | Auth  | Description             |
|--------|-----------------------------|-------|-------------------------|
| GET    | /api/documents/student/:id  | Yes   | Student's requests      |
| POST   | /api/documents              | Yes   | New document request    |
| PUT    | /api/documents/:id/status   | Admin | Update request status   |

### Notifications
| Method | Endpoint                     | Auth  | Description             |
|--------|------------------------------|-------|-------------------------|
| GET    | /api/notifications           | Yes   | User's notifications    |
| PUT    | /api/notifications/:id/read  | Yes   | Mark as read            |
| PUT    | /api/notifications/read-all  | Yes   | Mark all as read        |
| DELETE | /api/notifications/:id       | Yes   | Delete notification     |
| POST   | /api/notifications           | Admin | Create notification     |

### Exams
| Method | Endpoint              | Auth  | Description             |
|--------|-----------------------|-------|-------------------------|
| GET    | /api/exams/timetable  | Yes   | Get exam timetable      |
| POST   | /api/exams/timetable  | Exams | Add timetable entry     |

### Analytics
| Method | Endpoint              | Auth  | Description             |
|--------|-----------------------|-------|-------------------------|
| GET    | /api/analytics/overview | Admin | School overview        |
| GET    | /api/analytics/cwa    | Admin | CWA analytics           |
| GET    | /api/analytics/fees   | Admin | Fee analytics           |

### Pass List
| Method | Endpoint                | Auth  | Description             |
|--------|-------------------------|-------|-------------------------|
| GET    | /api/passlist           | Yes   | Get graduands           |
| POST   | /api/passlist/generate  | Exams | Generate pass list      |

### Chatbot
| Method | Endpoint           | Auth | Description             |
|--------|--------------------|------|-------------------------|
| POST   | /api/chatbot/chat  | No   | Chat with SPS Assistant |

### Announcements & Resources
| Method | Endpoint                              | Auth       | Description          |
|--------|---------------------------------------|------------|----------------------|
| GET    | /api/announcements                    | Yes        | List announcements   |
| POST   | /api/announcements                    | Supervisor | Create announcement  |
| POST   | /api/announcements/:id/acknowledge    | Yes        | Acknowledge          |
| DELETE | /api/announcements/:id                | Yes        | Delete               |
| GET    | /api/resources                        | Yes        | List resources       |
| POST   | /api/resources                        | Supervisor | Upload resource      |
| DELETE | /api/resources/:id                    | Supervisor | Delete resource      |

## Linking the Chatbot

The chatbot can be deployed 3 ways:

### Option A: Standalone Chatbot Service (Recommended)
Deploy the chatbot as its own Node.js/Express or Deno service on port 5001. Set `CHATBOT_SERVICE_URL=http://localhost:5001` in the backend `.env`. The backend will proxy `/api/chatbot/chat` to the chatbot service.

### Option B: AI Gateway Direct
Set `AI_GATEWAY_URL` and `AI_GATEWAY_API_KEY` in `.env`. The backend will call the AI gateway directly with the embedded SPS knowledge base.

### Option C: Keep Current Edge Function
Continue using the Supabase Edge Function. The frontend calls the chatbot URL directly (no backend proxy needed).

## Frontend Integration

Update your frontend `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_CHATBOT_URL=http://localhost:5000/api/chatbot/chat
```

Replace Supabase client calls with standard fetch/axios calls to `VITE_API_URL`.

## Roles & Permissions

| Role          | Access Level |
|---------------|-------------|
| Student       | Own data only (courses, results, fees, thesis, clearance) |
| Supervisor    | Assigned students, thesis reviews, AI assistant, announcements |
| Admin         | Full system access, student management, analytics |
| Dean          | Clearance approvals, CWA results, analytics |
| Accountant    | Fee management, financial analytics, reports |
| ExamsOfficer  | Grade entry, pass list, result publishing |
