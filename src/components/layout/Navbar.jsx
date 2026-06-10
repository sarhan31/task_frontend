import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  User,
  Settings,
  Menu,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@components/ui/BrandLogo";
import Button from "@components/ui/Button";
import { useTaskStore } from "@services/taskStore";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const setSearchQuery = useTaskStore((s) => s.setSearchQuery);
  const searchQuery = useTaskStore((s) => s.searchQuery);

  // Only show search bar on task-related pages
  const showSearch = location.pathname.includes('/tasks') ||
    location.pathname.includes('/board') ||
    location.pathname === '/admin' ||
    location.pathname === '/dashboard';

  const handleLogout = () => {
    logout(() => navigate("/", { replace: true }));
  };

  return (
    <header className="relative z-30 flex h-[76px] min-w-0 items-center justify-between gap-4 border-b border-border bg-surface-base/90 px-4 backdrop-blur-sm sm:px-5 lg:h-20 lg:px-6">
      <div className="flex min-w-0 flex-shrink-0 items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-border-soft bg-white text-slate-500 shadow-sm hover:border-brand/50 hover:bg-brand-light hover:text-brand lg:hidden"
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <BrandLogo size="md" showSubtitle={false} className="flex-shrink-0" />
      </div>

      {/* Search bar — visible on task pages */}
      {showSearch && (
        <div className="hidden flex-1 max-w-sm items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 shadow-sm transition focus-within:border-brand/50 focus-within:ring-1 focus-within:ring-brand/20 md:flex">
          <Search className="h-4 w-4 flex-shrink-0 text-brand" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks…"
            className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              ×
            </button>
          )}
        </div>
      )}

      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex min-h-12 items-center gap-3 rounded-2xl border border-border-soft bg-white px-3.5 py-2 shadow-sm hover:border-brand/40 sm:px-4"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-warm text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="max-w-32 truncate text-sm font-semibold leading-tight text-slate-800">
                {user?.name}
              </p>
              <p className="text-xs capitalize leading-tight text-slate-500">
                {user?.role}
              </p>
            </div>
          </Button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-border bg-white shadow-[0_20px_60px_rgba(90,55,20,0.14)]"
              >
                <div className="border-b border-border-light px-4 py-3">
                  <p className="text-sm font-semibold text-slate-800">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-surface-card hover:text-brand"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-surface-card hover:text-brand"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Button>
                  <div className="my-1 h-px bg-border-light" />
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;
