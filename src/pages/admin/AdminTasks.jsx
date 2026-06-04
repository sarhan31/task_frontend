import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, LayoutGrid, List, Eye, Calendar, ArrowUpRight, Trash2, AlertTriangle, X } from 'lucide-react';
import { useTaskStore } from '@services/taskStore';
import { toast } from '@components/ui/Toaster';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import Badge from '@components/ui/Badge';
import Table from '@components/ui/Table';
import Drawer from '@components/ui/Drawer';
import Modal from '@components/ui/Modal';
import TaskForm from '@components/forms/TaskForm';
import TaskDetailsDrawer from '@components/tasks/TaskDetailsDrawer';
import { TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '@utils/constants';

const AdminTasks = () => {
  const { tasks, addTask, updateTask, deleteTask, searchQuery } = useTaskStore();
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchVal, setSearchVal] = useState(searchQuery || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  
  // Drawer states
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const activeTask = tasks.find((t) => t.id === activeTaskId);

  useEffect(() => {
    setSearchVal(searchQuery || '');
  }, [searchQuery]);

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchVal.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchVal.toLowerCase()) ||
                          t.assignee.toLowerCase().includes(searchVal.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleCreateTask = (taskData) => {
    addTask(taskData);
    setCreateOpen(false);
  };

  const handleEditTask = (taskData) => {
    updateTask(activeTaskId, taskData);
    setEditOpen(false);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    const result = await deleteTask(taskToDelete.id);
    if (result?.success) {
      toast.success(`Task "${taskToDelete.title}" deleted.`);
    } else {
      toast.error(result?.error || 'Failed to delete task.');
    }
    setTaskToDelete(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">Manage Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, assign, filter, and track team velocity parameters
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[#13856f] text-white hover:bg-[#0f7260] shadow-[0_4px_12px_rgba(19,133,111,0.22)] rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      {/* Filter and layout triggers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 border border-[#ead8cb] rounded-[24px] p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <Input
            icon={Search}
            placeholder="Search by title, desc, user..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'Assigned', label: 'Assigned' },
              { value: 'Started', label: 'Started' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Rejected', label: 'Rejected' },
              { value: 'Completed', label: 'Completed' }
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={[
              { value: 'all', label: 'All Priorities' },
              { value: 'low', label: 'Low' },
              { value: 'medium', label: 'Medium' },
              { value: 'high', label: 'High' },
              { value: 'urgent', label: 'Urgent' }
            ]}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-[#f4ddd0] md:border-t-0 pt-3 md:pt-0 self-end md:self-auto">
          <Button variant="custom" size="none"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-xl transition ${
              viewMode === 'list' ? 'bg-[#e8f6f2] text-[#13856f]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button variant="custom" size="none"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-xl transition ${
              viewMode === 'grid' ? 'bg-[#e8f6f2] text-[#13856f]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Task Content */}
      {filteredTasks.length > 0 ? (
        viewMode === 'list' ? (
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.Head>Task Name</Table.Head>
                <Table.Head>Assignee</Table.Head>
                <Table.Head>Status</Table.Head>
                <Table.Head>Priority</Table.Head>
                <Table.Head>Due Date</Table.Head>
                <Table.Head className="text-right">Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredTasks.map((t) => (
                <Table.Row key={t.id}>
                  <Table.Cell>
                    <div>
                      <p className="font-semibold text-slate-800">{t.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 max-w-md">{t.description}</p>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#8d514f] text-[10px] font-bold text-white">
                        {t.assignee.charAt(0)}
                      </div>
                      <span className="text-xs text-slate-700 font-bold">{t.assignee}</span>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant={t.status === 'completed' ? 'success' : t.status === 'in_progress' ? 'warning' : 'default'}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className={`text-xs font-bold ${
                      t.priority === 'urgent' || t.priority === 'high' ? 'text-red-500' : 'text-slate-500'
                    }`}>
                      {t.priority}
                    </span>
                  </Table.Cell>
                  <Table.Cell className="text-xs text-slate-500 font-semibold">{t.dueDate}</Table.Cell>
                  <Table.Cell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setActiveTaskId(t.id);
                          setDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#13856f] text-white hover:bg-[#0f7260]"
                        onClick={() => {
                          setActiveTaskId(t.id);
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteTask(t)}
                        title="Delete Task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white border border-[#ead8cb] rounded-[24px] p-5 shadow-sm hover:shadow-md hover:border-[#13856f]/30 transition flex flex-col justify-between h-56"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-slate-800 line-clamp-1">{t.title}</h3>
                    <Badge variant={t.status === 'completed' ? 'success' : t.status === 'in_progress' ? 'warning' : 'default'}>
                      {t.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 leading- relaxed line-clamp-3 mb-4">{t.description}</p>
                </div>

                <div className="border-t border-[#f4ddd0] pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#8d514f] text-[9px] font-bold text-white">
                      {t.assignee.charAt(0)}
                    </div>
                    <span className="text-[11px] text-slate-600 font-bold truncate max-w-[80px]">{t.assignee}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {t.dueDate}
                    </span>
                    <Button variant="custom" size="none"
                      onClick={() => {
                        setActiveTaskId(t.id);
                        setDetailsOpen(true);
                      }}
                      className="p-1 hover:bg-slate-100 rounded-lg text-[#13856f]"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                    <Button variant="custom" size="none"
                      onClick={() => handleDeleteTask(t)}
                      className="p-1 hover:bg-red-50 rounded-lg text-red-500"
                      title="Delete Task"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="mx-auto max-w-md space-y-3 rounded-[28px] border border-[#ead8cb] bg-white/80 p-6 text-center sm:p-12">
          <p className="text-slate-800 font-bold">No tasks found</p>
          <p className="text-xs text-slate-400">
            Create a task or modify search criteria filters above.
          </p>
        </div>
      )}

      {/* Task Creation Drawer */}
      <Drawer isOpen={createOpen} onClose={() => setCreateOpen(false)} title="Create New Task" size="lg">
        <TaskForm onSave={handleCreateTask} onCancel={() => setCreateOpen(false)} />
      </Drawer>

      {/* Task Editing Drawer */}
      <Drawer isOpen={editOpen} onClose={() => setEditOpen(false)} title="Edit Task" size="lg">
        {activeTask && (
          <TaskForm initialTask={activeTask} onSave={handleEditTask} onCancel={() => setEditOpen(false)} />
        )}
      </Drawer>

      {/* Task Details Drawer */}
      {activeTaskId && (
        <TaskDetailsDrawer taskId={activeTaskId} isOpen={detailsOpen} onClose={() => setDetailsOpen(false)} />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        hideHeader
        noPadding
        size="sm"
      >
        {/* Dark Custom Header */}
        <div className="bg-[#141b2e] flex items-center justify-between px-6 py-5">
          <h2 className="text-xl font-bold text-white tracking-wide">Confirm Deletion</h2>
          <Button variant="custom" size="none" 
            onClick={() => setTaskToDelete(null)}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 bg-white">
          <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50/50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <p className="text-sm leading-relaxed text-red-700/90">
              This action cannot be undone. This will permanently remove <strong>"{taskToDelete?.title}"</strong> and its activity history.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button variant="custom" size="none"
              onClick={() => setTaskToDelete(null)}
              className="w-full rounded-[20px] border border-gray-200 py-3.5 text-sm font-bold text-slate-600 transition-colors hover:bg-gray-50 focus:outline-none"
            >
              Cancel Process
            </Button>
            <Button variant="custom" size="none"
              onClick={confirmDeleteTask}
              className="w-full rounded-[20px] border border-transparent bg-red-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-red-600 focus:outline-none shadow-[0_4px_12px_rgba(239,68,68,0.2)]"
            >
              Delete Task
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default AdminTasks;
