# Tasky.io — Full Stack Task Management System

A professional full-stack task management application built with React, Node.js, Express, and MongoDB. Features role-based access control, a complete task assignment and approval workflow, real-time analytics, team management, and a premium UI built with Tailwind CSS.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Task Assignment Workflow](#task-assignment-workflow)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Scripts](#scripts)

---

## Features

### Authentication & Access
- JWT-based authentication with 30-day token expiry
- Role-based access control — Admin and User roles
- Forgot password and reset password flow
- "Fired" account state — revokes all task access

### Task Management
- Admin creates and assigns tasks to individuals, teams, or all members
- Users receive task assignments and must Accept or Deny them
- Status change requests require admin approval before reflecting on the user's dashboard
- Full activity timeline and status history per task
- File attachments via Cloudinary (with local fallback)
- Progress tracking with percentage and notes

### Admin Panel
- Dashboard with live analytics (total, pending, in-progress, completed)
- User management — create, update, fire, rehire users
- Pending approvals panel with real-time notification badge
- Reports — export as CSV or PDF
- Team management — create teams, assign members
- Audit trail and task templates

### User Panel
- Personal task backlog with filter tabs
- Accept / Deny assignment modal with reason input
- Status change request modal (admin approval required)
- Task board (Kanban view)
- Calendar view
- Team membership view
- Profile management

### UI
- Premium glassmorphism-inspired design
- Fully responsive — mobile, tablet, desktop
- Framer Motion animations throughout
- Consistent design system via Tailwind config tokens
- Dark sidebar navigation with notification badges

---

## Tech Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| Framer Motion | 11 | Animations |
| React Router DOM | 6 | Routing |
| Axios | 1 | HTTP client |
| Recharts | 2 | Charts |
| Lucide React | 0.344 | Icons |
| Zustand | 4 | Global state |
| date-fns | 3 | Date utilities |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4 | Web framework |
| Mongoose | 8 | MongoDB ODM |
| JWT | 9 | Authentication |
| bcryptjs | 2 | Password hashing |
| Multer | 1 | File uploads |
| Cloudinary | 2 | Cloud file storage |
| Helmet | 7 | Security headers |
| Morgan | 1 | HTTP logging |
| CORS | 2 | Cross-origin requests |

---

## Project Structure

```
taskmanager_full/
├── backend/
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   └── cloudinary.js       # Cloudinary config
│   ├── controllers/
│   │   ├── authController.js   # Register, login, profile
│   │   ├── taskController.js   # Full task CRUD + workflow
│   │   ├── teamController.js   # Team management
│   │   └── userController.js   # Users + analytics + reports
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT protect
│   │   ├── errorMiddleware.js  # Global error handler
│   │   ├── roleMiddleware.js   # Admin-only guard
│   │   └── uploadMiddleware.js # Multer file upload
│   ├── models/
│   │   ├── Task.js             # Task schema + workflow fields
│   │   ├── TaskUpdate.js       # Progress update records
│   │   ├── Team.js             # Team schema
│   │   └── User.js             # User schema + fired/rehire
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── userRoutes.js
│   │   └── analyticsRoutes.js
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── helpers.js
│   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/          # PendingApprovalsPanel
    │   │   ├── cards/          # StatCard, AnalyticsCard
    │   │   ├── charts/         # TaskChart (Recharts)
    │   │   ├── forms/          # TaskForm
    │   │   ├── layout/         # Sidebar, Navbar, UltraSidebar
    │   │   ├── tasks/          # TaskCard, TaskDetailsDrawer, AssignTaskModal
    │   │   ├── teams/          # TeamCard, TeamForm, etc.
    │   │   └── ui/             # Button, Input, Modal, Toaster, etc.
    │   ├── context/
    │   │   ├── AuthContext.jsx # Auth state + demo mode fallback
    │   │   └── ThemeContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useDebounce.js
    │   │   ├── useTasks.js
    │   │   └── useTheme.js
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx
    │   ├── pages/
    │   │   ├── admin/          # Dashboard, AdminTasks, UserManagement,
    │   │   │                   # Reports, PendingApprovals, TeamManagement, etc.
    │   │   ├── auth/           # UltraPremiumLogin, UltraPremiumSignup,
    │   │   │                   # ForgotPassword, ResetPassword
    │   │   └── user/           # Dashboard, MyTasks, TaskBoard,
    │   │                       # MyTeams, CalendarView, Profile
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── services/
    │   │   ├── api.js           # Axios instance + interceptors
    │   │   ├── authService.js
    │   │   ├── taskService.js
    │   │   ├── taskStore.js     # Zustand store with demo fallback
    │   │   ├── demoTaskStore.js # localStorage task store (offline mode)
    │   │   ├── teamService.js
    │   │   └── userService.js
    │   └── utils/
    │       ├── cn.js            # Tailwind class merger
    │       ├── constants.js
    │       ├── formatters.js
    │       ├── taskAssignment.js
    │       └── validators.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── .env.example
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone and install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Optional — local file uploads used if not set
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend** — create `frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Run the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

App runs at `http://localhost:3000`, API at `http://localhost:5000`.

---

## Environment Variables

### Backend

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 5000) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for JWT signing |
| `NODE_ENV` | No | `development` or `production` |
| `FRONTEND_URL` | No | Frontend URL for CORS whitelist |
| `CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | Cloudinary API secret |

### Frontend

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | No | Backend API URL (default: `http://localhost:5000/api`) |

