import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Save, Camera, Lock, Mail, Phone, User, Shield,
  CheckCircle2, Star, Activity, Calendar, Edit3, Key
} from 'lucide-react';
import { useAuth } from '@hooks/useAuth';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import { toast } from '@components/ui/Toaster';
import { useTaskStore } from '@services/taskStore';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white border border-[#ead8cb] rounded-[20px] p-4 flex items-center gap-3 shadow-sm">
    <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{label}</p>
    </div>
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { tasks } = useTaskStore();

  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    jobTitle: user?.jobTitle || 'Team Member',
    department: user?.department || 'Engineering',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const myTasks = tasks.filter(t => t.assignee === user?.name);
  const completedTasks = myTasks.filter(t => t.status === 'completed');
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress');

  const handlePersonalSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser?.(formData);
    toast.success('Profile updated successfully!');
    setSaving(false);
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    toast.success('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setSaving(false);
  };

  const initials = formData.name
    ? formData.name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-4xl"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Profile Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information, security, and preferences</p>
      </div>

      {/* Profile Hero Card */}
      <div className="bg-white border border-[#ead8cb] rounded-[28px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-[#8d514f] to-[#c26a44] flex items-center justify-center text-white text-2xl font-bold shadow-[0_8px_20px_rgba(141,81,79,0.35)]">
              {initials}
            </div>
            <button className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-xl bg-[#13856f] text-white flex items-center justify-center shadow-[0_4px_10px_rgba(19,133,111,0.35)] hover:bg-[#0f7260] transition">
              <Camera className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900 font-display">{formData.name || 'Your Name'}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{formData.jobTitle} · {formData.department}</p>
            <p className="text-xs text-[#13856f] font-semibold mt-1">{formData.email}</p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-2xl bg-[#e8f6f2] border border-[#b8e0d8] px-3 py-1.5">
              <Star className="h-3.5 w-3.5 text-[#13856f]" />
              <span className="text-xs font-bold text-[#13856f] capitalize">{user?.role || 'user'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedTasks.length}
          color="bg-[#e8f6f2] text-[#13856f]"
        />
        <StatCard
          icon={Activity}
          label="In Progress"
          value={inProgressTasks.length}
          color="bg-[#fff4ef] text-[#c26a44]"
        />
        <StatCard
          icon={Calendar}
          label="Total Tasks"
          value={myTasks.length}
          color="bg-slate-50 text-slate-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white border border-[#ead8cb] rounded-2xl w-fit shadow-sm">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-[#13856f] text-white shadow-[0_4px_12px_rgba(19,133,111,0.25)]'
                : 'text-slate-500 hover:text-slate-700 hover:bg-[#fffaf6]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white border border-[#ead8cb] rounded-[28px] p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#f4ddd0]">
            <Edit3 className="h-4 w-4 text-[#13856f]" />
            <h3 className="font-bold text-slate-800 font-display">Personal Information</h3>
          </div>

          <form onSubmit={handlePersonalSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                icon={User}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
              <Input
                label="Job Title"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                placeholder="Senior Developer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                placeholder="Write a short bio about yourself..."
                className="w-full rounded-2xl border border-[#e6d6ca] bg-[#fffaf6] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#13856f] focus:outline-none focus:ring-2 focus:ring-[#13856f]/15 transition resize-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={saving}
                className="bg-[#13856f] text-white hover:bg-[#0f7260] shadow-[0_4px_12px_rgba(19,133,111,0.25)] rounded-xl min-w-[140px]"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          {/* Change Password */}
          <div className="bg-white border border-[#ead8cb] rounded-[28px] p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#f4ddd0]">
              <Key className="h-4 w-4 text-[#13856f]" />
              <h3 className="font-bold text-slate-800 font-display">Change Password</h3>
            </div>

            <form onSubmit={handlePasswordSave} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                icon={Lock}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
              <Input
                label="New Password"
                type="password"
                icon={Lock}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Min. 8 characters"
              />
              <Input
                label="Confirm New Password"
                type="password"
                icon={Lock}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
              />

              {/* Password strength indicator */}
              {passwordData.newPassword && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          passwordData.newPassword.length >= level * 3
                            ? level <= 2 ? 'bg-orange-400' : 'bg-[#13856f]'
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {passwordData.newPassword.length < 6
                      ? 'Weak password'
                      : passwordData.newPassword.length < 10
                      ? 'Moderate password'
                      : 'Strong password'}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-[#13856f] text-white hover:bg-[#0f7260] shadow-[0_4px_12px_rgba(19,133,111,0.25)] rounded-xl min-w-[160px]"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Updating…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Update Password
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Status */}
          <div className="bg-[#e8f6f2] border border-[#b8e0d8] rounded-[24px] p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#13856f] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-[#13856f]">Account is Secure</h4>
                <p className="text-xs text-[#0f7260] mt-1 leading-relaxed">
                  Your account is protected. Keep your credentials private and change your password regularly for best security practices.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Profile;
