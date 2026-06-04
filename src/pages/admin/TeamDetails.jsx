import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Users2, ArrowLeft, Briefcase, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { teamService } from "@services/teamService";
import Button from "@components/ui/Button";
import TeamMembersList from "@components/teams/TeamMembersList";
import TeamForm from "@components/teams/TeamForm";
import { useAuth } from "@hooks/useAuth";

const TeamDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamRes, tasksRes] = await Promise.all([
        teamService.getTeamById(id),
        teamService.getTeamTasks(id)
      ]);
      setTeam(teamRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error("Failed to fetch team details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTeam = async (formData) => {
    try {
      await teamService.updateTeam(id, formData);
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      alert("Failed to update team");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Remove this member from the team?")) return;
    try {
      const newMembers = team.members.filter(m => m._id !== memberId).map(m => m._id);
      await teamService.updateTeam(id, { members: newMembers });
      fetchData();
    } catch (error) {
      alert("Failed to remove member");
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center">Loading team...</div>;
  }

  if (!team) {
    return <div className="flex h-[50vh] items-center justify-center">Team not found</div>;
  }

  const completedTasksCount = tasks.filter(t => t.status === 'Completed' || t.status === 'Approved').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl">
      <Link 
        to={isAdmin ? "/admin/teams" : "/dashboard"} 
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#13856f]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {isAdmin ? 'Teams' : 'Dashboard'}
      </Link>

      {/* Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 overflow-hidden rounded-[32px] border border-white/60 bg-white/40 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:p-10"
      >
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#13856f] to-[#0c5d4b] text-white shadow-lg">
              <Users2 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-800">{team.teamName}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {team.teamDescription || "No description provided."}
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <span>Created by: <span className="text-slate-700">{team.createdBy?.name}</span></span>
                <span>•</span>
                <span>{new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex flex-shrink-0 gap-3">
              <Button onClick={() => setIsFormOpen(true)} className="rounded-xl font-bold">
                Edit Team
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 rounded-2xl bg-white/40 p-1 backdrop-blur-xl sm:w-fit">
        <button
          onClick={() => setActiveTab("members")}
          className={`flex-1 rounded-xl px-6 py-2.5 text-sm font-bold transition-all sm:flex-none ${
            activeTab === "members" ? "bg-white text-[#13856f] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Members ({team.members.length})
        </button>
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex-1 rounded-xl px-6 py-2.5 text-sm font-bold transition-all sm:flex-none ${
            activeTab === "tasks" ? "bg-white text-[#13856f] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab("performance")}
          className={`flex-1 rounded-xl px-6 py-2.5 text-sm font-bold transition-all sm:flex-none ${
            activeTab === "performance" ? "bg-white text-[#13856f] shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Performance
        </button>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === "members" && (
          <div className="rounded-[24px] border border-white/60 bg-white/40 p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Team Members</h2>
              {isAdmin && (
                <Button variant="ghost" size="sm" onClick={() => setIsFormOpen(true)} className="text-[#13856f]">
                  <Plus className="mr-2 h-4 w-4" /> Manage Members
                </Button>
              )}
            </div>
            <TeamMembersList members={team.members} onRemoveMember={handleRemoveMember} isAdmin={isAdmin} />
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="rounded-[24px] border border-white/60 bg-white/40 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-800">Assigned Tasks</h2>
            {tasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500">No tasks assigned to this team yet.</div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {tasks.map(task => (
                  <div key={task._id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800">{task.title}</h3>
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{task.description}</p>
                    {task.responsibleUser && (
                      <p className="mt-3 text-xs font-medium text-[#13856f]">
                        Owner: {task.responsibleUser.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "performance" && (
          <div className="rounded-[24px] border border-white/60 bg-white/40 p-6 backdrop-blur-xl sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-800">Team Performance</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm font-semibold text-slate-500">Total Assigned Tasks</p>
                <p className="mt-2 text-4xl font-black text-slate-800">{tasks.length}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm font-semibold text-slate-500">Completed Tasks</p>
                <p className="mt-2 text-4xl font-black text-[#13856f]">{completedTasksCount}</p>
              </div>
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <p className="text-sm font-semibold text-slate-500">Completion Rate</p>
                <div className="mt-2 flex items-end gap-2">
                  <p className="text-4xl font-black text-blue-600">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {isAdmin && (
        <TeamForm 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          onSubmit={handleUpdateTeam}
          initialData={team}
        />
      )}
    </div>
  );
};

export default TeamDetails;
