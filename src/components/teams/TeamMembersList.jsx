import { UserX } from "lucide-react";
import Button from "@components/ui/Button";

const TeamMembersList = ({ members, onRemoveMember, isAdmin = false }) => {
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-slate-300 bg-slate-50/50 py-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <UserX className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-800">No members yet</h3>
        <p className="mt-1 text-xs text-slate-500">
          {isAdmin ? "Add members to this team to get started." : "This team currently has no members."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <div 
          key={member._id} 
          className="flex items-center justify-between rounded-[16px] border border-slate-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#13856f] to-[#0c5d4b] text-sm font-bold text-white">
              {member.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-slate-800">{member.name}</p>
              <p className="truncate text-xs text-slate-500">{member.email}</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveMember(member._id)}
              className="ml-2 h-8 w-8 flex-shrink-0 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600"
              title="Remove member"
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default TeamMembersList;
