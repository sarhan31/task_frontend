import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import Modal from '@components/ui/Modal';
import AdvancedButton from '@components/ui/AdvancedButton';
import AdvancedInput from '@components/ui/AdvancedInput';
import { taskService } from '@services/taskService';
import toast from '@utils/toast';
import { formatDate, isTaskOverdue } from '@utils/formatters';

const TaskAcceptDenyModal = ({ isOpen, onClose, task, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [showDenyReason, setShowDenyReason] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  const handleAccept = async () => {
    setLoading(true);
    try {
      await taskService.acceptTaskAssignment(task._id || task.id);
      toast.success('Task accepted successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept task');
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      toast.error('Please provide a reason for denying the task');
      return;
    }

    setLoading(true);
    try {
      await taskService.denyTaskAssignment(task._id || task.id, denyReason);
      toast.success('Task denied');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deny task');
    } finally {
      setLoading(false);
    }
  };

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Task Assignment">
      <div className="space-y-6">
        {/* Task Info */}
        <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-5">
          <div className="mb-3 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13856f] text-white">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {task.description || 'No description provided'}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Priority
              </p>
              <p className="mt-1 capitalize text-slate-800">{task.priority}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Due Date
              </p>
              <p className={`mt-1 flex items-center gap-1.5 ${isTaskOverdue(task) ? 'font-semibold text-rose-600' : 'text-slate-800'}`}>
                {isTaskOverdue(task) && <AlertTriangle className="h-4 w-4" />}
                {formatDate(task.dueDate)}
                {isTaskOverdue(task) && <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">Overdue</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Accept/Deny Actions */}
        {!showDenyReason ? (
          <div className="space-y-3">
            <p className="text-center text-sm text-slate-600">
              This task has been assigned to you. Would you like to accept or deny it?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              <AdvancedButton
                variant="primary"
                onClick={handleAccept}
                loading={loading}
                className="w-full"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Accept Task
              </AdvancedButton>

              <AdvancedButton
                variant="danger"
                onClick={() => setShowDenyReason(true)}
                disabled={loading}
                className="w-full"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Deny Task
              </AdvancedButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Reason for Denial
              </label>
              <AdvancedInput
                value={denyReason}
                onChange={(e) => setDenyReason(e.target.value)}
                placeholder="Please explain why you're denying this task..."
                multiline
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <AdvancedButton
                variant="outline"
                onClick={() => {
                  setShowDenyReason(false);
                  setDenyReason('');
                }}
                disabled={loading}
                className="w-full"
              >
                Back
              </AdvancedButton>

              <AdvancedButton
                variant="danger"
                onClick={handleDeny}
                loading={loading}
                className="w-full"
              >
                Confirm Denial
              </AdvancedButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskAcceptDenyModal;
