import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Users2, ArrowRight, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { teamService } from "@services/teamService";

const MyTeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await teamService.getMyTeams();
      setTeams(res.data);
    } catch (error) {
      console.error("Failed to fetch user teams", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#13856f] border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-500">Loading your teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 overflow-hidden rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-10"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#13856f] to-[#0c5d4b] text-white shadow-lg">
              <Users2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">My Teams</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                View all the teams you are currently a member of. Click on any team to view its detailed progress and member directory.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {teams.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-[24px] border border-white/60 bg-white/40 backdrop-blur-xl">
          <ShieldCheck className="mb-4 h-12 w-12 text-slate-300" />
          <p className="text-lg font-bold text-slate-600">You haven't been assigned to any teams yet.</p>
          <p className="mt-2 text-sm text-slate-400">Administrators can add you to teams to collaborate on tasks.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team, index) => (
            <motion.div
              key={team._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/60 bg-white/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
            >
              <div className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f2] text-[#13856f]">
                    <Users2 className="h-6 w-6" />
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600">
                    {team.members.length} Members
                  </span>
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-slate-800">{team.teamName}</h3>
                <p className="mb-6 line-clamp-2 text-sm text-slate-500">
                  {team.teamDescription || "No description provided."}
                </p>

                <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-white/50 p-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</p>
                    <p className="mt-1 flex items-center gap-1.5 text-lg font-black text-amber-600">
                      <Clock className="h-4 w-4" />
                      {team.stats?.activeTasks || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Completed</p>
                    <p className="mt-1 flex items-center gap-1.5 text-lg font-black text-[#13856f]">
                      <CheckCircle2 className="h-4 w-4" />
                      {team.stats?.completedTasks || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto border-t border-white/50 bg-white/30 px-6 py-4">
                <Link
                  to={`/dashboard/teams/${team._id}`}
                  className="flex items-center justify-center gap-2 text-sm font-bold text-[#13856f] transition-colors group-hover:text-[#0c5d4b]"
                >
                  View Team Details
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTeams;
