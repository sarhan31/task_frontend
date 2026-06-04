import { Link } from "react-router-dom";
import { Users, Briefcase, ChevronRight, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import Button from "@components/ui/Button";

const TeamCard = ({ team, onEdit, onDelete, delay = 0, hideActions = false }) => {
  // If stats came from backend (my teams), use them. Otherwise default to 0.
  const activeTasks = team.stats?.activeTasks || 0;
  const completedTasks = team.stats?.completedTasks || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-white/60 bg-white/40 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-[0_12px_40px_rgba(15,108,87,0.08)] sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#13856f] to-[#0c5d4b] text-white shadow-sm">
          <Users className="h-6 w-6" />
        </div>
        
        {!hideActions && (
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.preventDefault(); onEdit(team); }}
              className="h-8 w-8 rounded-lg text-slate-400 hover:bg-[#e8f6f2] hover:text-[#13856f]"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.preventDefault(); onDelete(team); }}
              className="h-8 w-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{team.teamName}</h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 min-h-[40px]">
          {team.teamDescription || "No description provided."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200/60 pt-4">
        <div className="flex -space-x-2">
          {team.members.slice(0, 4).map((member, i) => (
            <div
              key={member._id || i}
              className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#e8f6f2] text-xs font-bold text-[#13856f]"
              title={member.name}
            >
              {member.name?.charAt(0).toUpperCase()}
            </div>
          ))}
          {team.members.length > 4 && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-600">
              +{team.members.length - 4}
            </div>
          )}
          {team.members.length === 0 && (
            <span className="text-xs font-medium text-slate-400">No members</span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Briefcase className="h-4 w-4 text-slate-400" />
            <span>{activeTasks}</span>
          </div>
          
          <Link
            to={hideActions ? `/dashboard/teams/${team._id}` : `/admin/teams/${team._id}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-colors hover:bg-[#13856f] hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamCard;
