import { NavLink } from "react-router-dom";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  BarChart3,
  Trello,
  CalendarDays,
  ClipboardList,
  History,
  LogOut,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
} from "lucide-react";
import Button from "@components/ui/Button";
import { cn } from "@utils/cn";

const Sidebar = ({ isOpen, onToggle, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const adminLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/tasks", icon: CheckSquare, label: "Tasks" },
    { to: "/admin/calendar", icon: CalendarDays, label: "Calendar" },
    { to: "/admin/templates", icon: ClipboardList, label: "Templates" },
    { to: "/admin/users", icon: Users, label: "Users" },
    { to: "/admin/reports", icon: BarChart3, label: "Reports" },
    { to: "/admin/audit", icon: History, label: "Audit Trail" },
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ];

  const userLinks = [
    { to: "/", icon: Home, label: "Home" },
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/dashboard/tasks", icon: CheckSquare, label: "My Tasks" },
    { to: "/dashboard/board", icon: Trello, label: "Task Board" },
    { to: "/dashboard/calendar", icon: CalendarDays, label: "Calendar" },
    { to: "/dashboard/profile", icon: Settings, label: "Profile" },
  ];

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout(() => navigate("/", { replace: true }));
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-screen flex-col overflow-hidden border-r border-[#ead8cb] bg-[#fff8f3] transition-transform duration-300 ease-out",
        isMobile
          ? (isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full")
          : (isOpen ? "w-64 translate-x-0" : "w-20 translate-x-0"),
      )}
      style={{ minWidth: isMobile ? 256 : (isOpen ? 256 : 80) }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute left-[-3rem] top-[-3rem] h-40 w-40 rounded-full bg-[#efbf91]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-2rem] right-[-2rem] h-32 w-32 rounded-full bg-[#13856f]/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between gap-3 border-b border-[#ead8cb] px-3 py-4">
        <div className="min-w-0">
          {isOpen ? (
            <>
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Workspace Navigation
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                Quick access to your panels
              </p>
            </>
          ) : (
            <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Menu
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onToggle(!isOpen)}
          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-[#e6d6ca] bg-white text-slate-500 shadow-sm hover:border-[#13856f]/40 hover:bg-[#e8f6f2] hover:text-[#13856f]"
          title={isOpen ? "Hide sidebar" : "Show sidebar"}
          aria-label={isOpen ? "Hide sidebar" : "Show sidebar"}
        >
          {isOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      <nav
        className={cn(
          "relative z-10 flex-1 overflow-y-auto py-4",
          isOpen ? "space-y-1 px-3" : "space-y-2 px-2",
        )}
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/" || link.to === "/admin" || link.to === "/dashboard"}
            onClick={() => {
              if (isMobile) {
                onToggle(false);
              }
            }}
            className={({ isActive }) =>
              cn(
                "group flex items-center rounded-2xl text-sm font-medium transition-all duration-200",
                isOpen ? "gap-3 px-3 py-2.5" : "justify-center px-2 py-3",
                isActive
                  ? "bg-[#13856f] text-white shadow-[0_4px_14px_rgba(19,133,111,0.28)]"
                  : "text-slate-600 hover:bg-[#e8f6f2] hover:text-[#13856f]",
              )
            }
          >
            {({ isActive }) => (
              <>
                <link.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-[#13856f]",
                  )}
                />
                {isOpen && <span>{link.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider + user footer */}
      <div className="relative z-10 border-t border-[#ead8cb] p-3">
        <div className={cn("flex items-center rounded-2xl p-2", isOpen ? "gap-3" : "justify-center")}>
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#8d514f] text-white text-sm font-semibold">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {isOpen && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name}
              </p>
              <p className="truncate text-xs capitalize text-slate-500">
                {user?.role}
              </p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-[#ffeceb] hover:text-red-500"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
