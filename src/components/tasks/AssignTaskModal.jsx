import { useState, useEffect } from 'react';
import { Search, Check, UserPlus, Users } from 'lucide-react';
import Modal from '@components/ui/Modal';
import Input from '@components/ui/Input';
import { userService } from '@services/userService';

const AssignTaskModal = ({ isOpen, onClose, selectedAssignee, onAssign }) => {
  const [searchVal, setSearchVal] = useState('');
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignToAll, setAssignToAll] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTeammates = async () => {
      setLoading(true);
      try {
        const res = await userService.getUsers({ excludeFired: true });
        setTeammates(res.data);
      } catch (err) {
        console.error('Failed to load teammates in AssignTaskModal:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeammates();
  }, [isOpen]);

  const assignableTeammates = teammates.filter(
    (t) => (t.role || '').toLowerCase() !== 'admin' && t.status !== 'fired'
  );

  const filteredTeammates = assignableTeammates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchVal.toLowerCase()) ||
      t.email.toLowerCase().includes(searchVal.toLowerCase()) ||
      (t.role && t.role.toLowerCase().includes(searchVal.toLowerCase()))
  );

  const handleAssignToAll = () => {
    setAssignToAll(true);
    onAssign('all', 'all-members@team.com', true);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Assign Task">
      <div className="space-y-4">
        {/* Assign to All Option */}
        <div
          onClick={handleAssignToAll}
          className="flex cursor-pointer items-center justify-between rounded-2xl border-2 border-[#13856f] bg-[#e8f6f2] p-4 transition hover:bg-[#d4f0ea]"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#13856f] text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Assign to All Members</p>
              <p className="text-xs text-slate-600">
                This task will be visible to all non-admin team members
              </p>
            </div>
          </div>
          <UserPlus className="h-5 w-5 text-[#13856f]" />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#f4ddd0]" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-500">Or assign to individual</span>
          </div>
        </div>

        <Input
          icon={Search}
          placeholder="Search team members by name or role..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          className="w-full"
        />

        <div className="max-h-60 overflow-y-auto divide-y divide-[#f4ddd0] custom-scrollbar pr-1">
          {filteredTeammates.length > 0 ? (
            filteredTeammates.map((teammate) => {
              const isSelected = selectedAssignee === teammate.name;
              return (
                <div
                  key={teammate._id || teammate.id}
                  onClick={() => {
                    onAssign(teammate.name, teammate.email, false);
                    onClose();
                  }}
                  className="flex items-center justify-between py-3 px-2 rounded-xl hover:bg-[#fffaf6] cursor-pointer transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8d514f] text-sm font-semibold text-white">
                      {teammate.name.split(' ').map((p) => p[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {teammate.name}
                      </p>
                      <p className="text-[11px] capitalize text-slate-500 mt-0.5">
                        {teammate.role} • {teammate.email}
                      </p>
                    </div>
                  </div>

                  {isSelected ? (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#13856f] text-white">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                  ) : (
                    <UserPlus className="h-4 w-4 text-slate-400 hover:text-[#13856f]" />
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center text-xs text-slate-400 py-6">
              No matching team members found.
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssignTaskModal;
