import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlarmClock,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Cpu,
  FileCheck2,
  Gauge,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users2,
  Workflow,
  Zap,
} from 'lucide-react';
import { cn } from '@utils/cn';
import { toast } from '@components/ui/Toaster';
import { useAuth } from '@hooks/useAuth';
import BrandLogo from '@components/ui/BrandLogo';
import Button from '@components/ui/Button';

const navItems = [
  { label: 'Platform', href: '#platform' },
  { label: 'Templates', href: '#templates' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

const workflowGroups = [
  { name: 'Triggers', count: '6 nodes', tone: 'bg-emerald-100 text-emerald-700' },
  { name: 'Logic', count: '8 nodes', tone: 'bg-violet-100 text-violet-700' },
  { name: 'Actions', count: '12 nodes', tone: 'bg-amber-100 text-amber-700' },
  { name: 'Approvals', count: '4 nodes', tone: 'bg-rose-100 text-rose-700' },
  { name: 'AI', count: '5 nodes', tone: 'bg-sky-100 text-sky-700' },
];

const featurePills = ['30+ automation nodes', 'No-code setup', 'Real-time approvals'];

const heroStats = [
  { value: '42%', label: 'Faster handoffs' },
  { value: '18h', label: 'Saved weekly' },
  { value: '99.9%', label: 'Workflow uptime' },
];

const trustedTeams = ['Ops Desk', 'SprintLab', 'Northstar HR', 'LaunchWorks'];

const proofPoints = [
  { icon: Gauge, label: 'Live workload balancing' },
  { icon: LockKeyhole, label: 'Role-based approvals' },
  { icon: Cpu, label: 'AI-assisted summaries' },
];

const footerLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
  { label: 'Support', href: '#' },
];

const workflowTemplates = [
  {
    icon: FileCheck2,
    title: 'Task Assignment Flow',
    description: 'Capture requests, assign owners, and route approvals in minutes.',
    tag: 'Operations',
  },
  {
    icon: AlarmClock,
    title: 'Deadline Protection',
    description: 'Escalate overdue work automatically before a task slips.',
    tag: 'Escalation',
  },
  {
    icon: BrainCircuit,
    title: 'AI Task Summaries',
    description: 'Generate updates, summaries, and action points without extra effort.',
    tag: 'AI Assist',
  },
];

const platformFeatures = [
  {
    icon: Play,
    title: 'Event-Based Actions',
    description: 'Trigger automations when tasks are created, reassigned, approved, or completed.',
  },
  {
    icon: Clock3,
    title: 'Recurring Schedules',
    description: 'Run daily standups, weekly reminders, and monthly reporting on autopilot.',
  },
  {
    icon: Users2,
    title: 'Team Routing Logic',
    description: 'Direct work to the right owner based on status, priority, department, or workload.',
  },
  {
    icon: ShieldCheck,
    title: 'Approval and Audit Trail',
    description: 'Track every decision, comment, and handoff with a clean activity history.',
  },
];

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Free',
    detail: 'For small teams validating a workflow setup.',
  },
  {
    name: 'Growth',
    price: '$19',
    detail: 'Per user/month for automation, boards, analytics, and approvals.',
  },
  {
    name: 'Scale',
    price: 'Custom',
    detail: 'Advanced controls, AI usage, and tailored implementation support.',
  },
];

const workflowNodes = [
  {
    title: 'Request Intake',
    subtitle: 'Trigger',
    className: 'left-[8%] top-[45%] border-emerald-200 bg-emerald-50',
    iconWrap: 'bg-emerald-600',
  },
  {
    title: 'Budget Check',
    subtitle: 'Logic',
    className: 'left-[34%] top-[45%] border-violet-200 bg-violet-50',
    iconWrap: 'bg-violet-600',
  },
  {
    title: 'Finance Approval',
    subtitle: 'Approval',
    className: 'left-[54%] top-[17%] border-orange-300 bg-white',
    iconWrap: 'bg-orange-500',
  },
  {
    title: 'Auto Approve',
    subtitle: 'Logic',
    className: 'left-[54%] top-[70%] border-sky-200 bg-sky-50',
    iconWrap: 'bg-sky-500',
  },
  {
    title: 'Notify Team',
    subtitle: 'Action',
    className: 'left-[76%] top-[45%] border-amber-200 bg-amber-50',
    iconWrap: 'bg-amber-500',
  },
];

