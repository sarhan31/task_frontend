import { useState, useEffect } from 'react';
import { 
  Calendar, User, Clock, Trash2, Tag, Send, Paperclip, 
  CheckCircle2, XCircle, Play, Check, X, ShieldAlert, 
  ChevronDown, ChevronUp, FileText, ArrowRight, Sparkles, AlertTriangle
} from 'lucide-react';
import { useTaskStore } from '@services/taskStore';
import Drawer from '@components/ui/Drawer';
import Badge from '@components/ui/Badge';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import FileUpload from '@components/ui/FileUpload';
import { toast } from '@components/ui/Toaster';
import { useAuth } from '@hooks/useAuth';
import { formatDate, isTaskOverdue } from '@utils/formatters';

const STATUS_TONES = {
  'Assigned': 'bg-slate-100 text-slate-800 border-slate-200',
  'todo': 'bg-slate-100 text-slate-800 border-slate-200',
  'Started': 'bg-purple-100 text-purple-800 border-purple-200',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'in_progress': 'bg-blue-100 text-blue-800 border-blue-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  'in_review': 'bg-amber-100 text-amber-800 border-amber-200',
  'Approved': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Rejected': 'bg-rose-100 text-rose-800 border-rose-200',
  'Completed': 'bg-green-100 text-green-800 border-green-200',
  'completed': 'bg-green-100 text-green-800 border-green-200',
};

const PRIORITY_TONES = {
  'low': 'bg-slate-100 text-slate-600',
  'medium': 'bg-amber-100 text-amber-800',
  'high': 'bg-orange-100 text-orange-800',
  'urgent': 'bg-red-100 text-red-800'
};

