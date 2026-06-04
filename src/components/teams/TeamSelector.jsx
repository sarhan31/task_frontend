import { useState, useEffect } from "react";
import { Users, User, UserPlus } from "lucide-react";
import { cn } from "@utils/cn";
import { teamService } from "@services/teamService";
import { userService } from "@services/userService";

const TeamSelector = ({ value, onChange, error }) => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // value is expected to be an object:
  // { assignedType: 'individual' | 'team' | 'team_member', assignedTo: id, assignedToTeam: id, responsibleUser: id }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teamsRes, usersRes] = await Promise.all([
          teamService.getTeams(),
          userService.getUsers()
        ]);
        setTeams(teamsRes.data);
        setUsers(usersRes.data.filter(u => u.role !== 'admin' && u.status !== 'fired'));
      } catch (error) {
        console.error("Failed to fetch teams/users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTypeChange = (type) => {
    onChange({
      assignedType: type,
      assignedTo: "",
      assignedToTeam: "",
      assignedToTeamName: "",
      responsibleUser: "",
      responsibleUserName: ""
    });
  };

  const handleTeamChange = (teamId) => {
    const team = teams.find(t => t._id === teamId);
    onChange({
      ...value,
      assignedToTeam: teamId,
      assignedToTeamName: team?.teamName || "",
      responsibleUser: "",
      responsibleUserName: ""
    });
  };

  const handleResponsibleUserChange = (userId) => {
    const selectedUser = users.find(u => u._id === userId);
    onChange({
      ...value,
      responsibleUser: userId,
      responsibleUserName: selectedUser?.name || ""
    });
  };

  const assignmentTypes = [
    { id: 'individual', label: 'Individual', icon: User, desc: 'Assign to a single person' },
    { id: 'team', label: 'Entire Team', icon: Users, desc: 'Assign to a whole team' },
    { id: 'team_member', label: 'Team + Owner', icon: UserPlus, desc: 'Team visibility, one owner' }
  ];

  if (loading) {
    return <div className="h-20 animate-pulse rounded-xl bg-slate-100"></div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {assignmentTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => handleTypeChange(type.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all",
              value.assignedType === type.id
                ? "border-[#13856f] bg-[#e8f6f2] text-[#13856f]"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <type.icon className="h-5 w-5" />
            <div className="text-center">
              <p className="text-xs font-bold">{type.label}</p>
            </div>
          </button>
        ))}
      </div>

      {value.assignedType === 'individual' && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select User
          </label>
          <select
            value={value.assignedTo || ""}
            onChange={(e) => onChange({ ...value, assignedTo: e.target.value })}
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#13856f] focus:ring-4 focus:ring-[#13856f]/10",
              error ? "border-red-300" : "border-slate-200"
            )}
          >
            <option value="">Select a user...</option>
            {users.map(u => (
              <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
            ))}
          </select>
        </div>
      )}

      {(value.assignedType === 'team' || value.assignedType === 'team_member') && (
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Team
          </label>
          <select
            value={value.assignedToTeam || ""}
            onChange={(e) => handleTeamChange(e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#13856f] focus:ring-4 focus:ring-[#13856f]/10",
              error && !value.assignedToTeam ? "border-red-300" : "border-slate-200"
            )}
          >
            <option value="">Select a team...</option>
            {teams.map(t => (
              <option key={t._id} value={t._id}>{t.teamName}</option>
            ))}
          </select>
        </div>
      )}

      {value.assignedType === 'team_member' && value.assignedToTeam && (
        <div className="mt-3">
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Responsible Person
          </label>
          <select
            value={value.responsibleUser || ""}
            onChange={(e) => handleResponsibleUserChange(e.target.value)}
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#13856f] focus:ring-4 focus:ring-[#13856f]/10",
              error && !value.responsibleUser ? "border-red-300" : "border-slate-200"
            )}
          >
            <option value="">Select team member...</option>
            {teams.find(t => t._id === value.assignedToTeam)?.members.map(memberId => {
              const u = users.find(user => user._id === (typeof memberId === 'object' ? memberId._id : memberId));
              if (!u) return null;
              return <option key={u._id} value={u._id}>{u.name}</option>;
            })}
          </select>
        </div>
      )}
      
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TeamSelector;
