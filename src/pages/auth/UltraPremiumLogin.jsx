import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AdvancedInput from "@components/ui/AdvancedInput";
import AdvancedButton from "@components/ui/AdvancedButton";
import { toast } from "@components/ui/Toaster";
import TaskIllustration from "@components/ui/TaskIllustration";
import { useAuth } from "@hooks/useAuth";
import BrandLogo from "@components/ui/BrandLogo";

const UltraPremiumLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData);
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`);
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-page p-3 sm:p-4">
      {/* Soft ambient blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-warm-light/30 rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-brand/10 rounded-full blur-3xl opacity-80 animate-float animation-delay-400" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_32px_80px_rgba(0,0,0,0.12)] overflow-hidden relative z-10"
      >
        <div className="grid lg:min-h-[640px] lg:grid-cols-2">
          {/* ── LEFT PANEL ── illustration */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,_#fff6ee_0%,_#ffe7d6_100%)] p-10 lg:flex">
            {/* decorative circles */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/50 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-brand/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-warm-light/10 rounded-full" />

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative z-10"
            >
              <BrandLogo />
            </motion.div>

            {/* SVG Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 flex-1 flex items-center justify-center py-6"
            >
              <TaskIllustration />
            </motion.div>

            {/* Bottom tagline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="relative z-10 text-center"
            >
              <p className="text-slate-900 font-semibold text-lg leading-snug">
                Manage your tasks in an easy
                <br />
                and more efficient way
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${i === 0 ? "w-6 bg-brand" : "w-2 bg-[#d8c3b4]"}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT PANEL ── form */}
          <div className="flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Header */}
              <div className="mb-8">
                <h2 className="mb-2 text-3xl font-display font-bold text-gray-900 sm:text-4xl">
                  Welcome Back!
                </h2>
                <p className="text-gray-500 text-base">
                  Please enter login details below
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <AdvancedInput
                    type="email"
                    placeholder="Enter the email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <AdvancedInput
                    type="password"
                    placeholder="Enter the Password"
                    icon={Lock}
                    showPasswordToggle
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-[#d8c3b4] text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-brand hover:text-brand-darker transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <AdvancedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={ArrowRight}
                >
                  Sign In
                </AdvancedButton>
              </form>

              {/* Sign Up */}
              <p className="mt-8 text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-bold text-brand hover:text-brand-darker transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UltraPremiumLogin;
