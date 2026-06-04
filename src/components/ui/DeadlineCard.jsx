import { Calendar, AlertCircle, Clock } from "lucide-react";
import Badge from "@components/ui/Badge";
import { TASK_PRIORITY_COLORS } from "@utils/constants";
import { isTaskOverdue, formatDate } from "@utils/formatters";

const DeadlineCard = ({ task }) => {
  const overdue = isTaskOverdue(task);

  return (
    <div className={`group flex items-center justify-between rounded-xl border p-4 transition-all ${overdue ? 'border-red-200 bg-red-50/50 hover:bg-red-50' : 'border-slate-100 bg-white hover:border-[#13856f]/30 hover:shadow-sm'}`}>
      <div className="flex items-start gap-4">
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${overdue ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 group-hover:bg-[#e8f6f2] group-hover:text-[#13856f]'}`}>
          {overdue ? <AlertCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        </div>
        <div>
          <h4 className={`text-sm font-bold line-clamp-1 ${overdue ? 'text-red-900' : 'text-slate-800'}`}>
            {task.title}
          </h4>
          <div className="mt-1 flex items-center gap-3 text-xs font-semibold">
            <span className={overdue ? 'text-red-600' : 'text-slate-500'}>
              Due: {formatDate(task.dueDate)}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
            <Badge className={`px-1.5 py-0 text-[10px] ${TASK_PRIORITY_COLORS[task.priority]}`}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </div>
      <Badge className={overdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}>
        {task.status.replace('_', ' ')}
      </Badge>
    </div>
  );
};

export default DeadlineCard;