const connectionLines = [
  'left-[22%] top-[52%] h-[2px] w-[15%]',
  'left-[49%] top-[33%] h-[20%] w-[2px]',
  'left-[49%] top-[52%] h-[2px] w-[11%]',
  'left-[49%] top-[53%] h-[22%] w-[2px]',
  'left-[62%] top-[52%] h-[2px] w-[14%]',
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const scaleUp = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const [isRunningDemo, setIsRunningDemo] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [nodeLibraryExpanded, setNodeLibraryExpanded] = useState(false);
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/dashboard';
  const currentYear = new Date().getFullYear();

  const visibleWorkflowNodes = useMemo(() => {
    if (!nodeLibraryExpanded) return workflowNodes;

    return [
      ...workflowNodes,
      {
        title: 'AI Summary',
        subtitle: 'Action',
        className: 'left-[76%] top-[18%] border-emerald-200 bg-emerald-50',
        iconWrap: 'bg-emerald-500',
      },
    ];
  }, [nodeLibraryExpanded]);

  const visibleConnectionLines = useMemo(() => {
    if (!nodeLibraryExpanded) return connectionLines;
    return [...connectionLines, 'left-[63%] top-[26%] h-[2px] w-[13%]'];
  }, [nodeLibraryExpanded]);

  const handleTestRun = () => {
    if (isRunningDemo) return;

    setIsRunningDemo(true);
    toast.info('Running a sample approval workflow...');

    window.setTimeout(() => {
      setIsRunningDemo(false);
      toast.success('Demo run finished. All workflow steps completed successfully.');
    }, 1600);
  };

  const handleDeploy = () => {
    if (isDeploying) return;

    setIsDeploying(true);
    toast.success('Workflow deployed. Future task events will now trigger this automation.');

    window.setTimeout(() => {
      setIsDeploying(false);
    }, 1400);
  };

  const handleNodeToggle = () => {
    const nextValue = !nodeLibraryExpanded;
    setNodeLibraryExpanded(nextValue);
    toast.info(
      nextValue
        ? 'AI Summary node added to the canvas preview.'
        : 'Node preview reset to the default workflow layout.'
    );
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#f5f7f2] text-slate-900 flex flex-col justify-between">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,108,87,0.12)_0%,_rgba(255,255,255,0)_36%,_rgba(236,185,111,0.18)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[linear-gradient(180deg,_#ffffff_0%,_rgba(255,255,255,0.62)_54%,_rgba(255,255,255,0)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,_transparent_1px),linear-gradient(90deg,_rgba(15,23,42,0.045)_1px,_transparent_1px)] bg-[size:72px_72px] opacity-50" />
      </div>

      <div className="relative z-10 mx-auto flex flex-1 w-full max-w-[1320px] flex-col px-4 pb-8 pt-3 sm:px-6 lg:px-8">
        <div className="sticky top-3 z-40 mb-3 flex justify-center sm:top-4">
          <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full rounded-[22px] border border-white/80 bg-white/92 px-3 py-2.5 shadow-[0_12px_36px_rgba(15,23,42,0.06)] backdrop-blur-xl sm:rounded-[28px] sm:px-5 sm:py-3"
          >
            <div className="flex items-center justify-between gap-2 lg:gap-4 lg:flex-nowrap">
              <Link to="/" className="flex min-w-0 items-center">
                <BrandLogo size="md" />
              </Link>

              <nav className="hidden items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-2 lg:flex">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-xs font-bold text-slate-600 hover:text-[#0f6c57] transition px-3.5 py-1.5 rounded-xl hover:bg-white/80"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              <div className="flex items-center justify-end gap-2 sm:gap-3">
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="hidden rounded-2xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#f6efe8] sm:inline-flex"
                >
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center rounded-2xl bg-[#0f6c57] px-3 py-2 text-xs font-semibold text-white shadow-[0_8px_20px_rgba(15,108,87,0.2)] transition hover:bg-[#0c5d4b] sm:px-5 sm:py-2.5 sm:text-sm"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Start Free'}
                </Link>
              </div>
            </div>
          </motion.header>
        </div>

        <main className="flex-1 px-2 py-1">
          <section className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(500px,1.08fr)] items-center">
            <motion.section
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="flex min-w-0 max-w-2xl flex-col justify-center lg:py-2"
            >
              <motion.div variants={fadeUp} className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#b7d8ce] bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0f6c57] shadow-[0_8px_20px_rgba(15,108,87,0.06)]">
                <Sparkles className="h-3.5 w-3.5" />
                Automation Engine
              </motion.div>

              <motion.h1 variants={fadeUp} className="mt-3 font-display text-[1.85rem] font-black leading-[1.05] text-[#07111f] sm:text-[2.8rem] sm:leading-[1.02] xl:text-[3.55rem]">
                Run every project with a
                <br />
                <span className="bg-[linear-gradient(90deg,_#0f6c57,_#158f78,_#b77728)] bg-clip-text text-transparent">
                  world-class workflow.
                </span>
              </motion.h1>

              <motion.p variants={fadeUp} className="mt-3 max-w-lg text-xs leading-relaxed text-slate-600 sm:text-sm lg:text-base lg:leading-normal">
                DoNow brings task assignment, approvals, AI summaries, deadline protection, and team routing into one sharp operating system for work.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                <Link
                  to={isAuthenticated ? dashboardPath : '/signup'}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f6c57] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,108,87,0.18)] transition hover:bg-[#0c5d4b] sm:px-6 sm:py-3.5 sm:text-base"
                >
                  {isAuthenticated ? 'Open Workspace' : 'Explore Workflows'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to={isAuthenticated ? dashboardPath : '/login'}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#d9e8e1] bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0f6c57]/30 hover:text-[#0f6c57] sm:px-6 sm:py-3.5 sm:text-base"
                >
                  <Play className="h-4 w-4" />
                  {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Link>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                {featurePills.map((item) => (
                  <div key={item} className="flex items-center gap-1.5 text-xs font-medium text-slate-600 sm:text-sm">
                    <Check className="h-3.5 w-3.5 text-[#0f6c57]" />
                    <span>{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="mt-4 grid max-w-lg grid-cols-3 overflow-hidden rounded-[20px] border border-white/80 bg-white/80 shadow-[0_12px_30px_rgba(15,23,42,0.05)] backdrop-blur">
                {heroStats.map((stat) => (
                  <div key={stat.label} className="border-r border-slate-200/80 px-3 py-2.5 last:border-r-0 sm:py-3 text-center sm:text-left">
                    <p className="font-display text-lg font-black text-slate-950 sm:text-2xl">{stat.value}</p>
                    <p className="mt-0.5 text-[10px] font-bold uppercase text-slate-500 tracking-wider leading-none">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.section>

            <motion.section
              variants={scaleUp}
              initial="hidden"
              animate="show"
              className="relative flex min-w-0 items-center justify-center lg:py-2"
            >
              <div className="relative w-full min-w-0 overflow-hidden rounded-[24px] border border-white/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.1)] h-[460px] lg:h-[490px] flex flex-col justify-between">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5 bg-white">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                        <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#0f6c57] text-white">
                          <Workflow className="h-4 w-4" />
                        </span>
                        <span className="truncate">Workflow Builder</span>
                        <span className="text-slate-300 font-normal">/</span>
                        <span className="truncate font-medium text-slate-500 text-xs sm:text-sm">Task Approval Pipeline</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#e8f6f2] px-2 py-1 text-xs font-semibold text-[#0f6c57]">
                        <span className="h-2 w-2 rounded-full bg-[#22b573]" />
                        Saved
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTestRun}
                        className="rounded-xl border-[#e6ddd3] text-xs text-slate-600 hover:border-[#0f6c57]/30 hover:text-[#0f6c57]"
                      >
                        {isRunningDemo ? 'Running...' : 'Test Run'}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleDeploy}
                        className="rounded-xl bg-[#0f6c57] text-xs text-white hover:bg-[#0c5d4b]"
                      >
                        {isDeploying ? 'Deploying...' : 'Deploy'}
                      </Button>
                    </div>
                  </div>

                  {/* Proof points */}
                  <div className="grid gap-2 border-b border-slate-200 bg-[#f8fbf8] px-5 py-2.5 grid-cols-3">
                    {proofPoints.map((point) => {
                      const Icon = point.icon;
                      return (
                        <div key={point.label} className="flex items-center gap-2 rounded-xl border border-white bg-white px-2.5 py-1.5 shadow-sm">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#edf5f1] text-[#0f6c57]">
                            <Icon className="h-3.5 w-3.5" />
                          </span>
                          <span className="text-[10px] font-bold text-slate-700 truncate">{point.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Canvas and Sidebar */}
                  <div className="flex-1 grid grid-cols-[140px_minmax(0,1fr)] overflow-hidden">
                    {/* Sidebar */}
                    <aside className="border-r border-slate-200 bg-[#fbf8f2] p-3 flex flex-col justify-between overflow-y-auto">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3">
                          Node Library
                        </p>
                        <div className="space-y-2">
                          {workflowGroups.map((group, index) => (
                            <div
                              key={group.name}
                              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm transition hover:-translate-y-0.5 hover:border-[#0f6c57]/30"
                            >
                              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-xl', group.tone)}>
                                {index === 0 && <Play className="h-3.5 w-3.5" />}
                                {index === 1 && <Workflow className="h-3.5 w-3.5" />}
                                {index === 2 && <Layers3 className="h-3.5 w-3.5" />}
                                {index === 3 && <CheckCircle2 className="h-3.5 w-3.5" />}
                                {index === 4 && <Bot className="h-3.5 w-3.5" />}
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-slate-800 truncate leading-none">{group.name}</p>
                                <p className="text-[9px] text-slate-400 mt-0.5 leading-none">{group.count}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleNodeToggle}
                        className="mt-3 w-full rounded-xl bg-[#eef4ef] text-xs text-[#0f6c57] hover:bg-[#e2f1eb]"
                      >
                        {nodeLibraryExpanded ? 'Reset Canvas' : '+ Add Node'}
                      </Button>
                    </aside>

                    {/* Canvas */}
                    <div className="relative overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f7fbf9_100%)] p-4">
                      {/* SLA Box */}
                      <div className="absolute right-3 top-3 z-10 rounded-xl border border-[#d9ebe4] bg-white/95 px-3 py-1.5 shadow-sm">
                        <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-700">
                          <Clock3 className="h-3 w-3 text-[#0f6c57]" />
                          SLA
                        </div>
                        <p className="text-sm font-bold text-slate-900 leading-none mt-0.5">4h 12m</p>
                      </div>

                      {/* Active automations */}
                      <div className="absolute bottom-3 left-3 z-10 rounded-xl border border-[#f0d8ba] bg-[#fff7ec] px-3 py-1.5 shadow-sm">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#9a5b12] leading-none">
                          <Zap className="h-3 w-3 shrink-0" />
                          7 active
                        </div>
                      </div>

                      {/* Connection Lines */}
                      {visibleConnectionLines.map((line) => (
                        <div key={line} className={cn('absolute rounded-full bg-[#dbe7f7]', line)} />
                      ))}

                      {/* Nodes */}
                      {visibleWorkflowNodes.map((node) => (
                        <div
                          key={node.title}
                          className={cn(
                            'absolute w-[94px] rounded-xl border px-2 py-2.5 shadow-sm transition hover:shadow-md bg-white',
                            node.className
                          )}
                        >
                          <div className={cn('mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-white', node.iconWrap)}>
                            {node.subtitle === 'Trigger' && <Play className="h-3.5 w-3.5" />}
                            {node.subtitle === 'Logic' && <Workflow className="h-3.5 w-3.5" />}
                            {node.subtitle === 'Approval' && <CheckCircle2 className="h-3.5 w-3.5" />}
                            {node.subtitle === 'Action' && <Layers3 className="h-3.5 w-3.5" />}
                          </div>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none">
                            {node.subtitle}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold leading-tight text-slate-800 truncate">
                            {node.title}
                          </p>
                        </div>
                      ))}

                      <div className="absolute left-[50%] top-[42%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-1.5 py-0.5 text-[8px] font-bold text-slate-500 shadow-sm leading-none">
                        {'>'} 10L
                      </div>
                      <div className="absolute left-[50%] top-[64%] flex -translate-x-1/2 items-center justify-center rounded-full border border-[#dbe7f7] bg-white px-1.5 py-0.5 text-[8px] font-bold text-slate-500 shadow-sm leading-none">
                        {'<'}= 10L
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </section>

          {/* Trusted Teams Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 rounded-[30px] border border-white/80 bg-white/82 px-6 py-5 shadow-[0_18px_46px_rgba(15,23,42,0.07)] backdrop-blur"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-slate-500">
                Trusted by teams that move fast
              </p>
              <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 flex-1 max-w-3xl">
                {trustedTeams.map((team) => (
                  <div
                    key={team}
                    className="flex h-12 items-center justify-center rounded-xl border border-white bg-white/60 px-5 text-sm font-black text-slate-700 shadow-sm backdrop-blur-sm transition duration-300 hover:scale-[1.03] hover:shadow-md hover:bg-white"
                  >
                    {team}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Platform Capabilities Section */}
          <motion.section
            id="platform"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-16 rounded-[36px] border border-white/80 bg-white px-6 py-10 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:px-8 lg:px-12 lg:py-14"
          >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#0f6c57]">
                Built For Task Management
              </p>
              <h2 className="mt-5 font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
                Assign, automate, approve, and follow through.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600 sm:text-xl">
                Everything in DoNow is designed around real team execution, from intake to approval to delivery.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="flex min-h-[280px] flex-col rounded-[28px] border border-slate-200 bg-[#fbfdfb] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-1.5 hover:border-[#0f6c57]/35 hover:shadow-[0_20px_44px_rgba(15,108,87,0.12)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f6c57] text-white shadow-[0_8px_16px_rgba(15,108,87,0.2)]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-2xl font-bold text-slate-900">{feature.title}</h3>
                    <p className="mt-4 text-base leading-8 text-slate-600">{feature.description}</p>
                    <div className="mt-auto pt-6">
                      <span className="inline-flex rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">
                        Live workflow capability
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Templates Section */}
          <motion.section
            id="templates"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8 lg:grid lg:grid-cols-[minmax(340px,0.88fr)_minmax(0,1.12fr)] lg:gap-10"
          >
            <div className="flex h-full flex-col rounded-[30px] border border-[#deece5] bg-[linear-gradient(180deg,_#f7fbf9_0%,_#eef7f3_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#edf5f1] px-4 py-2 text-sm font-semibold text-[#0f6c57]">
                <LayoutDashboard className="h-4 w-4" />
                Ready-to-launch templates
              </div>
              <h2 className="mt-8 max-w-md font-display text-[3.15rem] font-bold leading-[1.02] tracking-[-0.03em] text-slate-900">
                Start from flows your team will actually use.
              </h2>
              <p className="mt-6 max-w-lg text-[1.15rem] leading-9 text-slate-600">
                Instead of generic automation blocks, DoNow helps teams launch workflows for assignments, escalations, status changes, and reporting.
              </p>
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-[24px] border border-[#dcebe4] bg-white p-5 shadow-[0_10px_24px_rgba(15,108,87,0.04)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#0f6c57]">Template speed</p>
                  <p className="mt-3 text-[2.2rem] font-bold leading-none text-slate-900">5 min</p>
                  <p className="mt-3 text-sm leading-7 text-slate-500">Average time to launch a workflow from a starter layout.</p>
                </div>
                <div className="rounded-[24px] border border-[#ece1d7] bg-white p-5 shadow-[0_10px_24px_rgba(90,55,20,0.04)]">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Best for</p>
                  <p className="mt-3 text-xl font-bold leading-8 text-slate-900">Ops, managers, and fast-moving teams</p>
                </div>
              </div>
              <Link
                to="/signup"
                className="mt-10 inline-flex w-fit items-center gap-2 rounded-[20px] bg-[#0f6c57] px-7 py-4 text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,108,87,0.18)] transition hover:bg-[#0c5d4b]"
              >
                Start with a template
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-5 lg:mt-0">
              {workflowTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.title}
                    className="group grid min-w-0 gap-5 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,_#ffffff_0%,_#fff8ef_100%)] p-6 shadow-[0_14px_32px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-[#0f6c57]/30 hover:shadow-[0_20px_44px_rgba(15,23,42,0.10)] md:grid-cols-[88px_minmax(0,1fr)_auto] md:items-start"
                  >
                    <div className="flex items-start justify-between gap-4 md:block">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e8f6f2] text-[#0f6c57] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[#d8e9e2] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0f6c57] md:hidden">
                          Live
                        </span>
                        <span className="rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57] md:hidden">
                          {template.tag}
                        </span>
                      </div>
                      <h3 className="mt-3 text-[1.8rem] font-bold leading-[1.1] tracking-[-0.02em] text-slate-900 md:mt-1">
                        {template.title}
                      </h3>
                      <p className="mt-4 max-w-2xl text-[1.02rem] leading-8 text-slate-500">
                        {template.description}
                      </p>
                    </div>
                    <div className="hidden items-start justify-end gap-3 md:flex">
                      <span className="rounded-full border border-[#d8e9e2] bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#0f6c57]">
                        Live
                      </span>
                      <span className="inline-flex rounded-full bg-[#edf5f1] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">
                        {template.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* Pricing Section */}
          <motion.section
            id="pricing"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 rounded-[34px] border border-white/80 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-8"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <div className="max-w-3xl">
                <p className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-[#0f6c57]">
                  <BarChart3 className="h-4 w-4" />
                  Pricing Options
                </p>
                <h2 className="mt-4 font-display text-4xl font-bold text-slate-900">
                  Flexible for teams growing from simple tasks to automated operations.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-500">
                  Clear tiers, no visual clutter, and enough flexibility to support teams from first launch to scaled delivery.
                </p>
              </div>
              <div className="rounded-[28px] border border-[#dcebe4] bg-[#f3faf7] p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0f6c57]">Get started</p>
                <p className="mt-3 text-lg font-semibold leading-8 text-slate-800">
                  Launch your workspace and shape the plan around your team size.
                </p>
                <Link
                  to="/signup"
                  className="mt-6 inline-flex items-center gap-2 rounded-[18px] bg-[#0f6c57] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#0c5d4b]"
                >
                  Create your workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3 items-stretch">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={cn(
                    "flex min-h-[280px] flex-col rounded-[26px] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(15,23,42,0.08)]",
                    tier.name === 'Growth'
                      ? "border-2 border-[#0f6c57] bg-[#f2f8f6] relative overflow-hidden shadow-[0_24px_50px_rgba(15,108,87,0.08)] scale-[1.02]"
                      : "border border-slate-200 bg-[#fffaf6]"
                  )}
                >
                  {tier.name === 'Growth' && (
                    <span className="absolute right-4 top-4 bg-[#0f6c57] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Most Popular
                    </span>
                  )}
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">{tier.name}</p>
                  <p className="mt-4 font-display text-4xl font-bold text-slate-900">{tier.price}</p>
                  <p className="mt-4 text-base leading-relaxed text-slate-500 mb-8">{tier.detail}</p>
                  <Link
                    to="/signup"
                    className={cn(
                      "mt-auto w-full text-center rounded-2xl py-3 text-sm font-bold transition duration-200 block",
                      tier.name === 'Growth'
                        ? "bg-[#0f6c57] text-white hover:bg-[#0c5d4b] shadow-[0_8px_16px_rgba(15,108,87,0.15)]"
                        : "bg-white border border-[#e6ddd3] text-slate-700 hover:border-[#0f6c57] hover:text-[#0f6c57]"
                    )}
                  >
                    Select {tier.name}
                  </Link>
                </div>
              ))}
            </div>
          </motion.section>

          {/* About Section */}
          <motion.section
            id="about"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55 }}
            className="mt-20 overflow-hidden rounded-[34px] border border-white/80 bg-white px-5 py-7 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.09)] sm:px-8 sm:py-10"
          >
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#0f6c57]">
                  About DoNow
                </p>
                <h2 className="mt-4 font-display text-4xl font-bold leading-tight text-slate-900">
                  A cleaner way to run work across teams, not just track tasks.
                </h2>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                  We combine task tracking, approvals, automation, and AI assistance so your team can move faster with fewer manual follow-ups.
                </p>
                <div className="mt-8 rounded-[24px] border border-[#e7ddd2] bg-[#fffaf6] p-5 shadow-sm">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Why teams choose it</p>
                  <p className="mt-3 text-xl font-semibold leading-9 text-slate-800">
                    One place to plan work, move approvals, automate follow-ups, and keep everyone aligned.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm transition hover:scale-[1.02]">
                  <p className="text-4xl font-bold text-slate-900">30+</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Workflow nodes</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm transition hover:scale-[1.02]">
                  <p className="text-4xl font-bold text-slate-900">4</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Core execution layers</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm transition hover:scale-[1.02]">
                  <p className="text-4xl font-bold text-slate-900">AI</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Built into workflows</p>
                </div>
                <div className="rounded-[24px] border border-[#eadfd4] bg-[#fffaf6] p-6 shadow-sm transition hover:scale-[1.02]">
                  <p className="text-4xl font-bold text-slate-900">24/7</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.16em] text-slate-500">Automation coverage</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Call to Action Rocket Banner */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.55 }}
            className="my-10 overflow-hidden rounded-[34px] bg-gradient-to-br from-[#071f1a] via-[#092a23] to-[#0f6c57] px-7 py-8 text-white shadow-[0_28px_70px_rgba(7,31,26,0.26)] sm:px-10 lg:px-12"
          >
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-bold text-[#bce9dc]">
                  <Rocket className="h-4 w-4" />
                  Ready when your team is
                </div>
                <h2 className="mt-5 max-w-3xl font-display text-3xl font-black leading-tight sm:text-5xl">
                  Launch a cleaner task workflow before the next status meeting.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/70">
                  Start with templates, invite your team, and automate the recurring handoffs that slow everyone down.
                </p>
              </div>
              <Link
                to={isAuthenticated ? dashboardPath : '/signup'}
                className="inline-flex items-center justify-center gap-3 rounded-[22px] bg-white px-7 py-4 text-base font-black text-[#071f1a] shadow-[0_18px_36px_rgba(0,0,0,0.18)] transition hover:bg-[#e8f6f2] hover:scale-[1.03] duration-200"
              >
                {isAuthenticated ? 'Open Workspace' : 'Start Free'}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="px-2 py-8">
          <div className="flex flex-col gap-6 rounded-[28px] border border-slate-200 bg-white px-6 py-6 shadow-[0_14px_34px_rgba(15,23,42,0.06)] md:flex-row md:items-center md:justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="grid h-10 w-10 grid-cols-2 gap-1 rounded-2xl bg-[#0f6c57] p-2 text-white shadow-[0_8px_18px_rgba(15,108,87,0.22)]">
                <span className="rounded-[5px] bg-white/95" />
                <span className="rounded-[5px] bg-white/75" />
                <span className="rounded-[5px] bg-white/75" />
                <span className="rounded-[5px] bg-white/95" />
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight text-slate-950">
                  DoNow
                </p>
                <p className="text-sm text-slate-500">
                  Automate the work behind the work.
                </p>
              </div>
            </Link>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-600">
                {navItems.map((item) => (
                  <a key={item.label} href={item.href} className="transition hover:text-[#0f6c57]">
                    {item.label}
                  </a>
                ))}
                {footerLinks.map((item) => (
                  <a key={item.label} href={item.href} className="transition hover:text-[#0f6c57]">
                    {item.label}
                  </a>
                ))}
              </nav>
              <p className="text-sm font-medium text-slate-500">
                © {currentYear} DoNow. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
