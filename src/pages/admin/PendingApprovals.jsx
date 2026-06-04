import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PendingApprovalsPanel from '@components/admin/PendingApprovalsPanel';
import Button from "@components/ui/Button";

const PendingApprovals = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-[28px] border border-white/65 bg-white/88 p-6 shadow-[0_8px_40px_rgba(90,55,20,0.12)] backdrop-blur-sm"
      >
        <div className="absolute left-0 top-6 bottom-6 w-1.5 rounded-full bg-[#13856f]" />
        <div className="absolute right-8 top-4 h-32 w-32 rounded-full bg-[#efbf91]/20 blur-2xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 pl-6 relative z-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#13856f]">
              Admin Control Center
            </p>
            <h1 className="font-display mt-1 text-2xl font-bold text-slate-900 leading-tight">
              Pending Approvals <Clock className="inline h-6 w-6 text-[#13856f] mb-1 ml-1" />
            </h1>
            <p className="mt-1.5 text-xs text-slate-500 max-w-xl leading-relaxed">
              Review and approve or reject employee status change requests submitted for active workspace tasks.
            </p>
          </div>

          <Button variant="custom" size="none"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-2xl border border-[#ead8cb] bg-white px-4 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition hover:bg-[#e8f6f2] hover:text-[#13856f] hover:border-[#13856f]/30 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      </motion.div>

      {/* Approvals Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <PendingApprovalsPanel />
      </motion.div>
    </div>
  );
};

export default PendingApprovals;
