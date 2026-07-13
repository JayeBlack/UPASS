# CHAPTER 4: SYSTEM IMPLEMENTATION AND RESULTS

---

## 4.1 Development Environment and Tools

The UMaT Postgraduate Administrative Support System (UPASS) was developed using a modern, open-source technology stack. The primary development environment was Visual Studio Code, chosen for its robust TypeScript and Node.js tooling, integrated terminal, and extensive extension ecosystem. The following libraries and frameworks were employed:

**Frontend:**
- React 18 with TypeScript (via Vite 8 and the SWC compiler plugin) for the user interface
- React Router DOM v6 for client-side routing and navigation
- TanStack React Query v5 for server-state management and data fetching
- Tailwind CSS v3 with shadcn/ui (built on Radix UI primitives) for accessible, composable component design
- Recharts for data visualisation and analytics charts
- jsPDF and jsPDF-AutoTable for client-side PDF generation (clearance certificates, financial reports)
- Lucide React for iconography

**Backend:**
- Node.js with Express.js v4 as the REST API server
- PostgreSQL v15 as the relational database management system
- `pg` (node-postgres) as the database driver
- `bcryptjs` for password hashing
- `jsonwebtoken` (JWT) for stateless authentication
- `helmet` for HTTP security headers
- `express-rate-limit` for brute-force protection
- `multer` for multipart file uploads
- `xlsx` for server-side Excel/CSV parsing
- `morgan` for HTTP request logging
- Cloudinary SDK for optional cloud-based file storage
- Groq SDK (via `node-fetch`) for AI language model integration

**Development Utilities:**
- `nodemon` for automatic server restarts during development
- `dotenv` for environment variable management
- Vitest and Testing Library for frontend unit testing

---

## 4.2 System Architecture Implementation

UPASS follows a classic three-tier architecture, separating the presentation layer (React frontend), the application logic layer (Node.js/Express backend), and the data persistence layer (PostgreSQL database).

### 4.2.1 Frontend–Backend Communication

The frontend communicates with the backend exclusively through a centralised HTTP client defined in `src/lib/api.ts`. The `apiFetch` utility function wraps the native browser `fetch` API, automatically attaching the JWT Bearer token from `localStorage` to every outgoing request via the `Authorization` header. It also handles `Content-Type` negotiation, distinguishing between JSON payloads and `FormData` (for file uploads), and provides uniform error handling by throwing a typed `ApiError` with the HTTP status code. The base URL is configured via the `VITE_API_BASE_URL` environment variable, defaulting to `/api` for proxied development environments.

The backend server, defined in `backend/src/server.js`, is an Express application that mounts all API routes under the `/api` prefix. Cross-Origin Resource Sharing (CORS) is configured to accept requests only from origins listed in the `CORS_ORIGINS` environment variable, preventing unauthorised cross-origin access. HTTP security headers are applied globally using the `helmet` middleware, including a strict Content Security Policy (CSP). A general rate limiter (300 requests per 15 minutes per IP) is applied to all routes, with a stricter limiter (20 requests per 15 minutes) applied specifically to the `/api/auth` routes to mitigate credential-stuffing attacks. A separate data limiter (100 requests per 15 minutes) is applied to the fee management routes.

### 4.2.2 Database Connection

The database connection is managed through a singleton `pg.Pool` instance in `backend/src/db/index.js`, which reads the `DATABASE_URL` connection string from the environment. Connection pooling ensures that the application reuses existing database connections efficiently rather than opening a new connection for every request, which is critical for performance under concurrent load.

### 4.2.3 File Storage Strategy

The system supports two file storage strategies, selected at runtime via the presence of Cloudinary credentials in the environment. When Cloudinary credentials are configured, uploaded files (thesis documents, avatars, fee schedules) are streamed directly to Cloudinary's cloud storage, and the returned secure URL is persisted in the database. In the absence of Cloudinary credentials, files are stored on the local filesystem under the `backend/uploads/` directory, organised into subdirectories by type (`thesis/`, `documents/`, `general/`, `supervisor-resources/`). Critically, the uploads directory is not served as a static asset; all file access is routed through authenticated controller endpoints to prevent unauthenticated direct file access.

[INSERT SCREENSHOT: System Architecture Diagram showing React frontend, Express API, and PostgreSQL database tiers]

---

## 4.3 Authentication and Role-Based Access Control (RBAC)

### 4.3.1 Authentication Flow

