import { useState, useEffect } from "react";
import { X, Users, Search, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@components/ui/Button";
import { userService } from "@services/userService";

const TeamForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    teamName: "",
    teamDescription: "",
    members: []
  });
  
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          teamName: initialData.teamName || "",
          teamDescription: initialData.teamDescription || "",
          // Ensure we extract just IDs if members are populated objects
          members: initialData.members?.map(m => m._id || m) || []
        });
      } else {
        setFormData({ teamName: "", teamDescription: "", members: [] });
      }
      fetchUsers();
    }
  }, [isOpen, initialData]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      // Filter out fired users or admins if needed
      setUsers(res.data.filter(u => u.status !== 'fired' && u.role !== 'admin'));
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const toggleMember = (userId) => {
    setFormData(prev => {
      const isMember = prev.members.includes(userId);
      if (isMember) {
        return { ...prev, members: prev.members.filter(id => id !== userId) };
      } else {
        return { ...prev, members: [...prev.members, userId] };
      }
    });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.12)] backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#13856f]">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {initialData ? "Edit Team" : "Create New Team"}
                  </h2>
                  <p className="text-xs font-medium text-slate-500">
                    {initialData ? "Update team details and members" : "Set up a new team and add members"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 sm:px-8">
              <form id="team-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Team Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#13856f] focus:ring-4 focus:ring-[#13856f]/10"
                    placeholder="e.g. Frontend Team"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.teamDescription}
                    onChange={(e) => setFormData({ ...formData, teamDescription: e.target.value })}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition-all focus:border-[#13856f] focus:ring-4 focus:ring-[#13856f]/10"
                    placeholder="What does this team do?"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Team Members ({formData.members.length})
                    </label>
                    <div className="relative w-48">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs outline-none focus:border-[#13856f]"
                      />
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex h-32 items-center justify-center rounded-xl border border-slate-100 bg-slate-50">
                      <span className="text-sm text-slate-400">Loading users...</span>
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto custom-scrollbar rounded-xl border border-slate-200 bg-slate-50 p-2">
                      {filteredUsers.length === 0 ? (
                        <div className="py-8 text-center text-sm text-slate-400">No users found</div>
                      ) : (
                        <div className="grid gap-1 sm:grid-cols-2">
                          {filteredUsers.map(user => {
                            const isSelected = formData.members.includes(user._id);
                            return (
                              <button
                                key={user._id}
                                type="button"
                                onClick={() => toggleMember(user._id)}
                                className={`flex items-center gap-3 rounded-lg p-2 text-left transition-colors ${
                                  isSelected ? "bg-[#e8f6f2]" : "hover:bg-white"
                                }`}
                              >
                                <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  isSelected ? "bg-[#13856f] text-white" : "bg-slate-200 text-slate-600"
                                }`}>
                                  {isSelected ? <Check className="h-4 w-4" /> : user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`truncate text-sm font-semibold ${isSelected ? "text-[#13856f]" : "text-slate-700"}`}>
                                    {user.name}
                                  </p>
                                  <p className="truncate text-[10px] text-slate-500">{user.email}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 sm:px-8">
              <Button variant="ghost" onClick={onClose} className="rounded-xl font-semibold">
                Cancel
              </Button>
              <Button type="submit" form="team-form" className="rounded-xl bg-[#13856f] font-semibold text-white hover:bg-[#0c5d4b]">
                {initialData ? "Save Changes" : "Create Team"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TeamForm;
