import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle, ArrowRight, Shield } from 'lucide-react';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import Card from '@components/ui/Card';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const getStrength = (val) => {
    let score = 0;
    if (!val) return { label: 'Empty', color: 'bg-slate-200', score: 0 };
    if (val.length >= 6) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { label: 'Weak', color: 'bg-red-400', score: 1 },
      { label: 'Fair', color: 'bg-orange-400', score: 2 },
      { label: 'Good', color: 'bg-amber-400', score: 3 },
      { label: 'Strong', color: 'bg-[#13856f]', score: 4 }
    ];

    return levels[score - 1] || levels[0];
  };

  const strength = getStrength(password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setSuccess(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f7e3cf] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute left-[-4rem] top-[-4rem] h-64 w-64 rounded-full bg-[#efbf91]/30 blur-3xl pointer-events-none" />
      <div className="absolute right-[-4rem] bottom-[-4rem] h-72 w-72 rounded-full bg-[#13856f]/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border border-white/60 bg-white/80 backdrop-blur-sm p-6 shadow-[0_20px_50px_rgba(90,55,20,0.12)] rounded-3xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f6f2] border border-[#b8e0d8] text-[#13856f]">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900">
              Reset Password
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Enter your new secure password to restore access
            </p>
          </div>

          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f6f2] text-[#13856f]">
                <CheckCircle className="h-8 w-8" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                Password Reset Successful!
              </p>
              <p className="text-xs text-slate-400">
                Redirecting you to the login screen…
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-xs font-semibold text-red-500 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
                  {error}
                </div>
              )}

              {/* Password */}
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Strength Indicator */}
              {password && (
                <div className="bg-[#fffaf6] border border-[#ead8cb] rounded-2xl p-3">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-400">Strength:</span>
                    <span style={{ color: strength.score === 4 ? '#13856f' : '#b5722a' }}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${strength.color} transition-all duration-300`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Confirm Password */}
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" className="w-full bg-[#13856f] text-white hover:bg-[#0f7260]">
                Update Password
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
