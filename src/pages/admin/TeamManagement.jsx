import { useState, useEffect } from "react";
import { Users, Briefcase, Plus, Users2, Search } from "lucide-react";
import { teamService } from "@services/teamService";
import TeamStatCard from "@components/teams/TeamStatCard";
import TeamCard from "@components/teams/TeamCard";
import TeamForm from "@components/teams/TeamForm";
import Button from "@components/ui/Button";

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamsRes, analyticsRes] = await Promise.all([
        teamService.getTeams(),
        teamService.getTeamAnalytics()
      ]);
      
      // Merge analytics stats into teams for display
      const teamsWithStats = teamsRes.data.map(team => {
        const stats = analyticsRes.data.find(a => a._id === team._id);
        return { ...team, stats };
      });
      
      setTeams(teamsWithStats);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTeam) {
        await teamService.updateTeam(editingTeam._id, formData);
      } else {
        await teamService.createTeam(formData);
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error("Failed to save team", error);
      alert(error.response?.data?.message || "Failed to save team");
    }
  };

  const handleDelete = async (team) => {
    if (!window.confirm(`Are you sure you want to delete ${team.teamName}?`)) return;
    try {
      await teamService.deleteTeam(team._id);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete team");
    }
  };

  const openEdit = (team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const openCreate = () => {
    setEditingTeam(null);
    setIsFormOpen(true);
  };

  // Calculate totals
  const totalTeams = teams.length;
  const totalMembers = [...new Set(teams.flatMap(t => t.members.map(m => m._id || m)))].length;
  const activeTeams = analytics.filter(a => a.activeTasks > 0).length;
  const totalTasks = analytics.reduce((sum, a) => sum + (a.totalTasks || 0), 0);

  const filteredTeams = teams.filter(t => t.teamName.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">
            Team Management
          </h1>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Create departments, assign members, and track group performance.
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-[#13856f] px-5 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#0c5d4b] hover:shadow-xl"
        >
          <Plus className="h-5 w-5" />
          Create Team
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TeamStatCard
          title="Total Teams"
          value={totalTeams}
          icon={Users2}
          colorClass="bg-[#13856f]"
          gradientClass="bg-[#13856f]/10"
          delay={0.1}
        />
        <TeamStatCard
          title="Total Members"
          value={totalMembers}
          icon={Users}
          colorClass="bg-blue-600"
          gradientClass="bg-blue-600/10"
          delay={0.2}
        />
        <TeamStatCard
          title="Active Teams"
          value={activeTeams}
          icon={Briefcase}
          colorClass="bg-amber-500"
          gradientClass="bg-amber-500/10"
          delay={0.3}
        />
        <TeamStatCard
          title="Team Tasks"
          value={totalTasks}
          icon={Briefcase}
          colorClass="bg-indigo-600"
          gradientClass="bg-indigo-600/10"
          delay={0.4}
        />
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/60 bg-white/40 py-3 pl-12 pr-4 text-sm font-medium outline-none backdrop-blur-xl transition-all focus:border-[#13856f] focus:bg-white focus:ring-4 focus:ring-[#13856f]/10"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 animate-pulse rounded-[24px] bg-white/40"></div>
          ))}
        </div>
      ) : filteredTeams.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team, index) => (
            <TeamCard 
              key={team._id} 
              team={team} 
              onEdit={openEdit} 
              onDelete={handleDelete}
              delay={0.1 * index}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-[32px] border border-dashed border-white/60 bg-white/20 py-20 backdrop-blur-xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-xl">
            <Users2 className="h-10 w-10 text-slate-300" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-800">No teams found</h2>
          <p className="mt-2 max-w-sm text-center text-sm font-medium text-slate-500">
            {searchQuery ? "Try adjusting your search terms." : "Get started by creating your first team."}
          </p>
        </div>
      )}

      <TeamForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleCreateOrUpdate}
        initialData={editingTeam}
      />
    </div>
  );
};

export default TeamManagement;
