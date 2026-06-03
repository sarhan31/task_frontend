import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@components/layout/Sidebar";
import Navbar from "@components/layout/Navbar";
import { useTaskStore } from "@services/taskStore";

const DashboardLayout = () => {
  const fetchTasks = useTaskStore((state) => state.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-x-clip overflow-y-hidden bg-[#f7e3cf]">
      {/* Ambient background blobs */}
      <div className="pointer-events-none fixed left-[-6rem] top-[-5rem] h-72 w-72 rounded-full bg-[#efbf91]/30 blur-3xl z-0" />
      <div className="pointer-events-none fixed bottom-[-6rem] right-[-4rem] h-80 w-80 rounded-full bg-white/40 blur-3xl z-0" />
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#13856f]/5 blur-3xl z-0" />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} isMobile={isMobile} />

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-[2px] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className="relative z-10 flex min-w-0 flex-1 flex-col overflow-x-clip overflow-y-hidden transition-[padding-left] duration-300"
        style={{ paddingLeft: isMobile ? 0 : (sidebarOpen ? 256 : 80) }}
      >
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main className="flex-1 overflow-x-clip overflow-y-auto px-3 py-4 custom-scrollbar sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
