import { useState, useEffect } from 'react';
import { Calendar, Tag, User, Save, Info } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Textarea from '@components/ui/Textarea';
import Select from '@components/ui/Select';
import FileUpload from '@components/ui/FileUpload';
import TeamSelector from '@components/teams/TeamSelector';
import { useAuth } from '@hooks/useAuth';


const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const TaskForm = ({ initialTask, onSave, onCancel }) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate || '');
  const [priority, setPriority] = useState(initialTask?.priority || 'medium');
  const [status, setStatus] = useState(initialTask?.status || 'todo');
  const [progress, setProgress] = useState(initialTask?.progress || 0);
  const [tagsInput, setTagsInput] = useState(initialTask?.tags ? initialTask.tags.join(', ') : '');
  const [attachments, setAttachments] = useState(initialTask?.attachments || []);
  const [errors, setErrors] = useState({});
  
  // Assignment State
  const [assignment, setAssignment] = useState({
    assignedType: initialTask?.assignedType || 'individual',
    assignedTo: initialTask?.assignedTo?._id || initialTask?.assignedTo || '',
    assignedToTeam: initialTask?.assignedToTeam?._id || initialTask?.assignedToTeam || '',
    responsibleUser: initialTask?.responsibleUser?._id || initialTask?.responsibleUser || ''
  });

  const isAssignedToParticularUser = !!(initialTask && initialTask.assignedTo && !initialTask.assignedToAll);

  // Sync progress if status changes
  useEffect(() => {
    if (status === 'completed') {
      setProgress(100);
    } else if (status === 'todo') {
      setProgress(0);
    }
  }, [status]);

  const handleAddAttachment = (fileObj) => {
    const newAtt = {
      id: `att-${Date.now()}`,
      name: fileObj.name,
      size: `${(fileObj.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0]
    };
    setAttachments((prev) => [...prev, newAtt]);
  };

  const handleDeleteAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const validate = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!dueDate) nextErrors.dueDate = 'Due Date is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      progress: parseInt(progress, 10),
      tags,
      ...assignment,
      attachments
    };

    onSave(taskData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title */}
        <Input
          label="Task Title"
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
          className="w-full"
          disabled={isAssignedToParticularUser}
        />

        {/* Description */}
        <Textarea
          label="Task Description"
          placeholder="Describe the task parameters, requirements, and links..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          disabled={isAssignedToParticularUser}
        />

        {/* Grid for Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Due Date"
            icon={Calendar}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errors.dueDate}
            disabled={isAssignedToParticularUser}
          />

          <Select
            label="Priority"
            options={priorityOptions}
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={isAssignedToParticularUser}
          />

          <Select
            label="Status"
            options={statusOptions}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          />

          {/* Assignee select via TeamSelector */}
          <div className="col-span-1 md:col-span-2 mt-2 border-t border-slate-100 pt-4">
            <h3 className="mb-4 text-sm font-bold text-slate-800">Assignment Details</h3>
            <TeamSelector 
              value={assignment} 
              onChange={setAssignment} 
              error={errors.assignment}
            />
          </div>
        </div>

        {/* Progress Slider */}
        {status !== 'completed' && status !== 'todo' && (
          <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <Info className="h-4 w-4 text-[#13856f]" />
                Completion Progress
              </span>
              <span className="text-sm font-bold text-[#13856f]">{progress}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="w-full accent-[#13856f] h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {/* Tags */}
        <Input
          label="Tags (comma separated)"
          placeholder="e.g. design, ui/ux, frontend"
          icon={Tag}
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          disabled={isAssignedToParticularUser}
        />

        {/* Attachments Section */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2 pl-0.5">
            Attachments
          </label>
          <FileUpload
            currentAttachments={attachments}
            onAdd={handleAddAttachment}
            onDelete={handleDeleteAttachment}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f4ddd0]">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="bg-[#13856f] text-white hover:bg-[#0f7260]">
          <Save className="mr-2 h-4 w-4" />
          {initialTask ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
