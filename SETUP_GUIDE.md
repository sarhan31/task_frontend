# Task Management System - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

Or if you prefer yarn:

```bash
yarn install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf
```

### 3. Start Development Server

```bash
npm run dev
```

The application will open at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### 5. Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure Explained

```
task-management-system/
├── public/                 # Static assets
├── src/
│   ├── assets/            # Images, icons, fonts
│   ├── components/        # Reusable components
│   │   ├── ui/           # Base UI components (Button, Input, etc.)
│   │   ├── layout/       # Layout components (Sidebar, Navbar)
│   │   ├── cards/        # Card components
│   │   ├── charts/       # Chart components
│   │   ├── forms/        # Form components
│   │   ├── tasks/        # Task-related components
│   │   └── users/        # User-related components
│   ├── pages/            # Page components
│   │   ├── auth/         # Login, Register, ForgotPassword
│   │   ├── admin/        # Admin dashboard pages
│   │   └── user/         # User dashboard pages
│   ├── layouts/          # Layout wrappers
│   ├── routes/           # Route configuration
│   ├── context/          # React Context (Auth, Theme)
│   ├── hooks/            # Custom hooks
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── data/             # Mock data and constants
│   ├── App.jsx           # Root component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── README.md             # Project documentation
```

## 🎨 Key Features Implementation

### Authentication
- JWT-based authentication
- Protected routes
- Role-based access control (Admin/User)
- Login, Register, Forgot Password pages

### Dashboard
- Real-time statistics
- Interactive charts (Recharts)
- Task analytics
- User management (Admin only)

### Task Management
- Create, Read, Update, Delete tasks
- Task status tracking
- Priority levels
- File attachments
- Kanban board view

### UI Components
- Fully responsive design
- Modern SaaS interface
- Smooth animations (Framer Motion)
- Toast notifications
- Modal dialogs
- Dropdown menus
- Form validation

## 🔧 Configuration

### Path Aliases

The project uses path aliases for cleaner imports:

```javascript
import Button from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import api from '@services/api';
```

Configured in `vite.config.js`:
- `@` → `./src`
- `@components` → `./src/components`
- `@pages` → `./src/pages`
- `@hooks` → `./src/hooks`
- `@context` → `./src/context`
- `@services` → `./src/services`
- `@utils` → `./src/utils`
- `@assets` → `./src/assets`
- `@layouts` → `./src/layouts`
- `@routes` → `./src/routes`
- `@data` → `./src/data`

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:
- Primary color palette
- Secondary color palette
- Custom fonts (Inter)
- Custom shadows
- Extended utilities

## 🔌 API Integration

### Setting Up Backend

1. Update `VITE_API_BASE_URL` in `.env` file
2. Ensure your backend API is running
3. API endpoints should match the service files:
   - `/api/auth/*` - Authentication
   - `/api/tasks/*` - Task management
   - `/api/users/*` - User management
   - `/api/analytics/*` - Analytics and reports

### API Service Structure

```javascript
// Example: src/services/taskService.js
import api from './api';

export const taskService = {
  getTasks: (filters) => api.get('/tasks', { params: filters }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};
```

## 🎯 Development Tips

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/routes/AppRoutes.jsx`
3. Add navigation link in `src/components/layout/Sidebar.jsx`

### Creating New Components

1. Create component file in appropriate `src/components/` subdirectory
2. Use existing UI components for consistency
3. Follow naming conventions (PascalCase for components)

### State Management

- **Local State**: `useState` for component-specific state
- **Global State**: Context API (Auth, Theme)
- **Server State**: Custom hooks (useTasks, useUsers)

### Styling Guidelines

- Use Tailwind CSS utility classes
- Follow mobile-first approach
- Use custom classes from `src/index.css` for common patterns
- Maintain consistent spacing and colors

## 🧪 Testing

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

## 📦 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change port in vite.config.js
server: {
  port: 3001,
}
```

### Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf dist
npm run build
```

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 🤝 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed description

## 📄 License

MIT License - feel free to use this project for your final year project or any other purpose.
