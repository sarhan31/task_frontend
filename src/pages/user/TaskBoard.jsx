import { useState } from 'react';
import { motion } from 'framer-motion';
import { Kanban, ArrowRight, Calendar, Tag, MoveRight, Clock, Check, Play, AlertCircle, AlertTriangle } from 'lucide-react';
import { useTaskStore } from '@services/taskStore';
import Badge from '@components/ui/Badge';
import TaskDetailsDrawer from '@components/tasks/TaskDetailsDrawer';
import { useAuth } from '@hooks/useAuth';
import { toast } from '@components/ui/Toaster';
import { isTaskOverdue, formatDate } from '@utils/formatters';

const TaskBoard = () => {
  const { user } = useAuth();
  const { tasks, updateTask, requestStatusChange, searchQuery } = useTaskStore();
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-slate-100/50 border-slate-200/60', text: 'text-slate-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-orange-50/40 border-orange-100/50', text: 'text-warm-accent' },
    { id: 'completed', title: 'Completed', color: 'bg-brand-light/40 border-brand-muted/50', text: 'text-brand' }
  ];

  const getStatusColumnId = (status) => {
    if (['Assigned', 'Accepted', 'Started', 'todo'].includes(status)) return 'todo';
    if (['In Progress', 'in_progress', 'Under Review', 'in_review', 'Rejected'].includes(status)) return 'in_progress';
    if (['Completed', 'completed', 'Approved'].includes(status)) return 'completed';
    return 'todo';
  };

  const getTasksByStatus = (columnId) => {
    return tasks.filter((task) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        task.title?.toLowerCase().includes(query) ||
        task.description?.toLowerCase().includes(query) ||
        task.assignee?.toLowerCase().includes(query);

      // Standard users only see their own tasks
      const isAssigned = isAdmin || (
        task.assignedToAll ||
        task.assignedToTeam ||
        (task.assigneeEmail && user?.email && task.assigneeEmail.toLowerCase() === user.email.toLowerCase()) ||
        (task.assignedTo && (user?._id || user?.id) &&
          (task.assignedTo === (user._id || user.id) || task.assignedTo?._id === (user._id || user.id))
        )
      );
      if (!isAssigned) return false;
      if (!matchesSearch) return false;

      return getStatusColumnId(task.status) === columnId;
    });
  };

  const handleMoveStatus = async (taskId, nextStatusColumnId, e) => {
    e.stopPropagation();
    
    let targetStatus = 'Assigned';
    if (nextStatusColumnId === 'in_progress') targetStatus = 'In Progress';
    if (nextStatusColumnId === 'completed') targetStatus = 'Completed';

    if (isAdmin) {
      await updateTask(taskId, { status: targetStatus });
      toast.success(`Task status updated to ${targetStatus}`);
    } else {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      if (task.assignmentStatus !== 'accepted') {
        toast.error('You must accept the task assignment before changing its status');
        return;
      }

      if (targetStatus === 'In Progress') {
        const result = await requestStatusChange(taskId, 'In Progress');
        if (result.success) {
          toast.success('Status change to In Progress requested. Awaiting admin approval.');
        } else {
          toast.error(result.error || 'Failed to request status change');
        }
      } else if (targetStatus === 'Completed') {
        const result = await useTaskStore.getState().requestTaskReview(taskId);
        if (result.success) {
          toast.success('Task review requested. Status will change to Completed once approved.');
        } else {
          toast.error(result.error || 'Failed to request review');
        }
      } else {
        const result = await requestStatusChange(taskId, 'Started');
        if (result.success) {
          toast.success('Status change to Started requested. Awaiting admin approval.');
        } else {
          toast.error(result.error || 'Failed to request status change');
        }
      }
    }
  };

  const handleCardClick = (id) => {
    setActiveTaskId(id);
    setDetailsOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Task Board</h1>
        <p className="text-sm text-slate-500 mt-1">Kanban board layout showing task status velocity columns</p>
      </div>

      {/* Columns Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          return (
            <div
              key={column.id}
              className={`rounded-[24px] border border-border p-4 bg-white/60 shadow-sm min-h-[480px] flex flex-col`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-4.5 px-1.5">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${
                    column.id === 'completed' ? 'bg-brand' : column.id === 'in_progress' ? 'bg-warm-light' : 'bg-warm-soft'
                  }`} />
                  <h3 className="font-bold text-slate-800 text-sm font-display">{column.title}</h3>
                </div>
                <Badge variant={column.id === 'completed' ? 'success' : column.id === 'in_progress' ? 'warning' : 'default'}>
                  {columnTasks.length}
                </Badge>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {columnTasks.length > 0 ? (
                  columnTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleCardClick(task.id)}
                      className="bg-white border border-border rounded-[20px] p-4 shadow-sm hover:shadow-md hover:border-brand/30 transition cursor-pointer flex flex-col justify-between min-h-[160px] h-auto group relative overflow-hidden"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="space-y-2">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-semibold text-xs text-slate-800 line-clamp-1 group-hover:text-brand transition">
                              {task.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                        
                        {task.pendingStatusChange && task.pendingStatusChange.newStatus && !task.pendingStatusChange.approved && (
                          <div className="rounded-lg border border-orange-200 bg-orange-50 p-1.5 text-[9px] font-semibold text-orange-800">
                            Pending Approval: Move to {task.pendingStatusChange.newStatus}
                          </div>
                        )}

                        {task.assignmentStatus === 'pending' && (
                          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-1.5 text-[9px] font-semibold text-yellow-800 flex items-center justify-between">
                            <span>Pending Acceptance</span>
                            <span className="text-[8px] px-1 py-0.5 bg-yellow-100 rounded border border-yellow-300 font-bold">New</span>
                          </div>
                        )}
                      </div>
 
                      <div className="border-t border-border-light pt-2.5 mt-2.5 flex items-center justify-between">
                        <div className={`flex items-center gap-1 ${isTaskOverdue(task) ? 'text-rose-600' : 'text-slate-400'}`}>
                          {isTaskOverdue(task) ? <AlertTriangle className="h-3 w-3" /> : <Calendar className="h-3 w-3" />}
                          <span className="text-[9px] font-bold">{formatDate(task.dueDate)}</span>
                        </div>
 
                        {/* Quick Move Trigger dropdown */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Move:</span>
                          <select
                            value={getStatusColumnId(task.status)}
                            onChange={(e) => handleMoveStatus(task.id, e.target.value, e)}
                            className="bg-surface-card border border-border-soft text-[10px] font-bold text-slate-600 rounded-lg py-0.5 px-1 focus:outline-none cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border-2 border-dashed border-border-soft rounded-2xl p-6 text-center text-slate-400 flex flex-col items-center justify-center gap-1.5 h-36">
                    <p className="text-xs font-semibold">No tasks in column</p>
                    <p className="text-[10px] text-slate-400">Drag or update task status to populate</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Details Drawer */}
      {activeTaskId && (
        <TaskDetailsDrawer taskId={activeTaskId} isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
      )}
    </motion.div>
  );
};

export default TaskBoard;
