import { motion } from 'framer-motion';
import { CalendarDays, AlertTriangle, CheckCircle2, Clock3, Flag } from 'lucide-react';
import { useTaskStore } from '@services/taskStore';
import Badge from '@components/ui/Badge';
import { formatDate, isTaskOverdue, parseTaskDate } from '@utils/formatters';

const statusTone = (status) => {
  if (['Completed', 'completed', 'Approved'].includes(status)) return 'success';
  if (['In Progress', 'Started', 'Under Review', 'in_progress', 'in_review'].includes(status)) return 'warning';
  return 'default';
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const getBucket = (task) => {
  const due = parseTaskDate(task.dueDate);
  if (!due) return 'unscheduled';

  const today = startOfToday();
  const normalized = new Date(due);
  normalized.setHours(0, 0, 0, 0);
  const diffDays = Math.round((normalized.getTime() - today.getTime()) / 86400000);

  if (diffDays < 0 && isTaskOverdue(task)) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays <= 7) return 'week';
  return 'upcoming';
};

const buckets = [
  { id: 'overdue', title: 'Overdue', icon: AlertTriangle, tone: 'text-rose-600' },
  { id: 'today', title: 'Today', icon: Clock3, tone: 'text-[#b5722a]' },
  { id: 'week', title: 'Next 7 Days', icon: CalendarDays, tone: 'text-[#13856f]' },
  { id: 'upcoming', title: 'Upcoming', icon: CalendarDays, tone: 'text-slate-600' },
  { id: 'unscheduled', title: 'Unscheduled', icon: Flag, tone: 'text-slate-500' },
];

const CalendarView = () => {
  const { tasks } = useTaskStore();
  const grouped = buckets.reduce((acc, bucket) => {
    acc[bucket.id] = [];
    return acc;
  }, {});

  tasks.forEach((task) => {
    grouped[getBucket(task)].push(task);
  });

  Object.values(grouped).forEach((items) => {
    items.sort((a, b) => {
      const aDate = parseTaskDate(a.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      const bDate = parseTaskDate(b.dueDate)?.getTime() || Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    });
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Task Calendar</h1>
        <p className="mt-1 text-sm text-slate-500">Plan work by due date, urgency, and delivery window.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-5">
        {buckets.map((bucket) => {
          const Icon = bucket.icon;
          const items = grouped[bucket.id] || [];

          return (
            <section key={bucket.id} className="min-h-[360px] rounded-[24px] border border-[#ead8cb] bg-white/78 p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${bucket.tone}`} />
                  <h2 className="text-sm font-bold text-slate-800">{bucket.title}</h2>
                </div>
                <span className="rounded-full bg-[#fffaf6] px-2.5 py-1 text-xs font-bold text-slate-500">
                  {items.length}
                </span>
              </div>

              <div className="space-y-3">
                {items.length ? items.map((task) => (
                  <article key={task.id || task._id} className="rounded-2xl border border-[#f4ddd0] bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">{task.title}</h3>
                      {['Completed', 'completed', 'Approved'].includes(task.status) && (
                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#13856f]" />
                      )}
                    </div>
                    <p className="line-clamp-2 text-xs leading-5 text-slate-500">
                      {task.description || 'No description provided.'}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant={statusTone(task.status)}>{String(task.status || 'Assigned').replace('_', ' ')}</Badge>
                      <span className="rounded-full border border-[#ead8cb] bg-[#fffaf6] px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-600">
                        {task.priority || 'medium'}
                      </span>
                    </div>
                    <p className={`mt-3 text-xs font-semibold ${isTaskOverdue(task) ? 'text-rose-600' : 'text-slate-500'}`}>
                      {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                    </p>
                  </article>
                )) : (
                  <div className="rounded-2xl border border-dashed border-[#e6d6ca] bg-[#fffaf6]/70 px-4 py-8 text-center">
                    <p className="text-xs font-semibold text-slate-400">No tasks in this window.</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
};

export default CalendarView;
