import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CheckSquare,
  BarChart3,
  FileText,
  CalendarDays,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@utils/cn";
import BrandLogo from "@components/ui/BrandLogo";
import Button from "@components/ui/Button";

const PremiumSidebar = ({ collapsed, setCollapsed }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/premium-dashboard" },
    { icon: CheckSquare, label: "Tasks", path: "/premium-dashboard/tasks" },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/premium-dashboard/analytics",
    },
    { icon: FileText, label: "Reports", path: "/premium-dashboard/reports" },
    { icon: CalendarDays, label: "Calendar", path: "/dashboard/calendar" },
    { icon: Settings, label: "Settings", path: "/premium-dashboard/settings" },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 88 : 288 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-[#ead8cb] bg-[#fff8f3] shadow-[0_20px_60px_rgba(90,55,20,0.10)] lg:flex"
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

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#e6d6ca] bg-white text-slate-500 shadow-sm hover:border-[#13856f]/40 hover:bg-[#e8f6f2] hover:text-[#13856f]"
          title={collapsed ? "Show sidebar" : "Hide sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3 py-4 custom-scrollbar">
        {!collapsed && (
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Navigation
          </p>
        )}

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
      </nav>

      <div className="relative z-10 border-t border-[#ead8cb] p-3">
        <div
          className={cn(
            "rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-3",
            collapsed ? "flex justify-center" : "flex items-center gap-3",
          )}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#8d514f] text-sm font-semibold text-white">
            JD
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">
                  John Doe
                </p>
                <p className="truncate text-xs text-slate-500">
                  john@example.com
                </p>
              </div>
              <Button variant="ghost" size="sm" className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-[#ffeceb] hover:text-red-500">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default PremiumSidebar;
