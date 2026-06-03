import { motion } from 'framer-motion';
import { Activity, CalendarClock, History, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTaskStore } from '@services/taskStore';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { formatRelativeTime } from '@utils/formatters';

const eventDate = (event) => event.date || event.updatedAt || event.createdAt;

const AuditTrail = () => {
  const { tasks } = useTaskStore();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');

  const events = useMemo(() => {
    return tasks.flatMap((task) => {
      const timeline = (task.activityTimeline || []).map((event, index) => ({
        id: `${task.id || task._id}-activity-${index}`,
        type: 'activity',
        taskTitle: task.title,
        actor: event.user || 'System',
        action: event.action || 'Task Activity',
        details: event.details || '',
        date: eventDate(event),
      }));

      const history = (task.statusHistory || []).map((event, index) => ({
        id: `${task.id || task._id}-status-${index}`,
        type: 'status',
        taskTitle: task.title,
        actor: event.updatedBy?.name || 'System',
        action: `Status changed to ${event.status || 'Unknown'}`,
        details: `Task status history entry for ${task.title}`,
        date: eventDate(event),
      }));

      return [...timeline, ...history];
    }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [tasks]);

  const filteredEvents = events.filter((event) => {
    const haystack = `${event.taskTitle} ${event.actor} ${event.action} ${event.details}`.toLowerCase();
    const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
    const matchesType = type === 'all' || event.type === type;
    return matchesQuery && matchesType;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <div>
        <h1 className="font-display text-3xl font-bold text-slate-900">Audit Trail</h1>
        <p className="mt-1 text-sm text-slate-500">Review task creation, assignment, progress, review, and status history.</p>
      </div>

      <div className="grid gap-3 rounded-[24px] border border-[#ead8cb] bg-white/72 p-4 shadow-sm md:grid-cols-[minmax(0,1fr)_220px]">
        <Input icon={Search} placeholder="Search actor, task, or action..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={[
            { value: 'all', label: 'All Events' },
            { value: 'activity', label: 'Activity Only' },
            { value: 'status', label: 'Status History' },
          ]}
        />
      </div>

      <section className="overflow-hidden rounded-[26px] border border-[#ead8cb] bg-white/85 shadow-sm">
        {filteredEvents.length ? (
          <div className="divide-y divide-[#f4ddd0]">
            {filteredEvents.map((event) => (
              <article key={event.id} className="grid gap-4 p-5 transition hover:bg-[#fffaf6] md:grid-cols-[44px_minmax(0,1fr)_180px]">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e8f6f2] text-[#13856f]">
                  {event.type === 'status' ? <History className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-800">{event.action}</h2>
                    <span className="rounded-full border border-[#ead8cb] bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {event.type}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-[#13856f]">{event.taskTitle}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{event.details || 'No additional details captured.'}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-400">Actor: {event.actor}</p>
                </div>
                <div className="flex items-start gap-2 text-xs font-semibold text-slate-400 md:justify-end">
                  <CalendarClock className="h-4 w-4" />
                  {event.date ? formatRelativeTime(event.date) : 'No timestamp'}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <p className="text-sm font-bold text-slate-700">No audit events found</p>
            <p className="mt-1 text-xs text-slate-400">Task activity will appear here as work moves through the system.</p>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default AuditTrail;
