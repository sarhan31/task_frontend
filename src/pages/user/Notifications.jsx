import { useTaskStore } from '@services/taskStore';
import { Bell, Check, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@components/ui/Button';

const Notifications = () => {
  const { notifications, markAllNotificationsRead, clearNotification } = useTaskStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Notifications Log</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track recent sprint changes, task updates, and alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <Button
            onClick={markAllNotificationsRead}
            className="bg-[#13856f] text-white hover:bg-[#0f7260] self-start"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-[#ead8cb] rounded-[28px] shadow-soft overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-[#f4ddd0]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-4 p-5 items-start transition-colors ${
                  !n.read ? 'bg-[#fffaf6]' : 'bg-white'
                }`}
              >
                <div
                  className={`mt-1 flex h-8 w-8 items-center justify-center rounded-xl ${
                    !n.read ? 'bg-[#e8f6f2] text-[#13856f]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        !n.read ? 'bg-[#13856f]' : 'bg-slate-200'
                      }`}
                    />
                    <p className={`text-sm ${!n.read ? 'font-bold text-slate-800' : 'text-slate-600'}`}>
                      {n.text}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {n.time}
                  </p>
                </div>

                <button
                  onClick={() => clearNotification(n.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                  title="Clear Notification"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-4 space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 border border-[#e6d6ca]">
              <Bell className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-slate-800">All caught up!</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              You have no new alerts or notifications at this time.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;
