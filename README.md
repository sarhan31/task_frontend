# Task Management System - Professional Frontend Architecture

A modern, scalable Task Management System built with React.js and Tailwind CSS, featuring JWT authentication, role-based access control, and a beautiful SaaS UI.

## 🚀 Features

- **JWT Authentication** - Secure login and registration
- **Role-Based Access Control** - Admin and User roles with different permissions
- **Dashboard Analytics** - Real-time statistics and insights
- **Task Management** - Create, update, delete, and organize tasks
- **File Upload** - Attach files to tasks
- **Charts & Reports** - Visual data representation with Recharts
- **Responsive Design** - Mobile-first, fully responsive UI
- **Modern SaaS UI** - Professional interface inspired by Trello, ClickUp, and Asana

## 🛠️ Tech Stack

- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **Recharts** - Charting library
- **Lucide React** - Icon library
- **Zustand** - State management
- **React Hook Form** - Form handling
- **Vite** - Build tool

## 📁 Project Structure

```
task-management-system/
├── public/
├── src/
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/          # Reusable components
│   │   ├── ui/             # Base UI components
│   │   ├── layout/         # Layout components
│   │   ├── cards/          # Card components
│   │   ├── charts/         # Chart components
│   │   ├── forms/          # Form components
│   │   ├── tasks/          # Task-related components
│   │   └── users/          # User-related components
│   ├── pages/              # Page components
│   │   ├── auth/           # Authentication pages
│   │   ├── admin/          # Admin dashboard pages
│   │   └── user/           # User dashboard pages
│   ├── layouts/            # Layout wrappers
│   ├── routes/             # Route configuration
│   ├── context/            # React Context providers
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── utils/              # Utility functions
│   ├── data/               # Mock data and constants
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Task Management System
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🎨 Component Architecture

### UI Components
- Button, Input, Select, Checkbox, Radio
- Modal, Dropdown, Tooltip, Badge
- Card, Table, Pagination
- Loading, Error, Empty states

### Layout Components
- Sidebar, Navbar, Footer
- Container, Grid, Flex
- Dashboard layouts

### Feature Components
- Task cards, Task lists, Task boards
- User profiles, User lists
- Charts and analytics
- File upload and preview

## 🔐 Authentication Flow

1. User visits the application
2. Redirected to login page if not authenticated
3. Login with credentials (JWT token stored in localStorage)
4. Redirected to appropriate dashboard based on role
5. Protected routes check authentication and authorization

## 👥 User Roles

### Admin
- Full access to all features
- User management
- System analytics
- Task oversight

### User
- Personal dashboard
- Task management
- Profile settings
- Limited analytics

## 🎯 Best Practices Implemented

- Component-based architecture
- Custom hooks for reusable logic
- Context API for global state
- Proper error handling
- Loading states
- Responsive design
- Accessibility considerations
- Code splitting and lazy loading
- Environment variables
- Clean code principles

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Your Name - Final Year Project

## 🙏 Acknowledgments

- Inspired by modern SaaS platforms like Trello, ClickUp, Asana, and Notion
- Built with best practices from the React community
