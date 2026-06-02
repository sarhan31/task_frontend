import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, User, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { taskService } from '@services/taskService';
import { demoTaskStore } from '@services/demoTaskStore';
import { useAuth } from '@hooks/useAuth';
import toast from '@utils/toast';
import { cn } from '@utils/cn';

const isDemoToken = () => {
  const t = localStorage.getItem('token');
  return !t || t.startsWith('demo-token:');
};

const PendingApprovalsPanel = () => {
  const { user } = useAuth();
  const [pendingTasks, setPendingTasks] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [busy, setBusy]                 = useState(null);   // taskId being actioned
  const [rejectFeedback, setRejectFeedback] = useState({});
  const [showRejectForm, setShowRejectForm] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      if (isDemoToken()) {
        setPendingTasks(demoTaskStore.getPendingApprovals());
      } else {
        const res = await taskService.getPendingApprovals();
        setPendingTasks(res.data);
      }
    } catch {
      setPendingTasks(demoTaskStore.getPendingApprovals());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleApprove = async (taskId) => {
    setBusy(taskId);
    try {
      if (isDemoToken()) {
        demoTaskStore.approveStatusChange(taskId, user);
      } else {
        await taskService.approveStatusChange(taskId);
      }
      toast.success('Status change approved!');
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to approve');
    } finally {
      setBusy(null);
    }
  };

  const handleReject = async (taskId) => {
    const feedback = rejectFeedback[taskId] || '';
    if (!feedback.trim()) { toast.error('Please provide feedback'); return; }
    setBusy(taskId);
    try {
      if (isDemoToken()) {
        demoTaskStore.rejectStatusChange(taskId, user, feedback);
      } else {
        await taskService.rejectStatusChange(taskId, feedback);
      }
      toast.success('Status change rejected');
      setRejectFeedback(p => ({ ...p, [taskId]: '' }));
      setShowRejectForm(null);
      fetchPending();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to reject');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#13856f] border-t-transparent" />
      </div>
    );
  }

  if (pendingTasks.length === 0) {
    return (
      <div className="rounded-2xl border border-[#f4ddd0] bg-[#fffaf6] p-6 text-center sm:p-10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e8f6f2]">
          <CheckCircle className="h-8 w-8 text-[#13856f]" />
        </div>
        <h3 className="font-display text-lg font-bold text-slate-900">All Caught Up!</h3>
        <p className="mt-2 text-sm text-slate-600">No pending status change requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-slate-900">Pending Approvals</h2>
        <p className="mt-1 text-sm text-slate-600">
          {pendingTasks.length} request{pendingTasks.length !== 1 ? 's' : ''} waiting for review
        </p>
      </div>

      {pendingTasks.map((task, i) => (
        <motion.div
          key={task._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="overflow-hidden rounded-2xl border border-[#f4ddd0] bg-white shadow-sm"
        >
          <div className="p-6">
            {/* task header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-slate-900">{task.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{task.description || 'No description'}</p>
              </div>
              <div className="ml-4 flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>

            {/* status change arrow */}
            <div className="mb-4 flex items-center gap-4 rounded-xl border border-[#f4ddd0] bg-[#fffaf6] px-4 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current</p>
                <p className="mt-0.5 font-semibold text-slate-800">{task.status}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-[#13856f]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Requested</p>
                <p className="mt-0.5 font-semibold text-[#13856f]">{task.pendingStatusChange?.newStatus}</p>
              </div>
            </div>

            {/* requester info */}
            <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                Requested by <strong className="text-slate-800 ml-1">
                  {task.pendingStatusChange?.requestedByName || task.pendingStatusChange?.requestedBy?.name || 'User'}
                </strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {task.pendingStatusChange?.requestedAt
                  ? new Date(task.pendingStatusChange.requestedAt).toLocaleDateString()
                  : '—'}
              </span>
            </div>

            {/* actions */}
            {showRejectForm === task._id ? (
              <div className="space-y-3">
                <textarea
                  value={rejectFeedback[task._id] || ''}
                  onChange={e => setRejectFeedback(p => ({ ...p, [task._id]: e.target.value }))}
                  placeholder="Provide feedback for rejection…"
                  rows={3}
                  className="w-full resize-none rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#13856f] focus:bg-white focus:outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { setShowRejectForm(null); setRejectFeedback(p => ({ ...p, [task._id]: '' })); }}
                    disabled={busy === task._id}
                    className="rounded-xl border-2 border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(task._id)}
                    disabled={busy === task._id}
                    className="flex items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
                  >
                    {busy === task._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                    Confirm Rejection
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleApprove(task._id)}
                  disabled={busy === task._id}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#13856f] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0f7260] disabled:opacity-60"
                >
                  {busy === task._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Approve
                </button>
                <button
                  onClick={() => setShowRejectForm(task._id)}
                  disabled={busy === task._id}
                  className="flex items-center justify-center gap-2 rounded-xl border-2 border-red-500 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PendingApprovalsPanel;
