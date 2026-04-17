# BuildTrack - Construction Project Management System

## Tech Stack
- **Frontend**: React 19 + React Router + Recharts + Lucide Icons
- **Backend**: Spring Boot 3.2 + Spring Security + JWT
- **Database**: PostgreSQL

## Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+

## Setup

### 1. Database
```sql
CREATE DATABASE construction_db;
```

### 2. Backend
```bash
cd backend
# Update src/main/resources/application.properties with your DB credentials
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 3. Frontend
```bash
cd frontend
npm install
npm start
```
Frontend runs on: http://localhost:3000

## Features

### Authentication
- JWT-based login/register
- Roles: ADMIN, MANAGER, ENGINEER

### Dashboard
- Project cards with progress bars and budget usage
- Search and filter by status
- Analytics stats (total, active, completed, budget)

### Project Details (7 tabs)
1. **Overview** - AI-generated summary, budget alerts, project info
2. **Timeline** - Gantt chart visualization
3. **Tasks** - Kanban board (TODO → IN_PROGRESS → REVIEW → DONE)
4. **Budget** - Expense tracking with pie/bar charts
5. **Site Updates** - Notes, images, videos
6. **Contractors** - Contractor management
7. **Documents** - File upload/download

### Analytics
- Project status distribution (pie chart)
- Budget overview
- Progress vs budget comparison (bar chart)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register |
| POST | /api/auth/login | Login |
| GET/POST | /api/projects | List/Create projects |
| GET/PUT/DELETE | /api/projects/{id} | Project CRUD |
| GET/POST | /api/projects/{id}/tasks | Task management |
| GET/POST | /api/projects/{id}/expenses | Expense tracking |
| GET/POST | /api/projects/{id}/contractors | Contractor management |
| GET/POST | /api/projects/{id}/site-updates | Site updates |
| GET/POST | /api/projects/{id}/documents | Document upload |
| GET | /api/analytics/dashboard | Dashboard stats |
| GET | /api/analytics/projects/{id}/summary | AI project summary |
| GET | /api/notifications | User notifications |
| GET | /api/users | Team members |
