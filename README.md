# 🏫 Smart Campus Operations Hub

<div align="center">

**IT3030 | Batch: Y3-S1-WE-4.2 | Group 109**

![Java](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.12-brightgreen?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![CI](https://img.shields.io/badge/CI-GitHub_Actions-black?style=for-the-badge&logo=githubactions)

A production-inspired university campus management platform for facility bookings, incident ticketing, and real-time notifications — built with Spring Boot and React.

</div>

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [CI/CD Pipeline](#cicd-pipeline)
- [Team](#team)

---

## Overview

Smart Campus Operations Hub is a full-stack web application that centralises university operations. Staff, students, and technicians can book facilities, raise incident tickets, and receive real-time notifications — all from a single unified platform with role-based access control.

---

## Features

| Module | Description |
|--------|-------------|
| **Auth & OAuth 2.0** | Google sign-in, JWT sessions, role-based access (USER / ADMIN / TECHNICIAN) |
| **Facilities & Assets** | Manage lecture halls, labs, equipment with status tracking |
| **Booking Management** | Request, approve/reject bookings with conflict detection |
| **Incident Ticketing** | Raise tickets, assign technicians, track resolution workflow |
| **Notifications** | Real-time in-app notifications for bookings, tickets, and comments |
| **Admin Dashboard** | Overview stats, user management, activity log |
| **Technician Portal** | Dedicated dashboard for assigned ticket management |

---

## Tech Stack

**Backend**
- Java 21, Spring Boot 3.5.12
- Spring Security + OAuth 2.0 (Google) + JWT
- Spring Data MongoDB
- Spring Boot Validation, Actuator
- Lombok, Maven
- JUnit 5, Mockito (unit & integration tests)

**Frontend**
- React 19, Vite 8
- React Router DOM 7
- Tailwind CSS 4
- @react-oauth/google
- Vitest + Testing Library

**Infrastructure**
- MongoDB Atlas (cloud database)
- GitHub Actions (CI/CD)

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Client                    │
│         localhost:5173  (Vite + React 19)        │
└───────────────────┬─────────────────────────────┘
                    │ HTTP / REST (JWT Bearer)
┌───────────────────▼─────────────────────────────┐
│              Spring Boot API                     │
│              localhost:8080                      │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │   Auth   │ │Bookings  │ │  Notifications   │ │
│  │Controller│ │Controller│ │   Controller     │ │
│  └────┬─────┘ └────┬─────┘ └────────┬─────────┘ │
│       │            │                │            │
│  ┌────▼────────────▼────────────────▼─────────┐ │
│  │              Service Layer                  │ │
│  └────────────────────┬────────────────────────┘ │
│                       │                          │
│  ┌────────────────────▼────────────────────────┐ │
│  │         Spring Data MongoDB Repositories    │ │
│  └────────────────────┬────────────────────────┘ │
└───────────────────────┼──────────────────────────┘
                        │
         ┌──────────────▼──────────────┐
         │       MongoDB Atlas          │
         │  smart_campus_db             │
         │  collections: users,         │
         │  bookings, tickets,          │
         │  notifications,              │
         │  resources, resourceTypes,   │
         │  notification_preferences    │
         └─────────────────────────────┘
```

---

## API Reference

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | Public | Login with email/password, returns JWT |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `GET` | `/api/auth/me` | Bearer | Get current authenticated user profile |
| `PUT` | `/api/auth/me` | Bearer | Update current user profile |
| `DELETE` | `/api/auth/me` | Bearer | Delete current user account |
| `GET` | `/api/auth/validate` | Bearer | Validate JWT token |

### Notifications — `/api/notifications`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/notifications/my` | Bearer | Get all notifications for current user (`?unreadOnly=true`) |
| `POST` | `/api/notifications/my` | Bearer | Create a self notification |
| `PATCH` | `/api/notifications/my/read-all` | Bearer | Mark all notifications as read |
| `PATCH` | `/api/notifications/{id}/read` | Bearer | Mark a single notification as read |
| `PUT` | `/api/notifications/{id}` | Bearer | Update a notification |
| `DELETE` | `/api/notifications/{id}` | Bearer | Delete a notification |
| `GET` | `/api/notifications/stats/my` | Bearer | Get notification stats (read/unread counts) |

### Admin — `/api/admin` *(ADMIN role required)*

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/admin/users` | ADMIN | List all registered users |
| `PATCH` | `/api/admin/users/{userId}/role` | ADMIN | Update a user's role (USER / ADMIN / TECHNICIAN) |
| `PATCH` | `/api/admin/users/{userId}/active` | ADMIN | Suspend or activate a user account |
| `GET` | `/api/admin/bookings` | ADMIN | List all bookings |
| `GET` | `/api/admin/activity` | ADMIN | Get system-wide activity log |

### Resources — `/api/resources`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/resources` | Public | List all resources (filter by type, capacity, location) |
| `GET` | `/api/resources/{id}` | Public | Get resource details |
| `POST` | `/api/resources` | ADMIN | Create a new resource |
| `PUT` | `/api/resources/{id}` | ADMIN | Update a resource |
| `DELETE` | `/api/resources/{id}` | ADMIN | Delete a resource |

### Bookings — `/api/bookings`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings/my` | Bearer | Get current user's bookings |
| `POST` | `/api/bookings` | Bearer | Create a booking request |
| `GET` | `/api/bookings/{id}` | Bearer | Get booking details |
| `PATCH` | `/api/bookings/{id}/cancel` | Bearer | Cancel a booking |
| `PATCH` | `/api/bookings/{id}/approve` | ADMIN | Approve a booking |
| `PATCH` | `/api/bookings/{id}/reject` | ADMIN | Reject a booking with reason |

### Tickets — `/api/tickets`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tickets/my` | Bearer | Get current user's tickets |
| `POST` | `/api/tickets` | Bearer | Create an incident ticket |
| `GET` | `/api/tickets/{id}` | Bearer | Get ticket details |
| `PATCH` | `/api/tickets/{id}/status` | ADMIN/TECH | Update ticket status |
| `POST` | `/api/tickets/{id}/comments` | Bearer | Add a comment to a ticket |

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- Maven 3.9+
- MongoDB Atlas account (or local MongoDB 7.0)
- Google OAuth 2.0 credentials

### 1. Clone the repository

```bash
git clone https://github.com/nadunmA/it3030-paf-2026-smart-campus-group109.git
cd it3030-paf-2026-smart-campus-group109
```

### 2. Backend Setup

```bash
cd backend/smart-campus
```

Create a `.env` file or set environment variables (see [Environment Variables](#environment-variables)).

```bash
# Build and run
./mvnw spring-boot:run
```

The API will start on `http://localhost:8080`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will start on `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in `backend/smart-campus/src/main/resources/` or set these as system environment variables:

```env
# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart_campus_db

# Google OAuth 2.0
# Create credentials at: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# JWT
# Use a long random string (min 32 chars) — generate with: openssl rand -hex 32
JWT_SECRET=your-secure-random-secret-key
```

> ⚠️ **Never commit real credentials to the repository.** Use environment variables or a secrets manager.

---

## Running Tests

### Backend Tests

```bash
cd backend/smart-campus
./mvnw test
```

Test suites included:
- `NotificationControllerTest`
- `NotificationServiceTest`
- `AuthServiceImplTest`
- `CustomOAuth2UserServiceTest`
- `JwtAuthFilterTest`
- `JwtUtilTest`

### Frontend Tests

```bash
cd frontend
npm run test
```

---

## CI/CD Pipeline

GitHub Actions workflow runs on every push and pull request to `main` and `feature/m4-auth-notifications`.

**Triggers:** Push & PR to `main` and `feature/m4-auth-notifications`

**Pipeline:**

```
Push / PR
    │
    ├── Backend Job (ubuntu-latest)
    │     ├── Spin up MongoDB 7.0 service container (port 27017)
    │     ├── Set up JDK 21 (Temurin)
    │     ├── mvn clean verify (build + all tests)
    │     └── Upload surefire test reports as artifact
    │
    └── Frontend Job (ubuntu-latest)
          ├── Set up Node.js 20
          ├── npm cache clean + npm ci
          └── npm run build (VITE_API_URL=http://localhost:8080)
```

**Workflow file:** `.github/workflows/ci.yml`

```yaml
name: Smart Campus CI

on:
  push:
    branches: [main, feature/m4-auth-notifications]
  pull_request:
    branches: [main, feature/m4-auth-notifications]

jobs:
  backend:
    name: Backend – Build & Test
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:7.0
        ports: [27017:27017]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: "21", distribution: "temurin", cache: maven }
      - name: Build and run tests
        working-directory: ./backend/smart-campus
        run: mvn clean verify --no-transfer-progress
        env:
          MONGO_URI: mongodb://localhost:27017/smart_campus_test
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          GOOGLE_CLIENT_ID: ${{ secrets.GOOGLE_CLIENT_ID }}
          GOOGLE_CLIENT_SECRET: ${{ secrets.GOOGLE_CLIENT_SECRET }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: backend-test-reports
          path: backend/smart-campus/target/surefire-reports/**

  frontend:
    name: Frontend – Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20" }
      - name: Install and Build
        working-directory: ./frontend
        run: |
          npm cache clean --force
          npm ci --include=optional --no-audit --no-fund
          npm run build
        env:
          VITE_API_URL: http://localhost:8080
```

View all workflow runs → [GitHub Actions](https://github.com/nadunmA/it3030-paf-2026-smart-campus-group109/actions)

---

## Team

| Student ID | Name | Module |
|------------|------|--------|
| IT23192850 | Nadun M.A | Module D & E — Authentication, OAuth 2.0, Notifications, User Management |
| IT23702172 | Soysa W.C.R | Module B — Booking Management |
| IT23691360 | Kaveendra K.P.A | Module A — Facilities & Assets Catalogue |
| IT23612846 | Samarathunga W.W.R.N | Module C — Maintenance & Incident Ticketing |

---

<div align="center">
IT3030 – Programming Applications & Frameworks | SLIIT | Semester 1, 2026
</div>
