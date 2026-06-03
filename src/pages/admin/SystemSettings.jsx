import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save, Settings, Shield, Globe, Clock, Lock, Users,
  ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle, RefreshCcw,
  Palette, Server, Mail, ChevronRight
} from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Select from '@components/ui/Select';
import { toast } from '@components/ui/Toaster';

const SettingsSection = ({ icon: Icon, title, description, children, accent = 'teal' }) => (
  <div className="bg-white border border-[#ead8cb] rounded-[28px] p-6 shadow-sm">
    <div className="flex items-start gap-3 mb-5 pb-4 border-b border-[#f4ddd0]">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
        accent === 'teal' ? 'bg-[#e8f6f2] text-[#13856f]' : 'bg-[#fff4ef] text-[#c26a44]'
      }`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 font-display text-sm">{title}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
    </div>
    {children}
  </div>
);

const ToggleRow = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-[#f9f0ea] last:border-0">
    <div>
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${
        checked ? 'bg-[#13856f]' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  </div>
);

const SystemSettings = () => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // General
  const [appName, setAppName] = useState('Tasky Work Suite');
  const [supportEmail, setSupportEmail] = useState('support@tasky.io');
  const [timezone, setTimezone] = useState('utc+5');
  const [language, setLanguage] = useState('en');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Security
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
  const [require2FA, setRequire2FA] = useState(false);
  const [enforceStrongPassword, setEnforceStrongPassword] = useState(true);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success('System settings saved successfully!');
    setSaving(false);
  };

  const timezones = [
    { value: 'utc-8', label: 'UTC-8 · Pacific Time' },
    { value: 'utc-5', label: 'UTC-5 · Eastern Time' },
    { value: 'utc+0', label: 'UTC+0 · London' },
    { value: 'utc+1', label: 'UTC+1 · Paris / Berlin' },
    { value: 'utc+3', label: 'UTC+3 · Moscow' },
    { value: 'utc+5', label: 'UTC+5:30 · Karachi / New Delhi' },
    { value: 'utc+8', label: 'UTC+8 · Singapore / Beijing' },
    { value: 'utc+9', label: 'UTC+9 · Tokyo' },
  ];

  const languages = [
    { value: 'en', label: 'English (US)' },
    { value: 'en-gb', label: 'English (UK)' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'es', label: 'Español' },
    { value: 'ar', label: 'العربية' },
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">System Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Configure global application preferences and security parameters</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#13856f] text-white hover:bg-[#0f7260] shadow-[0_4px_12px_rgba(19,133,111,0.22)] rounded-xl min-w-[140px]"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 animate-spin" />
              Saving…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save All
            </span>
          )}
        </Button>
      </div>

      {/* Maintenance Mode Banner */}
      <AnimatePresence>
        {maintenanceMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-700">Maintenance Mode is Active</p>
              <p className="text-xs text-amber-600 mt-0.5">Users will see a maintenance screen. Disable this when maintenance is complete.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* General Tab */}
      {activeTab === 'general' && (
        <motion.div
          key="general"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <SettingsSection
            icon={Globe}
            title="Application Configuration"
            description="Core application identity and localization settings"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Application Name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My App"
              />
              <Input
                label="Support Email"
                type="email"
                icon={Mail}
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="support@company.com"
              />
              <Select
                label="Default Timezone"
                options={timezones}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              />
              <Select
                label="Platform Language"
                options={languages}
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={Server}
            title="System Operations"
            description="Control system-level behavior and availability"
            accent="orange"
          >
            <ToggleRow
              label="Maintenance Mode"
              description="Temporarily disable user access while performing updates"
              checked={maintenanceMode}
              onChange={setMaintenanceMode}
            />
            <ToggleRow
              label="Open Registration"
              description="Allow new users to create accounts without an invite"
              checked={allowRegistration}
              onChange={setAllowRegistration}
            />
          </SettingsSection>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <motion.div
          key="security"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-5"
        >
          <SettingsSection
            icon={Lock}
            title="Access Control"
            description="Manage session and authentication policies"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Session Timeout (minutes)"
                type="number"
                icon={Clock}
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                min="5"
                max="480"
              />
              <Input
                label="Max Login Attempts"
                type="number"
                icon={Shield}
                value={maxLoginAttempts}
                onChange={(e) => setMaxLoginAttempts(e.target.value)}
                min="1"
                max="20"
              />
            </div>
            <ToggleRow
              label="Require Two-Factor Authentication"
              description="Force all users to enable 2FA for their accounts"
              checked={require2FA}
              onChange={setRequire2FA}
            />
            <ToggleRow
              label="Enforce Strong Passwords"
              description="Require uppercase, lowercase, number and symbol in passwords"
              checked={enforceStrongPassword}
              onChange={setEnforceStrongPassword}
            />
          </SettingsSection>

          <div className="bg-[#e8f6f2] border border-[#b8e0d8] rounded-[24px] p-5 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#13856f] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-[#13856f]">Security Health: Good</h4>
              <p className="text-xs text-[#0f7260] mt-1 leading-relaxed">
                Current configuration follows industry best practices. Consider enabling 2FA for maximum account protection.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SystemSettings;
