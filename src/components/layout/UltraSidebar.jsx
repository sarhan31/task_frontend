import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Clock,
  FolderKanban,
  History,
  Settings,
  Plus,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  CheckSquare,
} from "lucide-react";
import { cn } from "@utils/cn";
import { useAuth } from "@hooks/useAuth";
import { taskService } from "@services/taskService";
import { demoTaskStore } from "@services/demoTaskStore";
import NotificationBadge from "@components/ui/NotificationBadge";
import BrandLogo from "@components/ui/BrandLogo";

const isDemoToken = () => {
  const t = localStorage.getItem('token');
  return !t || t.startsWith('demo-token:');
};

const UltraSidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchPendingCount();
      // Poll every 30 seconds
      const interval = setInterval(fetchPendingCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPendingCount = async () => {
    try {
      if (isDemoToken()) {
        setPendingCount(demoTaskStore.getPendingApprovals().length);
      } else {
        const response = await taskService.getPendingApprovals();
        setPendingCount(response.data.length);
      }
    } catch (error) {
      // fallback to demo store
      setPendingCount(demoTaskStore.getPendingApprovals().length);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Clock, label: "My Tasks", path: "/dashboard/tasks" },
    {
      icon: FolderKanban,
      label: "Task Board",
      path: "/dashboard/board",
    },
    { icon: History, label: "Notifications", path: "/dashboard/notifications" },
  ];

  const adminTools = [
    { icon: CheckSquare, label: "Pending Approvals", path: "/admin/pending-approvals", badge: pendingCount },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const tools = user?.role === 'admin' ? adminTools : [
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 288 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-[#ead8cb] bg-[#fff8f3] shadow-[0_20px_60px_rgba(90,55,20,0.10)]"
    >
      <div className="pointer-events-none absolute left-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-[#efbf91]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-2rem] right-[-2rem] h-32 w-32 rounded-full bg-[#13856f]/10 blur-3xl" />

      <div
        className={cn(
          "relative z-10 flex h-20 items-center border-b border-[#ead8cb]",
          collapsed
            ? "justify-between gap-2 px-3"
            : "justify-between gap-4 px-5",
        )}
      >
        {!collapsed ? (
          <BrandLogo size="sm" showSubtitle={false} />
        ) : (
          <div />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border border-[#e6d6ca] bg-white text-slate-500 shadow-sm transition hover:border-[#13856f]/40 hover:bg-[#e8f6f2] hover:text-[#13856f]"
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-3.5 w-3.5" />
          ) : (
            <PanelLeftClose className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="relative z-10 px-4 pt-4">
          <div className="rounded-2xl border border-[#f4ddd0] bg-white px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-slate-800">
                Initial project 1.0
              </span>
              <svg
                className="h-4 w-4 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      )}

      <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
        )}
        <div className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "group flex items-center rounded-2xl transition-all duration-200",
                  collapsed ? "justify-center px-3 py-3" : "gap-3 px-3 py-3",
                  isActive
                    ? "bg-[#13856f] text-white shadow-[0_4px_14px_rgba(19,133,111,0.28)]"
                    : "text-slate-600 hover:bg-[#e8f6f2] hover:text-[#13856f]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-[#13856f]",
                    )}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {!collapsed && (
          <div className="mt-7">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              Tools
            </p>
            <div className="space-y-1">
              {tools.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-all duration-200",
                      isActive
                        ? "bg-[#13856f] text-white shadow-[0_4px_14px_rgba(19,133,111,0.28)]"
                        : "text-slate-600 hover:bg-[#e8f6f2] hover:text-[#13856f]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive
                            ? "text-white"
                            : "text-slate-400 group-hover:text-[#13856f]",
                        )}
                      />
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.badge > 0 && (
                        <NotificationBadge count={item.badge} className="right-2" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="relative z-10 border-t border-[#ead8cb] p-3">
        {!collapsed && user?.role === 'admin' && (
          <button className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#13856f] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)] transition hover:bg-[#0f7260]">
            <Plus className="h-4 w-4" />
            <span>Add New Task</span>
          </button>
        )}

        <div
          className={cn(
            "rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-3",
            collapsed ? "flex justify-center" : "flex items-center gap-3",
          )}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8d514f] text-white">
            <User className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name || 'User'}
              </p>
              <p className="truncate text-xs text-slate-500 capitalize">
                {user?.role || 'Member'}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default UltraSidebar;
