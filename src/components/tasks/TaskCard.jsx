import { Calendar, MoreVertical, AlertTriangle } from 'lucide-react';
import Badge from '@components/ui/Badge';
import Avatar from '@components/ui/Avatar';
import Dropdown from '@components/ui/Dropdown';
import { formatDate, isTaskOverdue } from '@utils/formatters';
import { TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@utils/constants';

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-soft p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 flex-1">{task.title}</h3>
        <Dropdown
          trigger={
            <button className="p-1 hover:bg-gray-100 rounded">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          }
        >
          <Dropdown.Item onClick={() => onEdit(task)}>Edit</Dropdown.Item>
          <Dropdown.Item onClick={() => onDelete(task.id)}>Delete</Dropdown.Item>
        </Dropdown>
      </div>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="flex items-center gap-2 mb-3">
        <Badge className={TASK_STATUS_COLORS[task.status]}>
          {task.status.replace('_', ' ')}
        </Badge>
        <Badge className={TASK_PRIORITY_COLORS[task.priority]}>
          {task.priority}
        </Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Avatar size="sm" />
          <span>{task.assignee}</span>
        </div>
        <div className={`flex items-center gap-1 ${isTaskOverdue(task) ? 'text-rose-600' : ''}`}>
          {isTaskOverdue(task) ? <AlertTriangle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
          <span>{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
