# Postgrad Backend — Supervisor Module

## Setup

1. Install dependencies: `npm install`
2. Create a PostgreSQL database and run the migration: `psql -d postgrad_db -f db/migrations/001_create_supervisors.sql`
3. Copy `.env.example` to `.env` and fill in your values
4. Start the server: `npm run dev`

## API Endpoints

| Method | Endpoint                | Auth | Description            |
|--------|-------------------------|------|------------------------|
| POST   | /api/supervisors/login  | No   | Login, returns JWT     |
| GET    | /api/supervisors        | Yes  | List all supervisors   |
| GET    | /api/supervisors/:id    | Yes  | Get supervisor by ID   |
| POST   | /api/supervisors        | Yes  | Create a supervisor    |
| PUT    | /api/supervisors/:id    | Yes  | Update a supervisor    |
| DELETE | /api/supervisors/:id    | Yes  | Soft-delete supervisor |