const TaskDetailsDrawer = ({ taskId, isOpen, onClose }) => {
  const { user } = useAuth();
  const { 
    tasks, updateTask, deleteTask, addComment, 
    taskUpdates, fetchTaskUpdates, startTask, 
    submitProgressUpdate, requestTaskReview, 
    approveTask, rejectTask,
    acceptAssignment, denyAssignment, approveStatusChange, rejectStatusChange
  } = useTaskStore();
  
  const [commentText, setCommentText] = useState('');
  const [showProgressForm, setShowProgressForm] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [progressNote, setProgressNote] = useState('');
  const [progressFile, setProgressFile] = useState(null);
  
  // Admin Rejection Form state
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');

  // User Accept/Deny state
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [denyReason, setDenyReason] = useState('');

  // Admin Approve/Reject status change state
  const [showApproveRejectForm, setShowApproveRejectForm] = useState(false);
  const [rejectStatusFeedback, setRejectStatusFeedback] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const task = tasks.find((t) => t.id === taskId);

  useEffect(() => {
    if (isOpen && taskId) {
      fetchTaskUpdates(taskId);
      setShowRejectInput(false);
      setRejectFeedback('');
      setShowProgressForm(false);
      setShowDenyForm(false);
      setDenyReason('');
      setShowApproveRejectForm(false);
      setRejectStatusFeedback('');
      setConfirmAction(null);
    }
  }, [isOpen, taskId]);

  useEffect(() => {
    if (task) {
      setProgressVal(task.progressPercentage || task.progress || 0);
    }
  }, [task]);

  if (!task) return null;

  const currentUpdates = taskUpdates[task.id] || [];

  const handleAcceptAssignment = async () => {
    const result = await acceptAssignment(task.id);
    if (result.success) {
      toast.success('Assignment accepted!');
    } else {
      toast.error(result.error || 'Failed to accept assignment');
    }
  };

  const handleDenyAssignment = async (e) => {
    e.preventDefault();
    if (!denyReason.trim()) return;
    const result = await denyAssignment(task.id, denyReason);
    if (result.success) {
      toast.success('Assignment denied');
      setShowDenyForm(false);
      setDenyReason('');
    } else {
      toast.error(result.error || 'Failed to deny assignment');
    }
  };

  const handleApproveStatusChange = async () => {
    const result = await approveStatusChange(task.id);
    if (result.success) {
      toast.success('Status change approved!');
    } else {
      toast.error(result.error || 'Failed to approve status change');
    }
  };

  const handleRejectStatusChange = async (e) => {
    e.preventDefault();
    if (!rejectStatusFeedback.trim()) return;
    const result = await rejectStatusChange(task.id, rejectStatusFeedback);
    if (result.success) {
      toast.success('Status change rejected');
      setShowApproveRejectForm(false);
      setRejectStatusFeedback('');
    } else {
      toast.error(result.error || 'Failed to reject status change');
    }
  };

  const handleStartTask = async () => {
    const result = await startTask(task.id);
    if (result.success) {
      toast.success('Task started successfully!');
    } else {
      toast.error(result.error || 'Failed to start task');
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    if (!progressNote.trim()) {
      toast.error('Please enter a note describing your progress');
      return;
    }
    const result = await submitProgressUpdate(task.id, progressVal, progressNote, progressFile);
    if (result.success) {
      toast.success(`Progress updated to ${progressVal}%`);
      setProgressNote('');
      setProgressFile(null);
      setShowProgressForm(false);
    } else {
      toast.error(result.error || 'Failed to submit progress update');
    }
  };

  const handleRequestReview = async () => {
    const result = await requestTaskReview(task.id);
    if (result.success) {
      toast.success('Task submitted. Status changed to "Under Review".');
    } else {
      toast.error(result.error || 'Failed to submit task for review');
    }
  };

  const handleApprove = async () => {
    const result = await approveTask(task.id);
    if (result.success) {
      toast.success('Task approved and completed!');
      setConfirmAction(null);
    } else {
      toast.error(result.error || 'Failed to approve task');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectFeedback.trim()) {
      toast.error('Feedback note is required to reject a task');
      return;
    }
    const result = await rejectTask(task.id, rejectFeedback);
    if (result.success) {
      toast.success('Task review rejected with feedback.');
      setShowRejectInput(false);
      setRejectFeedback('');
    } else {
      toast.error(result.error || 'Failed to reject task');
    }
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText, user?.name || 'You');
    setCommentText('');
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    setConfirmAction(null);
    onClose();
  };

  const isAdmin = user?.role === 'admin';
  const userId = user?._id || user?.id;

  // Match by email (most reliable) or by _id fallback — for individually assigned tasks
  const isAssignedToCurrentUser = !isAdmin && (
    (task.assigneeEmail && user?.email && task.assigneeEmail.toLowerCase() === user.email.toLowerCase()) ||
    (task.assignedTo && userId &&
      (task.assignedTo === userId || task.assignedTo?._id === userId)
    )
  );

  // Team task detection
  const isTeamTask = task.assignedType === 'team' || task.assignedType === 'team_member';

  // Responsible user for team_member tasks — they get the accept/deny flow
  const isResponsibleUser = !isAdmin && task.assignedType === 'team_member' && task.responsibleUser && (
    typeof task.responsibleUser === 'string'
      ? task.responsibleUser === userId
      : task.responsibleUser?._id === userId
  );

  // All members of a 'team' task can take workflow actions (start, progress, review)
  const isTeamMember = !isAdmin && task.assignedType === 'team';

  // Can take any workflow action (start, progress, review)
  const canActOnTask = isAssignedToCurrentUser || isTeamMember || isResponsibleUser;

  // Accept/Deny flow only applies to individual tasks or the responsible user of team_member tasks
  const showAssignmentFlow = (isAssignedToCurrentUser && !isTeamTask) || isResponsibleUser;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
      <div className="space-y-6 pb-8">
        
        {/* Workflow Quick Action Buttons */}
        <div className="bg-surface-card border border-border rounded-[24px] p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Workflow Command Panel</h4>
            <Badge className={`px-2.5 py-1 text-xs font-semibold border ${STATUS_TONES[task.status] || STATUS_TONES.todo}`}>
              {task.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* User Accept/Deny flow */}
            {showAssignmentFlow && task.assignmentStatus === 'pending' && (
              <div className="flex flex-col gap-3 w-full">
                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800 font-medium">
                  This task has been assigned to you. Please accept or deny this assignment.
                </div>
                {!showDenyForm ? (
                  <div className="flex gap-3">
                    <Button onClick={handleAcceptAssignment} className="bg-brand text-white hover:bg-brand-dark rounded-xl font-semibold shadow-md">
                      <Check className="mr-1.5 h-4 w-4" /> Accept Assignment
                    </Button>
                    <Button onClick={() => setShowDenyForm(true)} className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-semibold shadow-md">
                      <X className="mr-1.5 h-4 w-4" /> Deny Assignment
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleDenyAssignment} className="space-y-3 w-full">
                    <textarea
                      value={denyReason}
                      onChange={(e) => setDenyReason(e.target.value)}
                      placeholder="Please explain why you're denying this task..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs border border-red-200 rounded-xl focus:outline-none focus:border-red-500"
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowDenyForm(false)}>Cancel</Button>
                      <Button type="submit" size="sm" className="bg-red-500 text-white hover:bg-red-600">Confirm Deny</Button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* User Start Task (only if accepted) */}
            {canActOnTask && (task.assignmentStatus === 'accepted' || isTeamMember) && (task.status === 'Assigned' || task.status === 'Accepted' || task.status === 'todo') && (
              <Button onClick={handleStartTask} className="bg-brand text-white hover:bg-brand-dark rounded-xl font-semibold shadow-md">
                <Play className="mr-1.5 h-4 w-4" /> Start Task
              </Button>
            )}

            {/* User Progress Updates and Review Request */}
            {canActOnTask && (task.assignmentStatus === 'accepted' || isTeamMember) && ['Started', 'In Progress', 'Rejected', 'in_progress'].includes(task.status) && (
              <>
                <Button 
                  onClick={() => setShowProgressForm(!showProgressForm)} 
                  variant="outline" 
                  className="border-border text-slate-700 hover:bg-surface-card rounded-xl font-semibold"
                >
                  {showProgressForm ? <ChevronUp className="mr-1.5 h-4 w-4" /> : <ChevronDown className="mr-1.5 h-4 w-4" />}
                  Update Progress
                </Button>

                {progressVal === 100 && (
                  <Button onClick={handleRequestReview} className="bg-warm text-white hover:bg-warm-dark rounded-xl font-semibold shadow-md">
                    <CheckCircle2 className="mr-1.5 h-4 w-4" /> Request Review
                  </Button>
                )}
              </>
            )}

            {/* Admin Approvals — visible for any active/submitted task */}
            {isAdmin && ['Started', 'In Progress', 'Under Review', 'in_review', 'in_progress'].includes(task.status) && (
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() =>
                    setConfirmAction({
                      type: 'approve',
                      title: 'Approve task completion?',
                      message: 'This will mark the task as completed and confirm the submitted work.',
                      actionLabel: 'Approve Task',
                      actionClass: 'bg-brand text-white hover:bg-brand-dark',
                    })
                  }
                  className="bg-brand text-white hover:bg-brand-dark rounded-xl font-semibold shadow-md flex-1 sm:flex-none"
                >
                  <Check className="mr-1.5 h-4 w-4" /> Approve Task Completion
                </Button>
                <Button 
                  onClick={() => setShowRejectInput(!showRejectInput)} 
                  className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-semibold shadow-md flex-1 sm:flex-none"
                >
                  <X className="mr-1.5 h-4 w-4" /> Reject Task Completion
                </Button>
              </div>
            )}

            {/* Admin Status Change Approvals */}
            {isAdmin && task.pendingStatusChange && task.pendingStatusChange.newStatus && !task.pendingStatusChange.approved && (
              <div className="flex flex-col gap-3 w-full border-t border-border-light pt-4 mt-4">
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800 font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-orange-600" />
                  <span>
                    <strong>Status Change Request:</strong> User requests status change to <strong>{task.pendingStatusChange.newStatus}</strong>
                  </span>
                </div>
                {!showApproveRejectForm ? (
                  <div className="flex gap-3">
                    <Button onClick={handleApproveStatusChange} className="bg-brand text-white hover:bg-brand-dark rounded-xl font-semibold shadow-md">
                      <Check className="mr-1.5 h-4 w-4" /> Approve Status Change
                    </Button>
                    <Button onClick={() => setShowApproveRejectForm(true)} className="bg-red-500 text-white hover:bg-red-600 rounded-xl font-semibold shadow-md">
                      <X className="mr-1.5 h-4 w-4" /> Reject Status Change
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleRejectStatusChange} className="space-y-3 w-full">
                    <textarea
                      value={rejectStatusFeedback}
                      onChange={(e) => setRejectStatusFeedback(e.target.value)}
                      placeholder="Provide feedback for rejecting status change..."
                      rows={2}
                      className="w-full px-3 py-2 text-xs border border-red-200 rounded-xl focus:outline-none focus:border-red-500"
                      required
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => setShowApproveRejectForm(false)}>Cancel</Button>
                      <Button type="submit" size="sm" className="bg-red-500 text-white hover:bg-red-600">Confirm Reject</Button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Collapsible Progress Update Form */}
          {showProgressForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleProgressSubmit} 
              className="mt-4 pt-4 border-t border-border-light space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Current Completion Percentage</span>
                  <span className="text-brand font-bold">{progressVal}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressVal}
                  onChange={(e) => setProgressVal(parseInt(e.target.value, 10))}
                  className="w-full accent-brand h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Progress Update Note</label>
                <textarea
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  placeholder="What have you completed in this milestone?"
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-brand"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">Work Attachment (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setProgressFile(e.target.files[0])}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-light file:text-brand hover:file:bg-[#d5eff9]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowProgressForm(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-brand text-white hover:bg-brand-dark">Save Progress</Button>
              </div>
            </motion.form>
          )}

          {/* Collapsible Admin Feedback Rejection Form */}
          {showRejectInput && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleReject} 
              className="mt-4 pt-4 border-t border-border-light space-y-4"
            >
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-red-600 flex items-center gap-1">
                  <ShieldAlert className="h-3.5 w-3.5" /> Rejection Feedback Parameters
                </label>
                <textarea
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  placeholder="Detail the corrections, omissions, or required completions..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs border border-red-200 rounded-xl focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowRejectInput(false)}>Cancel</Button>
                <Button type="submit" size="sm" className="bg-red-500 text-white hover:bg-red-600">Reject with Feedback</Button>
              </div>
            </motion.form>
          )}
        </div>

        {/* Display Active Rejection Feedback alert */}
        {task.status === 'Rejected' && task.reviewFeedback && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-800">Rejection Feedback Checklist</h4>
              <p className="text-xs text-rose-600 mt-1 leading-5">"{task.reviewFeedback}"</p>
            </div>
          </div>
        )}

        {/* Display Approval Success Signature */}
        {task.status === 'Completed' && task.approvedAt && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800">Approval Stamp</h4>
              <p className="text-xs text-emerald-600 mt-1 font-semibold">
                Completed on schedule & approved by Workspace Administrator on {new Date(task.approvedAt).toLocaleDateString()}.
              </p>
            </div>
          </div>
        )}

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white/70 border border-border rounded-2xl p-4 shadow-sm">
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Current Status</p>
            <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
              <span className={`inline-block h-2 w-2 rounded-full ${task.status === 'Completed' ? 'bg-brand' : task.status === 'Under Review' ? 'bg-warm-light' : 'bg-warm-soft'}`} />
              {task.status.replace('_', ' ')}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Priority</p>
            <p className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-md ${PRIORITY_TONES[task.priority] || 'bg-slate-100'}`}>
              {task.priority.toUpperCase()}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Assignee</p>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-warm text-[9px] font-bold text-white">
                {task.assignee.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-slate-700 truncate">{task.assignee}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Due Date</p>
            <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${isTaskOverdue(task) ? 'text-rose-600' : 'text-slate-700'}`}>
              {isTaskOverdue(task) ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calendar className="h-3.5 w-3.5 text-slate-400" />}
              {formatDate(task.dueDate)}
              {isTaskOverdue(task) && (
                <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Overdue
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-2">Description</h3>
          <p className="text-sm text-slate-600 leading-relaxed bg-surface-card border border-border rounded-2xl p-4">
            {task.description || 'No description provided for this task.'}
          </p>
        </div>

        {/* Progress Tracker Slider & Meter */}
        <div>
          <div className="flex items-center justify-between text-sm font-semibold mb-2">
            <span className="text-slate-800">Milestone Progress Meter</span>
            <span className="text-brand font-bold">{task.progressPercentage || task.progress || 0}%</span>
          </div>
          <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden border border-border">
            <div 
              className="h-full rounded-full bg-[linear-gradient(90deg,_#13856f_0%,_#1b9b82_100%)] transition-all duration-500"
              style={{ width: `${task.progressPercentage || task.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Dynamic Activity Timeline Log */}
        {task.activityTimeline && task.activityTimeline.length > 0 && (
          <div className="border-t border-border-light pt-6">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand" /> Live Audit Timeline
            </h3>

            <div className="relative border-l border-border ml-3 pl-5 space-y-4">
              {task.activityTimeline.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-brand shadow-sm flex items-center justify-center">
                    <div className="h-1 w-1 bg-white rounded-full" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">{item.action}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {new Date(item.date).toLocaleString([], {month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-5">{item.details} ({item.user})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chronological Progress Updates Submissions Feed */}
        {currentUpdates.length > 0 && (
          <div className="border-t border-border-light pt-6">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Milestone Submissions</h3>
            <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
              {currentUpdates.map((up) => (
                <div key={up._id || up.id} className="bg-white border border-border rounded-2xl p-4.5 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[9px] font-bold text-white">
                        {up.updatedBy?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="font-bold text-slate-800">{up.updatedBy?.name || 'Teammate'}</span>
                    </div>
                    <span className="font-semibold text-brand bg-brand-light px-2 py-0.5 rounded-md">{up.percentage}% Done</span>
                  </div>

                  <p className="text-xs text-slate-600 leading- relaxed pl-7">"{up.note}"</p>

                  {up.attachment && (
                    <div className="pl-7 pt-1.5 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand" />
                      <a 
                        href={up.attachment.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-semibold text-brand hover:underline truncate max-w-[200px]"
                      >
                        {up.attachment.name}
                      </a>
                      <span className="text-[10px] text-slate-400">({up.attachment.size})</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments & Discussion System */}
        <div className="border-t border-border-light pt-6">
          <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4">Task Discussion</h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-1 mb-4 custom-scrollbar">
            {task.comments && task.comments.length > 0 ? (
              task.comments.map((c) => (
                <div key={c.id} className="flex gap-3 items-start bg-white border border-border rounded-2xl p-3 shadow-sm">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-warm text-xs font-bold text-white">
                    {c.user.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-slate-800">{c.user}</p>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {c.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-5">{c.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-slate-400 py-6">
                No discussion comments yet. Start the conversation below!
              </p>
            )}
          </div>

          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Post a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white text-xs text-slate-800 focus:outline-none focus:border-brand transition"
            />
            <Button type="submit" className="bg-brand text-white hover:bg-brand-dark">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Delete Task Button */}
        {isAdmin && (
          <div className="border-t border-border-light pt-6 flex justify-end">
            <Button
              type="button"
              variant="outline"
              className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() =>
                setConfirmAction({
                  type: 'delete',
                  title: 'Delete task?',
                  message: `This will permanently remove "${task.title}" and its activity history.`,
                  actionLabel: 'Delete Task',
                  actionClass: 'bg-red-500 text-white hover:bg-red-600',
                })
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </Button>
          </div>
        )}
      </div>

      <Modal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        title={confirmAction?.title || 'Confirm action'}
        size="sm"
      >
        <div className="space-y-5">
          <div className="rounded-2xl border border-border-light bg-surface-card p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-[#fde7df] text-[#c65b3d]">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-900">
                  {confirmAction?.type === 'approve' ? 'Review before approval' : 'This action cannot be undone'}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {confirmAction?.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl px-4 py-2 text-slate-600 hover:bg-[#f6efe8]"
              onClick={() => setConfirmAction(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className={`rounded-xl px-4 py-2 font-semibold shadow-sm ${confirmAction?.actionClass || 'bg-brand text-white hover:bg-brand-dark'}`}
              onClick={() => {
                if (confirmAction?.type === 'approve') {
                  handleApprove();
                } else if (confirmAction?.type === 'delete') {
                  handleDeleteTask();
                }
              }}
            >
              {confirmAction?.actionLabel || 'Confirm'}
            </Button>
          </div>
        </div>
      </Modal>
    </Drawer>
  );
};

export default TaskDetailsDrawer;
