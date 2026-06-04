import { useState } from "react";
import { useAuth } from "@hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  Settings,
  Menu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@components/ui/BrandLogo";
import Button from "@components/ui/Button";

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout(() => navigate("/", { replace: true }));
  };

  return (
    <header className="relative z-30 flex h-[76px] min-w-0 items-center justify-between gap-4 border-b border-[#ead8cb] bg-[#fff8f3]/90 px-4 backdrop-blur-sm sm:px-5 lg:h-20 lg:px-6">
      <div className="flex min-w-0 flex-shrink-0 items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-[#e6d6ca] bg-white text-slate-500 shadow-sm hover:border-[#13856f]/50 hover:bg-[#e8f6f2] hover:text-[#13856f] lg:hidden"
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <BrandLogo size="md" showSubtitle={false} className="flex-shrink-0" />
      </div>

      <div className="flex min-w-0 flex-shrink-0 items-center gap-3">
        <div className="relative">
          <Button
            variant="ghost"
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
            className="flex min-h-12 items-center gap-3 rounded-2xl border border-[#e6d6ca] bg-white px-3.5 py-2 shadow-sm hover:border-[#13856f]/40 sm:px-4"
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#8d514f] text-sm font-bold text-white">
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
                className="absolute right-0 top-14 z-50 w-56 overflow-hidden rounded-2xl border border-[#ead8cb] bg-white shadow-[0_20px_60px_rgba(90,55,20,0.14)]"
              >
                <div className="border-b border-[#f4ddd0] px-4 py-3">
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
                    className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#fffaf6] hover:text-[#13856f]"
                  >
                    <User className="h-4 w-4" /> Profile
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      navigate("/dashboard/profile");
                      setDropdownOpen(false);
                    }}
                    className="flex w-full items-center justify-start gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-[#fffaf6] hover:text-[#13856f]"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Button>
                  <div className="my-1 h-px bg-[#f4ddd0]" />
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
