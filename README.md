# Smart Campus Management System
### IT3030 – PAF 2026 | Group 423

A full-stack web application for managing a university smart campus — handling room/resource bookings, maintenance ticketing, user management, and real-time notifications across three user roles.

---

## Table of Contents

- [System Overview](#system-overview)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
- [User Roles](#user-roles)
- [Project Structure](#project-structure)
- [Quick Start (Automated)](#quick-start-automated)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)

---

## System Overview

Smart Campus provides three role-specific dashboards:

| Role | Dashboard URL | Capabilities |
|------|--------------|--------------|
| **Student / Staff** | `/dashboard` | Book resources, report issues, view notifications |
| **Technician** | `/technician/dashboard` | View & update assigned tickets |
| **Admin** | `/admin/dashboard` | Manage all bookings, tickets, resources, users |

Login is via **Google OAuth2** — no username/password registration required.

---

## Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Framework | Spring Boot 3.4.1 |
| Language | Java 22 |
| Database | MongoDB Atlas (cloud) |
| Auth | JWT + Google OAuth2 (Spring Security 6) |
| Build | Maven 3.9 |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | React 19 |
| Router | React Router 7 |
| Build tool | Vite 6 |
| HTTP | Fetch API (`src/lib/api.js`) |
| Styling | Inline styles (no Tailwind) |

---

## Modules

### Module A – Resource & Booking Management
- Browse available campus resources (lecture halls, meeting rooms, labs, equipment)
- Create, view, and cancel bookings
- Admin approval/rejection workflow
- Conflict detection (no double-booking)
- Capacity validation

### Module B – Notifications
- Real-time in-app notifications for booking status changes
- Ticket assignment and status change alerts
- Mark as read / mark all as read
- Unread badge counter

### Module C – Maintenance & Incident Ticketing
- Any user can report a maintenance issue (electrical, plumbing, HVAC, IT, structural, etc.)
- Priority levels: LOW, MEDIUM, HIGH, CRITICAL
- Admin assigns a technician from a dropdown in the tickets table
- Ticket auto-advances to IN_PROGRESS on assignment
- Technicians update status and add comments
- Status flow: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`
- Notifications sent to technician and reporter on every status change

### Module D – User Management & Auth
- Google OAuth2 single sign-on
- JWT stateless sessions (stored in `sessionStorage`)
- Admin can change user roles (USER / TECHNICIAN / ADMIN)
- Admin can activate/deactivate accounts

---

## User Roles

### USER (Student / Staff)
- Sign in with Google
- Book resources → `/resources`
- Report maintenance issues → `/tickets/create`
- View own bookings and tickets on dashboard
- Receive notifications for booking and ticket updates

### TECHNICIAN
- All USER capabilities
- View tickets assigned to them → Technician Dashboard
- Update ticket status (IN_PROGRESS, RESOLVED, CLOSED)
- Add resolution notes and comments

### ADMIN
- All capabilities
- Approve / reject bookings
- Assign technicians to tickets via dropdown
- Manage all resources and campus halls
- Manage user roles and account status
- View activity log

---

## Project Structure

```
it3030-paf-2026-smart-campus-group423/
│
├── .env                        ← Your secrets (never commit)
├── .env.example                ← Template — copy to .env
├── .gitignore
├── start.bat                   ← Double-click to start everything
├── start.ps1                   ← PowerShell launcher (called by start.bat)
├── stop.bat                    ← Double-click to stop everything
│
├── backend/smart-campus/
│   ├── pom.xml
│   ├── mvnw.cmd
│   └── src/main/java/com/wegroup423/smart_campus/
│       └── features/
│           ├── auth/           ← Login, JWT, OAuth2, User model
│           ├── booking/        ← Resource booking CRUD + approval
│           ├── notification/   ← In-app notifications
│           ├── ticket/         ← Maintenance ticketing (Module C)
│           ├── admin/          ← Admin dashboard aggregation API
│           └── publicapi/      ← Public resource listing
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx             ← Routes
        ├── main.jsx
        ├── lib/api.js          ← All HTTP calls (apiGet/Post/Put/Patch/Delete)
        └── features/
            ├── auth/           ← Login, OAuth2 callback, ProtectedRoute
            ├── home/           ← Landing page
            ├── dashboard/
            │   ├── admin-dashboard/
            │   ├── technician-dashboard/
            │   └── user-dashboard/
            ├── tickets/        ← Create ticket page
            ├── bookings/       ← Booking pages
            ├── resources/      ← Resource listing & detail
            └── notification/   ← Notifications page
```

---

## Quick Start (Automated)

> **Prerequisites — install once:**
> - [Java 17, 21, or 22](https://adoptium.net) (JDK, not JRE)
> - [Node.js 18+](https://nodejs.org)
> - Maven is downloaded automatically on first backend run

### Step 1 — Get the project
```bash
git clone <repo-url>
cd it3030-paf-2026-smart-campus-group423
```

### Step 2 — Configure environment
```bash
# Copy the template
copy .env.example .env
```
Open `.env` and fill in your credentials (see [Environment Variables](#environment-variables)).

### Step 3 — Start everything
**Double-click `start.bat`** or run from PowerShell:
```powershell
.\start.bat
```

The script will:
1. Load your `.env` file
2. Auto-detect your Java installation
3. Auto-find Maven in your `.m2` cache
4. Install `node_modules` on first run (takes ~1 min)
5. Kill any existing process on port 8080
6. Open two terminal windows — backend and frontend
7. Open your browser at `http://localhost:5173` after 20 seconds

### Step 4 — Stop
**Double-click `stop.bat`** — kills the backend and frontend processes.

---

## Manual Setup

If you prefer to run each service yourself:

### Backend

```bash
cd backend/smart-campus
```

**Windows (PowerShell):**
```powershell
$env:JAVA_HOME      = "C:\Program Files\Java\jdk-22"
$env:MONGO_URI      = "your-mongo-atlas-uri"
$env:GOOGLE_CLIENT_ID     = "your-google-client-id"
$env:GOOGLE_CLIENT_SECRET = "your-google-client-secret"
$env:JWT_SECRET     = "your-jwt-secret"
$env:FRONTEND_URL   = "http://localhost:5173"

.\mvnw.cmd spring-boot:run
```

**Linux / macOS:**
```bash
export JAVA_HOME=/usr/lib/jvm/java-22
export MONGO_URI="your-mongo-atlas-uri"
export GOOGLE_CLIENT_ID="your-google-client-id"
export GOOGLE_CLIENT_SECRET="your-google-client-secret"
export JWT_SECRET="your-jwt-secret"
export FRONTEND_URL="http://localhost:5173"

./mvnw spring-boot:run
```

Backend starts on **http://localhost:8080**

---

### Frontend

```bash
cd frontend
npm install        # first time only
npm run dev
```

Frontend starts on **http://localhost:5173**

---

### First-time Maven download
If Maven is not cached yet, `mvnw.cmd` will fail. Download it first:
```powershell
cd backend/smart-campus
# Download Maven wrapper (requires internet)
mvn -N wrapper:wrapper
```
Or install Maven globally from https://maven.apache.org/download.cgi

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```env
# MongoDB Atlas connection string
# Get from: https://cloud.mongodb.com → Connect → Drivers
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?appName=<app>

# Google OAuth2 credentials
# Get from: https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxx

# JWT signing secret — any random string, 32+ characters
JWT_SECRET=YourSuperSecretJwtKeyThatIsAtLeast32CharsLong

# Frontend origin (do not change for local dev)
FRONTEND_URL=http://localhost:5173
```

### Google OAuth2 Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials** → **Create OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Add to **Authorised redirect URIs**:
   ```
   http://localhost:8080/login/oauth2/code/google
   ```
5. Copy the Client ID and Client Secret into your `.env`

### MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and create a free cluster
2. **Database Access** → Add a user with read/write access
3. **Network Access** → Add IP `0.0.0.0/0` (allow all) or your specific IP
4. **Connect** → **Drivers** → Copy the connection string
5. Replace `<password>` in the string and paste into `.env` as `MONGO_URI`

---

## API Endpoints

### Auth
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | Public | Email/password login |
| POST | `/api/auth/register` | Public | Register new user |
| GET | `/api/auth/me` | Authenticated | Get current user |
| GET | `/oauth2/authorization/google` | Public | Start Google OAuth2 |

### Tickets (Module C)
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/tickets` | All roles | Create a ticket |
| GET | `/api/tickets` | ADMIN, TECHNICIAN | Get all tickets |
| GET | `/api/tickets/my` | All roles | Get own tickets |
| GET | `/api/tickets/assigned` | ADMIN, TECHNICIAN | Get assigned tickets |
| GET | `/api/tickets/{id}` | All roles | Get ticket by ID |
| PUT | `/api/tickets/{id}` | ADMIN, TECHNICIAN | Update ticket |
| PATCH | `/api/tickets/{id}/status` | ADMIN, TECHNICIAN | Update status |
| PATCH | `/api/tickets/{id}/assign` | ADMIN only | Assign technician |
| DELETE | `/api/tickets/{id}` | All roles | Delete ticket |
| POST | `/api/tickets/{id}/comments` | All roles | Add comment |
| PUT | `/api/tickets/{id}/comments/{cid}` | Author | Edit comment |
| DELETE | `/api/tickets/{id}/comments/{cid}` | Author | Delete comment |

### Bookings
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| POST | `/api/bookings` | All roles | Create booking |
| GET | `/api/bookings/my` | All roles | Get own bookings |
| GET | `/api/bookings/{id}` | All roles | Get booking by ID |
| PATCH | `/api/bookings/{id}/approve` | ADMIN | Approve booking |
| PATCH | `/api/bookings/{id}/reject` | ADMIN | Reject booking |
| PATCH | `/api/bookings/{id}/cancel` | Owner | Cancel booking |

### Notifications
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/notifications/my` | Authenticated | Get notifications |
| POST | `/api/notifications/my` | Authenticated | Create notification |
| PATCH | `/api/notifications/{id}/read` | Owner | Mark as read |
| PATCH | `/api/notifications/my/read-all` | Authenticated | Mark all as read |
| DELETE | `/api/notifications/{id}` | Owner | Delete notification |

### Admin
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/admin/tickets` | ADMIN | All tickets (with display fields) |
| GET | `/api/admin/bookings` | ADMIN | All bookings |
| GET | `/api/admin/users` | ADMIN | All users |
| PATCH | `/api/admin/users/{id}/role` | ADMIN | Change user role |
| PATCH | `/api/admin/users/{id}/active` | ADMIN | Toggle active status |
| GET | `/api/admin/activity` | ADMIN | Activity log |

---

## Authentication

The app uses **JWT + Google OAuth2**:

1. User clicks "Sign in with Google" → redirected to Google
2. Google redirects back to `http://localhost:8080/login/oauth2/code/google`
3. Backend issues a JWT and redirects to `http://localhost:5173/auth/callback?token=<jwt>`
4. Frontend stores the JWT in `sessionStorage` under the key `token`
5. All subsequent API calls include `Authorization: Bearer <token>`
6. JWT expires after **24 hours** (configurable via `app.jwt.expiration`)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `JAVA_HOME not set` | Install Java 17+ from https://adoptium.net |
| `Maven not found` | Run `cd backend/smart-campus && mvnw.cmd` once to download |
| `Port 8080 in use` | Run `stop.bat` or restart your PC |
| `MongoDB connection failed` | Check `MONGO_URI` in `.env` and your Atlas IP whitelist |
| `Google login fails` | Check redirect URI in Google Cloud Console matches exactly |
| Backend starts but API returns 401 | Token may be expired — log out and log in again |
| Frontend shows blank page | Check browser console; ensure backend is running on 8080 |

---

## Team — Group 423

IT3030 Programming & Frameworks — 2026