Authentication is implemented using a stateless JWT strategy. When a user submits their credentials to `POST /api/auth/login`, the `authController` queries the `users` table for an active account matching the provided email address. The submitted password is compared against the stored bcrypt hash using `bcrypt.compare`. Upon successful verification, the server signs a JWT containing the user's `id`, `email`, `role`, `department_id`, and `is_super_admin` flag, with a configurable expiry (defaulting to 24 hours). This token is returned to the client, which stores it in `localStorage` under the key `umat_sps_token`.

For role-specific profile enrichment, the login endpoint performs additional database queries after authentication. For a `Student` role, it joins the `students`, `programs`, and `departments` tables to retrieve the student's index number, programme name, and department. For a `Supervisor` role, it retrieves the staff ID and department from the `supervisors` table. This enriched user object is returned alongside the token and stored in the React `AuthContext`.

On subsequent page loads, the `AuthProvider` component (in `src/contexts/AuthContext.tsx`) detects a stored token and calls `GET /api/auth/me` to re-validate the session and refresh the user object from the server. Security-sensitive fields (`isSuperAdmin`, `mustChangePassword`) are deliberately stripped from the `localStorage` cache and are always re-fetched from the server to prevent client-side tampering.

### 4.3.2 Mandatory First-Login Password Reset

All newly created accounts have the `must_change_password` flag set to `TRUE` in the database. The `RequireAuth` component (in `src/components/RequireAuth.tsx`) intercepts every navigation event. If the authenticated user's `mustChangePassword` flag is `true` and they are not already on the `/change-password` route, they are immediately redirected to the password change page. This mechanism ensures that all users set a personal password before accessing any system functionality.

### 4.3.3 Server-Side Role Enforcement

On the backend, route protection is implemented through two middleware functions in `backend/src/middleware/auth.js`. The `authenticate` middleware extracts the Bearer token from the `Authorization` header and verifies it using `jwt.verify`. If the token is valid, the decoded payload (containing `id`, `email`, and `role`) is attached to the `req.user` object for downstream use. The `authorize` middleware is a higher-order function that accepts a list of permitted roles and returns a middleware that compares `req.user.role` against that list, returning a `403 Forbidden` response if the role is not permitted.

### 4.3.4 Client-Side Route Protection

On the frontend, route protection is implemented through two React components. `RequireAuth` (in `src/components/RequireAuth.tsx`) wraps all protected routes and redirects unauthenticated users to the login page. `RoleGuard` (in `src/components/RoleGuard.tsx`) wraps role-specific routes and accepts an `allowedRoles` array. If the authenticated user's role is not in the permitted list, they are redirected to `/dashboard`. Super-administrators bypass the `RoleGuard` check entirely, granting them access to all routes. The route definitions in `src/App.tsx` compose these two guards, for example:

```
<Route path="/exams/grades"
  element={
    <RequireAuth>
      <RoleGuard allowedRoles={["ExamsOfficer"]}>
        <GradeEntry />
      </RoleGuard>
    </RequireAuth>
  }
/>
```

The system supports ten distinct roles: `Student`, `Supervisor`, `Admin`, `Dean`, `ViceDean`, `Registrar`, `AdminAssistant`, `Accountant`, `AccountingAssistant`, and `ExamsOfficer`. Each role is mapped to a specific set of routes and API endpoints, ensuring strict separation of concerns.

[INSERT SCREENSHOT: Login page showing the UMaT branding and credential entry form]

[INSERT SCREENSHOT: Mandatory first-login password change screen]

---

## 4.4 Core Module Implementation

### 4.4.1 Course Registration Module

The course registration module allows students to view and register for courses appropriate to their enrolled programme. The implementation is contained in `src/pages/student/CourseRegistration.tsx`. Upon loading, the component reads the authenticated student's `department`, `program`, and `admissionCycle` fields from the `AuthContext`. It then performs a multi-stage fuzzy matching algorithm against the `PROGRAMME_COURSE_CATALOGS` static data structure (defined in `src/data/programmeCourses.ts`), which contains the complete course catalogue for all programmes offered by the School of Postgraduate Studies.

