import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';

// Layouts
import DashboardLayout from '@layouts/DashboardLayout';

// Auth Pages (Ultra Premium Only)
import UltraPremiumLogin from '@pages/auth/UltraPremiumLogin';
import UltraPremiumSignup from '@pages/auth/UltraPremiumSignup';
import ForgotPassword from '@pages/auth/ForgotPassword';
import ResetPassword from '@pages/auth/ResetPassword';

// Admin Pages
import AdminDashboard from '@pages/admin/Dashboard';
import AdminTasks from '@pages/admin/AdminTasks';
import UserManagement from '@pages/admin/UserManagement';
import SystemSettings from '@pages/admin/SystemSettings';
import Reports from '@pages/admin/Reports';
import PendingApprovals from '@pages/admin/PendingApprovals';

// User Pages
import UltraDashboard from '@pages/user/UltraDashboard';
import PremiumDashboard from '@pages/user/PremiumDashboard';
import UserDashboard from '@pages/user/Dashboard';
import MyTasks from '@pages/user/MyTasks';
import TaskBoard from '@pages/user/TaskBoard';
import Profile from '@pages/user/Profile';
import CalendarView from '@pages/user/CalendarView';
import AuditTrail from '@pages/admin/AuditTrail';
import TaskTemplates from '@pages/admin/TaskTemplates';

// Shared Pages
import HomePage from '@pages/HomePage';
import NotFound from '@pages/NotFound';

const FiredAccount = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    logout(() => navigate('/', { replace: true }));
  };

  return (
    <div className="min-h-screen bg-red-950 px-3 py-4 text-white sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-3xl items-center">
        <div className="w-full rounded-[24px] border border-red-300/30 bg-white/10 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur sm:rounded-[28px] sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-red-100">
            Account Terminated
          </p>
          <h1 className="mt-3 text-3xl font-black leading-tight">
            You cannot access the dashboard because you are fired.
          </h1>
          <p className="mt-4 text-sm leading-7 text-red-50">
            Your task access has been removed and no new task can be assigned to this account.
          </p>
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-100">Reason</p>
            <p className="mt-2 text-base font-semibold leading-7">
              {user?.firedReason || 'Administration did not provide a detailed reason.'}
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              'Read the reason carefully.',
              'Contact administration for clarification.',
              'Wait until admin hires you back.'
            ].map((step) => (
              <div key={step} className="rounded-2xl border border-white/15 bg-white/10 p-4">
                <p className="text-xs font-bold leading-5 text-red-50">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold leading-5 text-red-100">
              Use another account or wait until admin hires this account back.
            </p>
            <button
              type="button"
              onClick={handleBackToHome}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-red-900 transition hover:bg-red-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.status === 'fired') {
    return <Navigate to="/fired" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* ── Auth Routes (Single Ultra Premium Set) ── */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to={user?.status === 'fired' ? '/fired' : user?.role === 'admin' ? '/admin' : '/dashboard'} /> : <UltraPremiumLogin />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to={user?.status === 'fired' ? '/fired' : user?.role === 'admin' ? '/admin' : '/dashboard'} /> : <UltraPremiumSignup />} 
      />
      <Route path="/fired" element={isAuthenticated && user?.status === 'fired' ? <FiredAccount /> : <Navigate to={isAuthenticated ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login'} replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Backward compatibility redirects */}
      <Route path="/ultra-login" element={<Navigate to="/login" replace />} />
      <Route path="/ultra-signup" element={<Navigate to="/signup" replace />} />
      <Route path="/premium-login" element={<Navigate to="/login" replace />} />
      <Route path="/premium-signup" element={<Navigate to="/signup" replace />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />

      {/* Dashboard variants (kept for compatibility) */}
      <Route path="/ultra-dashboard" element={<ProtectedRoute><UltraDashboard /></ProtectedRoute>} />
      <Route path="/premium-dashboard" element={<ProtectedRoute><PremiumDashboard /></ProtectedRoute>} />

      {/* ── Admin Routes ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="tasks" element={<AdminTasks />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="settings" element={<SystemSettings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="pending-approvals" element={<PendingApprovals />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="audit" element={<AuditTrail />} />
        <Route path="templates" element={<TaskTemplates />} />
      </Route>

      {/* ── User Routes ── */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="board" element={<TaskBoard />} />
        <Route path="calendar" element={<CalendarView />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ── Default Routes ── */}
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route path="/unauthorized" element={<div className="flex items-center justify-center h-screen"><h1 className="text-2xl font-bold">Unauthorized Access</h1></div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
