import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const ResponsibilityCard = ({ title, icon: Icon, count, tasks, colorClass, bgClass, linkTo }) => {
  return (
    <div className={`flex flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md`}>
      <div className="flex items-center justify-between border-b border-white/40 p-5">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgClass} ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h3>
            <p className={`text-2xl font-black ${colorClass}`}>{count}</p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-5">
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center gap-3 rounded-xl bg-white/50 p-3 text-sm">
                <div className={`h-2 w-2 flex-shrink-0 rounded-full ${bgClass.replace('bg-', 'bg-').replace('100', '500')}`} />
                <p className="line-clamp-1 font-semibold text-slate-700">{task.title}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-medium text-slate-400">
            No items right now
          </div>
        )}
      </div>

      {linkTo && (
        <div className="border-t border-white/40 bg-white/30 px-5 py-3">
          <Link to={linkTo} className={`flex items-center justify-between text-xs font-bold ${colorClass} hover:opacity-80`}>
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default ResponsibilityCard;