The matching algorithm proceeds through four stages: (1) exact match on department, programme label, and admission cohort; (2) fuzzy match using a word-overlap heuristic (requiring at least 50% of the student's programme name words to appear in the catalogue label) with cohort; (3) fuzzy match without cohort; and (4) a department-only fallback. This robust matching strategy accommodates minor variations in programme name formatting between the database and the catalogue.

Courses are categorised as either `core` (mandatory) or `elective`. Core courses are pre-selected and locked; students may only toggle elective courses. Upon saving, the component calls `POST /api/courses/register` for each newly selected elective and `DELETE /api/courses/register/:id` for each de-selected elective. Core courses are not re-submitted on save, as they are already persisted in the database during the initial population step. The backend `courseController` handles these operations, resolving course codes against the `courses` table.

[INSERT SCREENSHOT: Course Registration page showing core courses locked and elective courses with toggle buttons]

### 4.4.2 Automated CWA Grading Calculator

The Cumulative Weighted Average (CWA) is computed entirely within the PostgreSQL database using a weighted average SQL query, ensuring consistency and eliminating the risk of client-side calculation errors. The core formula, implemented in `backend/src/controllers/resultController.js`, is:

```sql
SELECT
  ROUND(SUM(g.marks * c.credits) / NULLIF(SUM(c.credits), 0), 2) AS cwa
FROM grades g
JOIN courses c ON g.course_id = c.id
WHERE g.student_id = $1
```

This query computes the sum of the product of each course's marks and credit weighting, divided by the total credit hours, rounded to two decimal places. The `NULLIF` guard prevents a division-by-zero error for students with no graded credits. The `getCWAOverview` endpoint extends this query to aggregate CWA for all students simultaneously, joining the `students`, `users`, `programs`, and `departments` tables to produce a ranked overview for the Dean and Vice-Dean.

The pass list generation, implemented in `backend/src/controllers/passListController.js`, uses a similar aggregation query to populate the `graduands` table. Students whose computed CWA meets or exceeds a configurable minimum threshold (defaulting to 50) are assigned an `Eligible` status; those below the threshold are marked `Ineligible`. The generation process first deletes any existing `graduands` records for the target academic year before re-inserting, ensuring the pass list always reflects the most current grade data.

[INSERT SCREENSHOT: Dean/ViceDean CWA Results page showing a ranked table of students with their computed CWA values]

[INSERT SCREENSHOT: Exams Officer Generate Pass List page showing eligible and ineligible student counts]

### 4.4.3 Digital Clearance Workflow

The graduation clearance module implements a structured, multi-step approval workflow. The workflow is initialised by the `initSteps` function in `backend/src/controllers/clearanceController.js`, which inserts six ordered clearance steps into the `clearance_steps` table for a given student: (1) School Fees, (2) Library, (3) Department, (4) Thesis Submission, (5) ICT Directorate, and (6) Dean of Postgraduate. The Thesis Submission step is linked to the student's primary supervisor via the `supervisor_user_id` foreign key, resolved by querying the `student_supervisors` join table.

The workflow enforces a strict sequential constraint: the Dean of Postgraduate step cannot be approved until all preceding steps have been cleared. This is enforced server-side in the `approve` function, which queries for any non-Dean steps with a status other than `cleared` before permitting the Dean's approval. This prevents the Dean from granting final clearance to a student who has outstanding obligations.

When a student submits their clearance application via `POST /api/clearance/apply/:studentId`, all steps in the `not_started` state are transitioned to `pending`, and targeted notifications are dispatched to the relevant role groups: Accountants are notified about the School Fees step, Registrars and Admin Assistants about the Library, Department, and ICT steps, the assigned supervisor about the Thesis Submission step, and the Dean and Vice-Dean about the overall application. This notification fan-out is implemented using the `createNotification` helper from `notificationController.js`.

On the frontend, the `Clearance` component (`src/pages/student/Clearance.tsx`) auto-initialises the clearance steps on first load if none exist, displays a progress bar reflecting the percentage of cleared steps, and renders each step with its current status (cleared, pending, or not started). Upon full clearance, a "Download Certificate" button becomes available, which uses `jsPDF` to generate a formatted PDF clearance certificate client-side, listing all cleared steps with the approving officer's name and timestamp.

[INSERT SCREENSHOT: Student Graduation Clearance page showing the six-step progress tracker with status badges]

[INSERT SCREENSHOT: Dean/Admin Clearance Approvals page showing pending student clearance requests]

### 4.4.4 Thesis Management Portal

The thesis management portal provides a complete submission and review pipeline. Students upload their thesis documents via `POST /api/thesis/upload`, which accepts a PDF file via `multer` memory storage. The file is either uploaded to Cloudinary or saved to the local `uploads/thesis/` directory, and a record is inserted into the `thesis_submissions` table with the student's ID, submission stage, file URL, and an initial status of `Pending`.

Supervisors access pending submissions through the `ReviewSubmissions` page, which fetches all submissions via `GET /api/thesis/pending`. For each submission, the supervisor can update the status to `Approved`, `Rejected`, or `Under Review` via `PUT /api/thesis/:id/review`. Supervisors may also add structured remarks via `POST /api/thesis/:id/remarks`, which inserts a record into the `thesis_remarks` table and simultaneously updates the `feedback` column on the `thesis_submissions` record, making the feedback immediately visible to the student.

[INSERT SCREENSHOT: Supervisor Review Submissions page showing a list of thesis submissions with status and action buttons]

[INSERT SCREENSHOT: Student Thesis Upload page showing the file upload interface and submission history]

---

## 4.5 AI Integration

### 4.5.1 Student AI Chat Assistant

The system integrates a conversational AI assistant for students, accessible via the `ChatAssistant` page (`src/pages/student/ChatAssistant.tsx`). The backend endpoint `POST /api/chatbot/chat` (implemented in `backend/src/controllers/chatbotController.js`) proxies requests to the Groq API, using the `llama-3.3-70b-versatile` large language model. The chatbot is grounded with a structured knowledge base embedded in the system prompt, containing factual information about the UMaT School of Postgraduate Studies: available programmes, admission deadlines, study durations, contact information, and a description of the UPASS system's features. This grounding prevents the model from generating hallucinated information about the institution.

The API response is streamed back to the client using Server-Sent Events (SSE), with the Groq response body piped directly to the Express response stream. This streaming approach renders the AI's response token-by-token in the user interface, providing a responsive, real-time conversational experience rather than waiting for the full response to be generated.

### 4.5.2 Supervisor AI Feedback Assistant

A second AI mode is provided for supervisors, accessible via the `AIAssistant` page (`src/pages/supervisor/AIAssistant.tsx`) and the `AIFeedbackPanel` component (`src/components/supervisor/AIFeedbackPanel.tsx`). When the mode is set to `"supervisor"` in the request body, the `chatbotController` dynamically constructs a personalised system prompt by first querying the database for the authenticated supervisor's assigned students. The query retrieves each student's name, index number, programme, department, and the stage, filename, and status of their most recent thesis submission. This live data is injected into the system prompt, enabling the AI to provide contextually accurate advice about specific students without the supervisor needing to manually provide that context.

The `AIFeedbackPanel` component requests the AI to generate exactly four structured feedback suggestions in JSON format, each with a `text` field and a `category` field (one of: `content`, `formatting`, `references`, `methodology`, `clarity`). The component parses the streamed SSE response, extracts the JSON array using a regular expression, validates each suggestion against the permitted category set, and renders them as interactive cards. Supervisors can copy a suggestion to the clipboard, use it directly as thesis feedback, or rate it as helpful or unhelpful. A graceful fallback mechanism displays pre-written sample suggestions if the Groq API is unavailable.

[INSERT SCREENSHOT: Student Chat Assistant page showing a conversation with the UMaT SPS AI assistant]

[INSERT SCREENSHOT: Supervisor AI Assistant page showing AI-generated feedback suggestions categorised by type]

---

## 4.6 Additional System Modules

### 4.6.1 Fee Management

The fee management module, implemented in `backend/src/controllers/feeController.js`, supports individual fee record creation, bulk upload via Excel/CSV files (parsed using the `xlsx` library), and payment updates. The system tracks fee amounts, amounts paid, and automatically computes outstanding balances. The Accountant role can generate financial reports exportable as CSV or PDF via the `ExportReports` page.

### 4.6.2 Audit Logging

All significant system actions are recorded in an `audit_logs` table via the `logActivity` utility function in `src/lib/api.ts`. The `SystemLog` page (`src/pages/admin/SystemLog.tsx`) provides administrative roles with a filterable view of all audit entries, searchable by category (entity type) and actor role. This provides a complete, tamper-evident trail of administrative actions for accountability purposes.

### 4.6.3 Real-Time Notifications

The notification system, implemented in `backend/src/controllers/notificationController.js`, creates in-application notifications for users upon key events: results publication, clearance step approvals or rejections, thesis feedback, and fee updates. Notifications are fetched by the frontend on a polling basis and displayed in the `Notifications` page, with unread counts shown in the navigation sidebar.

[INSERT SCREENSHOT: Admin System Log page showing filterable audit trail entries]

[INSERT SCREENSHOT: Student Dashboard showing navigation sidebar with notification badge and key status cards]

---

# CHAPTER 5: CONCLUSIONS AND RECOMMENDATIONS

---

## 5.1 Conclusions

The UMaT Postgraduate Administrative Support System (UPASS) was designed and implemented to address the well-documented inefficiencies of paper-based and fragmented administrative processes within the School of Postgraduate Studies at the University of Mines and Technology, Tarkwa. Prior to this system, administrative workflows such as student clearance, thesis submission, grade management, and fee tracking were conducted through a combination of physical forms, manual spreadsheets, and informal communication channels. These approaches introduced significant risks of data loss, processing delays, inconsistent record-keeping, and limited transparency for students regarding their academic and financial standing.

The implemented system successfully consolidates these disparate processes into a single, unified digital platform. The three-tier architecture — comprising a React/TypeScript frontend, a Node.js/Express REST API, and a PostgreSQL relational database — provides a robust, maintainable, and scalable foundation. The role-based access control system, enforced at both the client-side routing layer and the server-side API middleware layer, ensures that each of the ten defined user roles can access only the data and functionality appropriate to their responsibilities, thereby upholding data confidentiality and institutional governance requirements.

The automated CWA calculation engine eliminates the manual computation errors that were inherent in spreadsheet-based grading, computing weighted averages directly within the database using a single, auditable SQL query. The digital clearance workflow replaces a process that previously required students to physically visit multiple offices with a transparent, trackable, multi-step online process, with automated notifications dispatched to the relevant approving officers upon each student's application. The thesis management portal provides a structured, version-tracked submission and review pipeline, replacing informal email-based exchanges between students and supervisors.

The integration of the Groq-powered large language model represents a significant value-added feature, providing students with an always-available, institutionally grounded information assistant and equipping supervisors with AI-generated, categorised feedback suggestions to improve the quality and consistency of thesis reviews. The system's audit logging capability provides administrators with a complete, filterable record of all significant actions, supporting institutional accountability and compliance.

In summary, UPASS demonstrates that a well-architected, full-stack web application can effectively digitise and streamline the administrative operations of a postgraduate school, reducing processing delays, improving data integrity, and enhancing the experience of all stakeholders — students, supervisors, administrators, and academic leadership alike.

---

## 5.2 Recommendations

Based on the current state of the implemented system and the broader context of postgraduate administration at UMaT, the following technical enhancements are recommended for future development iterations:

### 5.2.1 Native Mobile Application

The current system is a responsive web application accessible via a mobile browser; however, a dedicated native mobile application for Android and iOS platforms would significantly improve accessibility for students and supervisors who primarily use smartphones. A React Native implementation would be particularly advantageous, as it would allow substantial reuse of the existing business logic, API client code, and TypeScript type definitions from the current codebase. Push notifications via Firebase Cloud Messaging (FCM) could replace the current polling-based notification system, delivering real-time alerts for clearance approvals, thesis feedback, and results publication directly to users' devices.

### 5.2.2 Online Payment Gateway Integration

The current fee management module records and tracks payments but does not facilitate online payment transactions. Integrating a payment gateway such as Paystack or Flutterwave — both of which are widely adopted in Ghana and support mobile money (MTN MoMo, Vodafone Cash, AirtelTigo Money) as well as card payments — would allow students to settle outstanding fees directly within the platform. This would eliminate the need for students to visit the accounts office for payment, and would enable the system to automatically update fee records and trigger clearance step progression upon confirmed payment, further reducing administrative bottlenecks.

### 5.2.3 SMS Notification Gateway

Whilst the current system delivers in-application notifications, students and staff without reliable internet access may miss time-sensitive alerts. Integrating an SMS gateway service such as Hubtel or Arkesel (both Ghana-based providers) would enable the system to dispatch SMS alerts for critical events, including clearance approvals, results publication, and fee payment reminders. The existing `notificationController.js` could be extended with an SMS dispatch function that is called alongside the existing in-app notification creation, requiring minimal architectural changes.

### 5.2.4 Advanced Analytics and Reporting Dashboard

The current analytics module provides charts for enrolment trends, fee collection, CWA distribution, and thesis progress. A future enhancement could introduce a dedicated business intelligence layer, potentially using a tool such as Apache Superset or a custom implementation with more advanced Recharts configurations, to support ad-hoc report generation, cohort analysis (tracking student progression across academic years), and predictive analytics (identifying students at risk of failing to meet graduation requirements based on their CWA trajectory). Exportable reports in additional formats, such as Excel workbooks with multiple sheets, would also improve the utility of the analytics module for institutional reporting to the Ghana Tertiary Education Commission (GTEC).