---

## Task Assignment Workflow

```
Admin creates task
       │
       ▼
Task assigned to User / Team / All Members
  (assignmentStatus: "pending")
       │
       ▼
User sees task in "My Tasks" — clicks "Accept or Deny"
       │
   ┌───┴───┐
Accept    Deny (requires reason)
   │
   ▼
User can request status change
  e.g. "In Progress"
       │
       ▼
Admin sees notification badge → reviews in Pending Approvals
       │
   ┌───┴───┐
Approve    Reject (with feedback)
   │
   ▼
Status updates on User's dashboard
```

---

## API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register new user |
| POST | `/login` | Public | Login and get token |
| GET | `/verify` | Private | Verify session |
| POST | `/logout` | Private | Logout |
| POST | `/forgot-password` | Public | Request reset token |
| POST | `/reset-password` | Public | Reset with token |
| PUT | `/profile` | Private | Update profile |

### Tasks — `/api/tasks`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Private | Get tasks (filtered by role) |
| POST | `/` | Admin | Create task |
| GET | `/:id` | Private | Get task by ID |
| PUT | `/:id` | Private | Update task |
| DELETE | `/:id` | Admin | Delete task |
| PATCH | `/:id/status` | Private | Quick status update |
| GET | `/pending-approvals` | Admin | Get all pending status changes |
| POST | `/:id/accept` | User | Accept task assignment |
| POST | `/:id/deny` | User | Deny task assignment |
| POST | `/:id/request-status-change` | User | Request status change |
| POST | `/:id/approve-status-change` | Admin | Approve status change |
| POST | `/:id/reject-status-change` | Admin | Reject with feedback |
| POST | `/:id/progress` | Private | Submit progress update |
| POST | `/:id/request-review` | Private | Request final review |
| POST | `/:id/approve` | Admin | Approve completion |
| POST | `/:id/reject` | Admin | Reject with feedback |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Private | List users |
| POST | `/` | Admin | Create user |
| GET | `/:id` | Private | Get user by ID |
| PUT | `/:id` | Admin | Update user |
| DELETE | `/:id` | Admin | Delete user |
| PATCH | `/:id/role` | Admin | Update role |
| PATCH | `/:id/fire` | Admin | Fire user |
| GET | `/:id/stats` | Private | User task stats |

### Analytics — `/api/analytics`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/dashboard` | Private | Dashboard stats |
| GET | `/tasks` | Private | Task chart data |
| GET | `/users` | Private | Contributor stats |
| GET | `/reports` | Admin | Compile report |
| GET | `/export` | Admin | Export CSV or PDF |

### Teams — `/api/teams`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/my-teams` | Private | Current user's teams |
| GET | `/:id` | Private | Team details |
| GET | `/:id/tasks` | Private | Team tasks |
| GET | `/` | Admin | All teams |
| POST | `/` | Admin | Create team |
| PUT | `/:id` | Admin | Update team |
| DELETE | `/:id` | Admin | Delete team |
| GET | `/stats/analytics` | Admin | Team analytics |

---

## Design System

All colors are defined as named tokens in `tailwind.config.js` — no hardcoded hex values in components.

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brand` | `#13856f` | Primary actions, active states |
| `brand-dark` | `#0f7260` | Hover states |
| `brand-darker` | `#0f6c57` | Pressed / deep states |
| `brand-light` | `#e8f6f2` | Tint backgrounds |
| `brand-muted` | `#b8e0d8` | Soft tints |
| `warm` | `#8d514f` | Secondary terracotta |
| `warm-accent` | `#b5722a` | Amber highlights |
| `warm-light` | `#efbf91` | Warm peach glow |

### Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `surface-page` | `#f7e3cf` | Main page background |
| `surface-base` | `#fff8f3` | Navbar / topbar |
| `surface-card` | `#fffaf6` | Cards and panels |
| `surface-hover` | `#fff8ef` | Card hover state |

### Borders

| Token | Value | Usage |
|-------|-------|-------|
| `border` | `#ead8cb` | Primary borders |
| `border-light` | `#f4ddd0` | Light borders |
| `border-soft` | `#e6d6ca` | Subtle dividers |

### Typography
- **Display / Headings** — `Outfit` via `font-display`
- **Body** — `Inter` via `font-sans`

---

## Scripts

### Backend

```bash
npm start      # Production start
npm run dev    # Development with nodemon
```

### Frontend

```bash
npm run dev      # Development server (port 3000)
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint check
```

---

## Demo Mode

The frontend works fully offline without a backend connection. When no real API token is available, the app uses `demoTaskStore.js` — a localStorage-based task system that mirrors the full API including accept/deny, status changes, and admin approvals.

To test:
1. Register any account on the signup page
2. The app automatically falls back to demo mode if the backend is unreachable
3. All task workflows function normally — data persists in `localStorage`

---

## Deployment

### Backend (e.g. Railway, Render, Heroku)
1. Set all environment variables in the platform dashboard
2. Set `NODE_ENV=production`
3. Deploy — `npm start` is the start command

### Frontend (e.g. Vercel, Netlify)
1. Set `VITE_API_BASE_URL` to your deployed backend URL
2. Build command: `npm run build`
3. Output directory: `dist`
4. The `vercel.json` config is already included for SPA routing

---

## License

MIT — free to use for academic, personal, and commercial projects.
