import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield, ArrowRight } from "lucide-react";
import AdvancedInput from "@components/ui/AdvancedInput";
import AdvancedButton from "@components/ui/AdvancedButton";
import { toast } from "@components/ui/Toaster";
import TaskIllustration from "@components/ui/TaskIllustration";
import { useAuth } from "@hooks/useAuth";
import BrandLogo from "@components/ui/BrandLogo";

const strengthConfig = [
  { label: "Weak", color: "bg-red-500", textColor: "text-red-600" },
  { label: "Fair", color: "bg-orange-400", textColor: "text-orange-600" },
  { label: "Good", color: "bg-blue-500", textColor: "text-blue-600" },
  { label: "Strong", color: "bg-green-500", textColor: "text-green-600" },
];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^a-zA-Z\d]/.test(pw)) s++;
  return s;
};

const UltraPremiumSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  const navigate = useNavigate();
  const { register } = useAuth();

  const strength = form.password ? getStrength(form.password) : 0;
  const cfg = strengthConfig[strength - 1] || strengthConfig[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const result = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      if (result.success) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
      } else {
        const msg = result.error || "Registration failed";
        toast.error(msg);
        setErrorMessage(msg);
      }
    } catch (err) {
      const msg = "Something went wrong. Please try again.";
      toast.error(msg);
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#f7e3cf] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#efbf91]/30 rounded-full blur-3xl opacity-60 animate-float" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-[#13856f]/10 rounded-full blur-3xl opacity-80 animate-float animation-delay-400" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.12)]"
      >
        <div className="grid min-h-[640px] lg:grid-cols-2">
          {/* LEFT – illustration (same as login) */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[linear-gradient(180deg,_#fff6ee_0%,_#ffe7d6_100%)] p-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/50 rounded-full" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#13856f]/10 rounded-full" />

            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="relative z-10"
            >
              <BrandLogo />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 flex flex-1 items-center justify-center py-6"
            >
              <TaskIllustration />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="relative z-10 text-center"
            >
              <p className="text-slate-900 font-semibold text-lg leading-snug">
                Start your journey with
                <br />
                TaskFlow today — it’s free
              </p>
              <div className="flex justify-center gap-2 mt-4">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${i === 1 ? "w-6 bg-[#13856f]" : "w-2 bg-[#d8c3b4]"}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT – form */}
          <div className="flex flex-col justify-center px-10 py-8 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.3,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-5">
                <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">
                  Create Account
                </h2>
                <p className="text-gray-500">Start your free trial today</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <AdvancedInput
                    type="text"
                    placeholder="Enter your full name"
                    icon={User}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <AdvancedInput
                    type="email"
                    placeholder="Enter your email"
                    icon={Mail}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <AdvancedInput
                    type="password"
                    placeholder="Create a password"
                    icon={Lock}
                    showPasswordToggle
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                  />
                  {form.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5"
                    >
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map((lvl) => (
                          <div
                            key={lvl}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${lvl <= strength ? cfg.color : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                      <p className={`text-xs font-semibold ${cfg.textColor}`}>
                        {cfg.label} password
                      </p>
                    </motion.div>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <AdvancedInput
                    type="password"
                    placeholder="Confirm your password"
                    icon={Lock}
                    showPasswordToggle
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    validation={(v) => v === form.password}
                    error={
                      form.confirm && form.confirm !== form.password
                        ? "Passwords do not match"
                        : ""
                    }
                    required
                  />
                </div>

                {/* Role selector */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Select Role
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["user", "admin"].map((role) => (
                      <motion.button
                        key={role}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setForm({ ...form, role })}
                        className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-all duration-200 ${
                          form.role === role
                            ? "border-[#13856f] bg-[#e8f6f2]"
                            : "border-gray-200 bg-gray-50 hover:border-[#d8c3b4]"
                        }`}
                      >
                        <Shield
                          className={`w-5 h-5 ${form.role === role ? "text-[#13856f]" : "text-gray-400"}`}
                        />
                        <span
                          className={`text-sm font-semibold capitalize ${form.role === role ? "text-[#13856f]" : "text-gray-600"}`}
                        >
                          {role}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <AdvancedButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={ArrowRight}
                >
                  Create Account
                </AdvancedButton>
                {errorMessage && (
                  <p className="mt-2 text-sm text-red-600" role="alert">{errorMessage}</p>
                )}
              </form>

              <p className="mt-4 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-[#13856f] hover:text-[#0c6c59] transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default UltraPremiumSignup;
