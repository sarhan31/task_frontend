# Complete Folder Structure

```
task-management-system/
│
├── public/                          # Static assets served directly
│   ├── vite.svg
│   └── favicon.ico
│
├── src/                             # Source code
│   │
│   ├── assets/                      # Static assets (images, icons, fonts)
│   │   ├── images/
│   │   │   ├── logo.png
│   │   │   └── placeholder.png
│   │   ├── icons/
│   │   │   └── custom-icons.svg
│   │   └── fonts/
│   │       └── custom-fonts.woff2
│   │
│   ├── components/                  # Reusable components
│   │   │
│   │   ├── ui/                     # Base UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Dropdown.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Toaster.jsx
│   │   │   ├── Checkbox.jsx
│   │   │   ├── Radio.jsx
│   │   │   ├── Switch.jsx
│   │   │   ├── Tabs.jsx
│   │   │   ├── Tooltip.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── Progress.jsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Container.jsx
│   │   │   └── Grid.jsx
│   │   │
│   │   ├── cards/                  # Card components
│   │   │   ├── StatCard.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── UserCard.jsx
│   │   │   └── ProjectCard.jsx
│   │   │
│   │   ├── charts/                 # Chart components
│   │   │   ├── TaskChart.jsx
│   │   │   ├── LineChart.jsx
│   │   │   ├── PieChart.jsx
│   │   │   └── AreaChart.jsx
│   │   │
│   │   ├── forms/                  # Form components
│   │   │   ├── TaskForm.jsx
│   │   │   ├── UserForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── SearchForm.jsx
│   │   │
│   │   ├── tasks/                  # Task-related components
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskList.jsx
│   │   │   ├── TaskBoard.jsx
│   │   │   ├── TaskDetails.jsx
│   │   │   └── TaskFilters.jsx
│   │   │
│   │   └── users/                  # User-related components
│   │       ├── UserCard.jsx
│   │       ├── UserList.jsx
│   │       ├── UserProfile.jsx
│   │       └── UserAvatar.jsx
│   │
│   ├── pages/                       # Page components
│   │   │
│   │   ├── auth/                   # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── ResetPassword.jsx
│   │   │
│   │   ├── admin/                  # Admin dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── UserManagement.jsx
│   │   │   ├── SystemSettings.jsx
│   │   │   └── Reports.jsx
│   │   │
│   │   ├── user/                   # User dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   ├── TaskBoard.jsx
│   │   │   └── Profile.jsx
│   │   │
│   │   └── NotFound.jsx            # 404 page
│   │
│   ├── layouts/                     # Layout wrappers
│   │   ├── AuthLayout.jsx
│   │   ├── DashboardLayout.jsx
│   │   └── PublicLayout.jsx
│   │
│   ├── routes/                      # Route configuration
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── PublicRoute.jsx
│   │
│   ├── context/                     # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── TaskContext.jsx
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useTheme.js
│   │   ├── useTasks.js
│   │   ├── useDebounce.js
│   │   ├── useLocalStorage.js
│   │   └── useMediaQuery.js
│   │
│   ├── services/                    # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── taskService.js
│   │   ├── userService.js
│   │   └── analyticsService.js
│   │
│   ├── utils/                       # Utility functions
│   │   ├── cn.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   ├── constants.js
│   │   └── helpers.js
│   │
│   ├── data/                        # Mock data and constants
│   │   ├── mockData.js
│   │   └── seedData.js
│   │
│   ├── App.jsx                      # Root component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
│
├── .env.example                     # Environment variables template
├── .env                             # Environment variables (gitignored)
├── .gitignore                       # Git ignore rules
├── .eslintrc.cjs                    # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite configuration
├── README.md                        # Project documentation
├── SETUP_GUIDE.md                   # Setup instructions
└── FOLDER_STRUCTURE.md              # This file
```

## Component Categories

### UI Components (`src/components/ui/`)
Base reusable UI elements used throughout the application:
- **Avatar**: User profile pictures
- **Badge**: Status indicators and labels
- **Button**: Action buttons with variants
- **Card**: Container component
- **Dropdown**: Dropdown menus
- **Input**: Form input fields
- **Loading**: Loading spinners
- **Modal**: Dialog boxes
- **Select**: Dropdown selects
- **Toaster**: Toast notifications

### Layout Components (`src/components/layout/`)
Structural components for page layouts:
- **Sidebar**: Navigation sidebar
- **Navbar**: Top navigation bar
- **Footer**: Page footer
- **Container**: Content wrapper
- **Grid**: Grid layout system

### Feature Components
Domain-specific components:
- **Cards**: Specialized card components
- **Charts**: Data visualization
- **Forms**: Form components
- **Tasks**: Task management UI
- **Users**: User management UI

## Page Structure

### Authentication Pages (`src/pages/auth/`)
- Login
- Register
- Forgot Password
- Reset Password

### Admin Pages (`src/pages/admin/`)
- Dashboard (analytics and overview)
- User Management (CRUD operations)
- System Settings (configuration)
- Reports (data exports)

### User Pages (`src/pages/user/`)
- Dashboard (personal overview)
- My Tasks (task list)
- Task Board (Kanban view)
- Profile (user settings)

## Service Layer

### API Services (`src/services/`)
- **api.js**: Axios instance with interceptors
- **authService.js**: Authentication endpoints
- **taskService.js**: Task CRUD operations
- **userService.js**: User management
- **analyticsService.js**: Analytics and reports

## State Management

### Context Providers (`src/context/`)
- **AuthContext**: User authentication state
- **ThemeContext**: Theme preferences
- **TaskContext**: Task-related state

### Custom Hooks (`src/hooks/`)
- **useAuth**: Authentication logic
- **useTheme**: Theme switching
- **useTasks**: Task operations
- **useDebounce**: Debounced values
- **useLocalStorage**: Local storage sync
- **useMediaQuery**: Responsive breakpoints

## Utilities

### Helper Functions (`src/utils/`)
- **cn.js**: Class name merger (Tailwind)
- **validators.js**: Form validation
- **formatters.js**: Data formatting
- **constants.js**: App constants
- **helpers.js**: General utilities

## Configuration Files

- **vite.config.js**: Build tool configuration
- **tailwind.config.js**: Styling configuration
- **postcss.config.js**: CSS processing
- **.eslintrc.cjs**: Code linting rules
- **package.json**: Dependencies and scripts

## Best Practices

1. **Component Organization**: Group by feature, not by type
2. **Naming Conventions**: PascalCase for components, camelCase for utilities
3. **File Structure**: One component per file
4. **Import Aliases**: Use @ aliases for cleaner imports
5. **Code Splitting**: Lazy load routes and heavy components
6. **Type Safety**: Add PropTypes or TypeScript
7. **Testing**: Co-locate tests with components
8. **Documentation**: Comment complex logic
