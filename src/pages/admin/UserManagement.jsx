import { useState, useEffect } from 'react';
import { Plus, Search, UserX, UserCheck, Mail, Users, Flame, AlertTriangle, Activity, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Badge from '@components/ui/Badge';
import Select from '@components/ui/Select';
import Modal from '@components/ui/Modal';
import Table from '@components/ui/Table';
import Textarea from '@components/ui/Textarea';
import { toast } from '@components/ui/Toaster';
import { userService } from '@services/userService';

const UserManagement = () => {
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [fireOpen, setFireOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // New User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('user');

  // Edit User Form State
  const [editRole, setEditRole] = useState('user');
  const [editStatus, setEditStatus] = useState('active');
  const [fireReason, setFireReason] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getUsers({ excludeAdmins: true });
      // Backend returns User array with _id. Let's map _id to id for layout compatibility
      const mapped = res.data
        .filter(u => (u.role || '').toLowerCase() !== 'admin')
        .map(u => ({
          ...u,
          id: u._id,
          joinedDate: u.joinedDate || (u.createdAt ? u.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]),
          tasksCompleted: u.tasksCompleted || 0,
          status: u.status || 'active'
        }));
      setTeammates(mapped);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load system workspace users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredTeammates = teammates.filter((t) => {
    const nameStr = t.name ? t.name.toLowerCase() : '';
    const emailStr = t.email ? t.email.toLowerCase() : '';
    const roleStr = t.role ? t.role.toLowerCase() : '';
    const statusStr = t.status ? t.status.toLowerCase() : '';

    const matchesSearch = nameStr.includes(searchTerm.toLowerCase()) ||
                          emailStr.includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || roleStr === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || statusStr === statusFilter.toLowerCase();

    return roleStr !== 'admin' && matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      toast.error('All fields are required');
      return;
    }

    try {
      // Backend requires password for user creation. Provide default credentials
      const defaultPassword = 'Password123!';
      const res = await userService.createUser({
        name: newName,
        email: newEmail,
        password: defaultPassword,
        role: newRole
      });

      toast.success(`User ${newName} added! Default password: ${defaultPassword}`);
      setNewName('');
      setNewEmail('');
      setNewRole('user');
      setAddOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create system user.');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!activeUser) return;

    try {
      await userService.updateUser(activeUser.id, {
        role: editRole,
        status: editStatus
      });
      toast.success(`Teammate settings updated successfully!`);
      setEditOpen(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to update teammate configurations.');
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await userService.updateUser(user.id, {
        status: nextStatus
      });
      toast.success(`Teammate status set to ${nextStatus}!`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error('Failed to toggle status.');
    }
  };

  const openFireModal = (user) => {
    setActiveUser(user);
    setFireReason('');
    setFireOpen(true);
  };

  const handleFireUser = async (e) => {
    e.preventDefault();
    if (!activeUser || !fireReason.trim()) {
      toast.error('A clear reason is required before firing a user.');
      return;
    }

    try {
      await userService.fireUser(activeUser.id, fireReason);
      toast.success(`${activeUser.name} has been fired and notified.`);
      setFireOpen(false);
      setFireReason('');
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to fire teammate.');
    }
  };

  const openDeleteModal = (user) => {
    setActiveUser(user);
    setDeleteOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!activeUser) return;

    setDeleting(true);
    try {
      await userService.deleteUser(activeUser.id);
      toast.success(`${activeUser.name} has been permanently deleted.`);
      setDeleteOpen(false);
      setActiveUser(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete teammate.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage team roles, access parameters, and performance log</p>
        </div>

        <Button
          onClick={() => setAddOpen(true)}
          className="bg-[#13856f] text-white hover:bg-[#0f7260] shadow-[0_4px_12px_rgba(19,133,111,0.22)] rounded-xl"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Teammate
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-[#ead8cb] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Members</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{teammates.length}</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#e8f6f2] text-[#13856f] flex items-center justify-center border border-[#b8e0d8]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#ead8cb] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Members</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {teammates.filter(t => t.status === 'active').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#fff4ef] text-[#c26a44] flex items-center justify-center border border-[#f1d3c7]">
            <Activity className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-[#ead8cb] rounded-[24px] p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suspended Accounts</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">
              {teammates.filter(t => t.status === 'inactive' || t.status === 'fired').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center border border-red-100">
            <UserX className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 border border-[#ead8cb] rounded-[24px] p-4 shadow-sm">
        <Input
          icon={Search}
          placeholder="Search teammates by name/email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={[
            { value: 'all', label: 'All Roles' },
            { value: 'user', label: 'User' },
            { value: 'developer', label: 'Developer' },
            { value: 'designer', label: 'Designer' }
          ]}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        />
        <Select
          options={[
            { value: 'all', label: 'All Statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'fired', label: 'Fired' }
          ]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      {/* Table view */}
      {loading ? (
        <p className="text-center text-xs text-slate-400 py-12">Loading system workspace registry...</p>
      ) : filteredTeammates.length > 0 ? (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.Head>User</Table.Head>
              <Table.Head>Email</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head className="text-right">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredTeammates.map((teammate) => (
              <Table.Row key={teammate.id}>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8d514f] text-sm font-semibold text-white">
                      {teammate.name ? teammate.name.split(' ').map((p) => p[0]).join('') : 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{teammate.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Joined: {teammate.joinedDate}</p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-xs text-slate-500 font-semibold">{teammate.email}</Table.Cell>
                <Table.Cell>
                  <Badge variant={teammate.role === 'admin' ? 'primary' : 'default'}>
                    {teammate.role}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge variant={teammate.status === 'active' ? 'success' : teammate.status === 'fired' ? 'danger' : 'default'}>
                    {teammate.status}
                  </Badge>
                  {teammate.status === 'fired' && teammate.firedReason && (
                    <p className="mt-1 max-w-[220px] truncate text-[10px] font-semibold text-red-500">
                      {teammate.firedReason}
                    </p>
                  )}
                </Table.Cell>
                <Table.Cell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(teammate)}
                      title={teammate.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                    >
                      {teammate.status === 'active' ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openFireModal(teammate)}
                      disabled={teammate.status === 'fired'}
                      title="Fire User"
                    >
                      <Flame className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#13856f] text-white hover:bg-[#0f7260]"
                      onClick={() => {
                        setActiveUser(teammate);
                        setEditRole(teammate.role);
                        setEditStatus(teammate.status);
                        setEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => openDeleteModal(teammate)}
                      title="Delete User"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <div className="mx-auto max-w-md space-y-3 rounded-[28px] border border-[#ead8cb] bg-white/80 p-6 text-center sm:p-12">
          <p className="text-slate-800 font-bold">No teammates found</p>
          <p className="text-xs text-slate-400">
            Create a user or adjust filters above to match team rosters.
          </p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Teammate">
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            icon={Mail}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Select
            label="System Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'developer', label: 'Developer' },
              { value: 'designer', label: 'Designer' }
            ]}
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#f4ddd0]">
            <Button type="button" variant="ghost" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#13856f] text-white hover:bg-[#0f7260]">Add User</Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title={`Edit ${activeUser?.name}`}>
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Select
            label="Change Role"
            options={[
              { value: 'user', label: 'User' },
              { value: 'developer', label: 'Developer' },
              { value: 'designer', label: 'Designer' }
            ]}
            value={editRole}
            onChange={(e) => setEditRole(e.target.value)}
          />
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#f4ddd0]">
            <Button type="button" variant="ghost" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#13856f] text-white hover:bg-[#0f7260]">Save Changes</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={fireOpen} onClose={() => setFireOpen(false)} title={`Fire ${activeUser?.name || 'User'}`}>
        <form onSubmit={handleFireUser} className="space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Final employment action</p>
                <p className="mt-1 text-xs leading-5 text-red-700">
                  The user will see this reason in a strong dismissal notice when they open their dashboard.
                </p>
              </div>
            </div>
          </div>
          <Textarea
            label="Reason for firing"
            placeholder="State the exact reason clearly and professionally..."
            value={fireReason}
            onChange={(e) => setFireReason(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-[#f4ddd0]">
            <Button type="button" variant="ghost" onClick={() => setFireOpen(false)}>Cancel</Button>
            <Button type="submit" variant="danger">Fire User</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title={`Delete ${activeUser?.name || 'User'}`}>
        <div className="space-y-4">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Permanently delete this user?</p>
                <p className="mt-1 text-xs leading-5 text-red-700">
                  This removes the account and unassigns their tasks. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-[#f4ddd0]">
            <Button type="button" variant="ghost" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
            <Button type="button" variant="danger" onClick={handleDeleteUser} loading={deleting}>Delete User</Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default UserManagement;
