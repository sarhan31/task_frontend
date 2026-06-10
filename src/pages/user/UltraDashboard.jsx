import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  CheckCircle2,
  BarChart3,
  User,
  ArrowRight,
  Sparkles,
  FolderKanban,
  Clock,
  Activity,
  TrendingUp,
} from "lucide-react";
import UltraSidebar from "@components/layout/UltraSidebar";
import TaskChart from "@components/charts/TaskChart";
import { cn } from "@utils/cn";
import Button from "@components/ui/Button";

const UltraDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const chartData = [
    { name: "Jan", completed: 20, inProgress: 12, todo: 8 },
    { name: "Feb", completed: 26, inProgress: 14, todo: 7 },
    { name: "Mar", completed: 31, inProgress: 12, todo: 9 },
    { name: "Apr", completed: 35, inProgress: 16, todo: 8 },
    { name: "May", completed: 40, inProgress: 13, todo: 6 },
    { name: "Jun", completed: 44, inProgress: 11, todo: 5 },
  ];

  const stats = [
    {
      label: "24",
      sublabel: "Active Projects",
      icon: FolderKanban,
      tone: "bg-brand",
    },
    {
      label: "89",
      sublabel: "Tasks Closed",
      icon: CheckCircle2,
      tone: "bg-warm",
    },
  ];

  const tasks = [
    {
      title: "Dashboard Design",
      progress: 100,
      status: "Completed",
      date: "Mar 13, 2021",
    },
    {
      title: "App UI/UX Design",
      progress: 35,
      status: "Ongoing",
      date: "Mar 13, 2021",
    },
    {
      title: "User Flow Mapping",
      progress: 72,
      status: "Review",
      date: "Mar 15, 2021",
    },
  ];

  const projects = [
    { name: "Hope", subtitle: "UI/UX Design", progress: 35, active: false },
    { name: "Core", subtitle: "UX Research", progress: 100, active: true },
  ];

  const teamUpdates = [
    {
      name: "Charles Brown",
      action: "Completed the Dashboard Design task",
      time: "5:43 PM",
      avatar: "CB",
    },
    {
      name: "Darrin Sturt",
      action: "Submitted progress update on App UI/UX",
      time: "4:30 PM",
      avatar: "DS",
    },
    {
      name: "Milton Lam",
      action: "Requested review for User Flow Mapping",
      time: "3:00 PM",
      avatar: "ML",
    },
  ];

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay, ease: [0.4, 0, 0.2, 1] },
  });

  return (
    <div className="min-h-screen bg-surface-page">
      <UltraSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72",
        )}
      >
        <div className="sticky top-0 z-40 border-b border-border bg-surface-base/90 backdrop-blur-sm">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div>
              <h1 className="text-2xl font-display font-bold text-slate-900">
                Dashboard
              </h1>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden min-w-[240px] items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm md:flex">
                <Search className="h-4 w-4 text-brand" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <div className="hidden items-center gap-2 rounded-2xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm sm:flex">
                <Calendar className="h-4 w-4 text-brand" />
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>

            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.83fr)]">
            <div className="min-w-0 space-y-6">
              <motion.div
                {...fadeUp(0)}
                className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-7 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
              >
                <div className="absolute left-0 top-8 bottom-8 w-1.5 rounded-full bg-brand" />
                <div className="pointer-events-none absolute right-8 top-5 h-28 w-28 rounded-full bg-warm-light/20 blur-2xl" />
                <div className="pointer-events-none absolute right-28 bottom-2 h-20 w-20 rounded-full bg-brand/10 blur-2xl" />

                <div className="flex flex-col gap-5 pl-6 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand">
                      Ultra workspace
                    </p>
                    <h2 className="mt-1 font-display text-3xl font-bold text-slate-900">
                      Welcome to your task management area
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                      A focused executive view for projects, tasks, and
                      communication—using the same warm premium theme already in
                      the app.
                    </p>
                  </div>
                  <Button variant="custom" size="none" className="inline-flex items-center gap-2 self-start rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)] transition hover:bg-brand-dark hover:shadow-[0_12px_32px_rgba(19,133,111,0.36)]">
                    <Sparkles className="h-4 w-4" />
                    Learn More
                  </Button>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
                <motion.div
                  {...fadeUp(0.08)}
                  className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Overview
                      </p>
                      <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                        Tasks
                      </h3>
                    </div>
                    <BarChart3 className="h-5 w-5 text-brand" />
                  </div>
                  <TaskChart data={chartData} />
                </motion.div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      {...fadeUp(0.12 + index * 0.08)}
                      className="rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-slate-900">
                            {stat.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {stat.sublabel}
                          </p>
                        </div>
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.tone} text-white`}
                        >
                          <stat.icon className="h-5 w-5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                {...fadeUp(0.24)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Progress
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Tasks Progress
                    </h3>
                  </div>
                  <Clock className="h-5 w-5 text-brand" />
                </div>

                <div className="space-y-5">
                  {tasks.map((task) => (
                    <div key={task.title}>
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            Start Date: {task.date}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-1 text-xs font-semibold",
                            task.status === "Completed" &&
                              "bg-brand-light text-brand",
                            task.status === "Ongoing" &&
                              "bg-surface-hover text-warm-accent",
                            task.status === "Review" &&
                              "bg-[#fdf0ef] text-warm",
                          )}
                        >
                          {task.status}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-border-light">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs font-medium text-slate-500">
                        {task.progress}% complete
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="min-w-0 space-y-6">
              <motion.div
                {...fadeUp(0.14)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Profile
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Workspace Owner
                    </h3>
                  </div>
                  <User className="h-5 w-5 text-brand" />
                </div>

                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_24px_rgba(19,133,111,0.28)]">
                    <User className="h-10 w-10" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-slate-900">
                    Mirha Fatima
                  </h4>
                  <p className="text-sm text-slate-500">UI/UX designer</p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {projects.map((project) => (
                    <div
                      key={project.name}
                      className={cn(
                        "rounded-2xl p-4",
                        project.active
                          ? "bg-brand text-white"
                          : "border border-border-light bg-surface-card",
                      )}
                    >
                      <p
                        className={cn(
                          "font-semibold",
                          project.active ? "text-white" : "text-slate-800",
                        )}
                      >
                        {project.name}
                      </p>
                      <p
                        className={cn(
                          "mt-1 text-xs",
                          project.active ? "text-white/80" : "text-slate-500",
                        )}
                      >
                        {project.subtitle}
                      </p>
                      <span
                        className={cn(
                          "mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          project.active
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-600 border border-border-light",
                        )}
                      >
                        {project.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                {...fadeUp(0.22)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Team
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Recent Activity
                    </h3>
                  </div>
                  <TrendingUp className="h-5 w-5 text-brand" />
                </div>

                <div className="space-y-4">
                  {teamUpdates.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-start gap-3 rounded-2xl border border-border-light bg-surface-card p-3 transition hover:bg-white"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warm text-sm font-semibold text-white">
                        {item.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {item.name}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {item.time}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="custom" size="none" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand transition-colors hover:text-brand-darker">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </motion.div>

              <motion.div
                {...fadeUp(0.28)}
                className="overflow-hidden rounded-[24px] border border-white/65 bg-white/88 p-6 shadow-[0_4px_24px_rgba(90,55,20,0.09)] backdrop-blur-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      Activity
                    </p>
                    <h3 className="mt-0.5 font-display text-lg font-bold text-slate-900">
                      Daily Status
                    </h3>
                  </div>
                  <Activity className="h-5 w-5 text-brand" />
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-border-light bg-surface-card p-3">
                    3 project updates posted today
                  </div>
                  <div className="rounded-2xl border border-border-light bg-surface-card p-3">
                    2 new approvals waiting for review
                  </div>
                  <div className="rounded-2xl border border-border-light bg-surface-card p-3">
                    1 meeting scheduled this afternoon
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UltraDashboard;
