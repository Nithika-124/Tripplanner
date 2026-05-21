import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import API from "../../api/api";

export function AuthModal({ isOpen, onClose, onLoginSuccess, initialTab = "signin" }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError("");
      setSuccess("");
      setFullName("");
      setEmail("");
      setPassword("");
    }
  }, [isOpen, initialTab]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (activeTab === "signup" && !fullName) {
      setError("Please enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (activeTab === "login") {
        // Sign In Flow
        const response = await API.post("/auth/login", { email, password });
        const { token, user } = response.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        setSuccess("Successfully logged in! Redirecting...");
        setTimeout(() => {
          onLoginSuccess(user);
          onClose();
        }, 1500);
      } else {
        // Sign Up Flow
        await API.post("/auth/register", { fullName, email, password });
        setSuccess("Account created successfully! Switching to Sign In...");

        // Auto-switch to Sign In tab after registration
        setTimeout(() => {
          setActiveTab("login");
          setPassword("");
          setError("");
          setSuccess("");
          setLoading(false);
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please check your credentials and try again."
      );
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Blur Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden z-10 flex flex-col p-8 sm:p-10"
          >
            {/* Ambient Background Glow (sleek details) */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all duration-200"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Brand Logo / Welcome */}
            <div className="text-center mb-6">
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                Welcome to TripPlanner
              </span>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                {activeTab === "signin" ? "Adventure Awaits!" : "Start Your Journey"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === "signin"
                  ? "Sign in to access your curated plans and get travel ideas."
                  : "Create an account to begin planning and saving dream destinations."}
              </p>
            </div>

            {/* Glassmorphic Tabs */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-6 relative">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signin");
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${activeTab === "signin"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setError("");
                  setSuccess("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative z-10 ${activeTab === "signup"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
                  }`}
              >
                Sign Up
              </button>

              {/* Animated Tab Selector Background */}
              <motion.div
                layout
                className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-slate-900 rounded-xl shadow-md"
                animate={{
                  x: activeTab === "signin" ? "0%" : "100%",
                }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            </div>

            {/* Error / Success Notifications */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center gap-2 p-3.5 mb-5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-600 dark:text-red-400 text-xs font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="flex items-center gap-2 p-3.5 mb-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-medium"
                >
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (Sign Up only) */}
              <AnimatePresence>
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/50 transition-all text-sm"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@email.com"
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/50 transition-all text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  {activeTab === "signin" && (
                    <button
                      type="button"
                      className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                      onClick={() => alert("Password reset functionality isn't implemented in this walkthrough.")}
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-11 pr-11 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:ring-blue-400/50 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2 rounded-full transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {activeTab === "signin" ? "Sign In to Account" : "Create Travel Account"}
                  </span>
                )}
              </motion.button>
            </form>

            {/* Switch Mode Footer */}
            <div className="text-center mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activeTab === "signin"
                  ? "New to TripPlanner?"
                  : "Already have a travel account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(activeTab === "signin" ? "signup" : "signin");
                    setError("");
                    setSuccess("");
                  }}
                  className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                >
                  {activeTab === "signin" ? "Create an Account" : "Sign In Here"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
