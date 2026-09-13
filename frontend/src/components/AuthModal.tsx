import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Lock, Mail, AlertCircle, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../services/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (isSignup: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, refreshDashboard } = useAuth();

  if (!isOpen) return null;

  // Validation functions
  const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isValidPassword = (val: string) => val.length >= 6;
  const isPasswordMatching = (pass: string, confirm: string) => pass === confirm;

  // Compute password strength for signup
  const getPasswordStrength = (val: string) => {
    if (!val) return { score: 0, label: '', color: 'bg-slate-700' };
    if (val.length < 6) return { score: 1, label: 'Weak (min 6 chars)', color: 'bg-rose-500' };
    
    let score = 2;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score = 3;
    if (/[^A-Za-z0-9]/.test(val) && score >= 2) score = 4;

    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-emerald-400' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const emailError = emailTouched && !isValidEmail(email) ? 'Please enter a valid email address.' : null;
  const passwordError =
    !isLogin && passwordTouched && !isValidPassword(password)
      ? 'Password must be at least 6 characters.'
      : null;
  const confirmError =
    !isLogin && confirmTouched && !isPasswordMatching(password, confirmPassword)
      ? 'Passwords do not match.'
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Mark fields touched
    setEmailTouched(true);
    setPasswordTouched(true);
    if (!isLogin) setConfirmTouched(true);

    // Perform validation check
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLogin) {
      if (!isValidPassword(password)) {
        setError('Password must be at least 6 characters long.');
        return;
      }
      if (!isPasswordMatching(password, confirmPassword)) {
        setError('Passwords do not match. Please verify your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        const res = await apiService.login(email, password);
        if (res.session?.access_token && res.user) {
          login(res.session.access_token, res.user);
          refreshDashboard();
          onClose();
          if (onSuccess) onSuccess(false);
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        const res = await apiService.signup(email, password);
        if (res.session?.access_token && res.user) {
          login(res.session.access_token, res.user);
          refreshDashboard();
          onClose();
          if (onSuccess) onSuccess(true);
        } else {
          setError('Account created! Please log in with your credentials.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          'Authentication failed. Please check email and password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchTab = (toLogin: boolean) => {
    setIsLogin(toLogin);
    setError(null);
    setEmailTouched(false);
    setPasswordTouched(false);
    setConfirmTouched(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-panel rounded-3xl p-8 max-w-md w-full relative border border-amber-300/80 dark:border-amber-500/30 shadow-2xl bg-white/95 dark:bg-[#140e24]/95 text-slate-900 dark:text-white my-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ember-600 to-amber-400 flex items-center justify-center shadow-md mb-3">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-cinzel">
              {isLogin ? 'Welcome Back to Hearth' : 'Begin Your Hearth Journey'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-amber-200/80 font-medium mt-1">
              {isLogin
                ? 'Log in to awaken Wick and continue your habits'
                : 'Create an account to kindle your ember companion'}
            </p>
          </div>

          {/* Tab Selection Switcher */}
          <div className="flex rounded-xl bg-amber-100/80 dark:bg-slate-900/90 p-1 mb-5 border border-amber-300/70 dark:border-amber-500/30">
            <button
              type="button"
              onClick={() => handleSwitchTab(true)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-ember-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchTab(false)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-ember-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Top Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-amber-100">
                  Email Address
                </label>
                {emailTouched && isValidEmail(email) && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid email
                  </span>
                )}
              </div>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  className={`w-full bg-amber-50/50 dark:bg-slate-900/90 border rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors font-medium ${
                    emailError
                      ? 'border-rose-500 focus:border-rose-400'
                      : emailTouched && isValidEmail(email)
                      ? 'border-emerald-500/60 focus:border-emerald-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
              </div>
              {emailError && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-800 dark:text-amber-100">
                  Password
                </label>
                {!isLogin && password && (
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    Strength: <span className="text-amber-700 dark:text-amber-400 font-bold">{strength.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  className={`w-full bg-amber-50/50 dark:bg-slate-900/90 border rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors font-medium ${
                    passwordError
                      ? 'border-rose-500 focus:border-rose-400'
                      : 'border-slate-300 dark:border-slate-700 focus:border-amber-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-2.5 p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:bg-amber-500/20 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Strength Bar for Signup */}
              {!isLogin && password.length > 0 && (
                <div className="mt-1.5 space-y-1">
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {passwordError && (
                <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3 h-3" /> {passwordError}
                </p>
              )}
            </div>

            {/* Confirm Password Field (Only on Signup) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-amber-100 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={() => setConfirmTouched(true)}
                    className={`w-full bg-amber-50/50 dark:bg-slate-900/90 border rounded-xl pl-10 pr-12 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none transition-colors font-medium ${
                      confirmError
                        ? 'border-rose-500 focus:border-rose-400'
                        : confirmTouched && isPasswordMatching(password, confirmPassword)
                        ? 'border-emerald-500/60 focus:border-emerald-400'
                        : 'border-slate-300 dark:border-slate-700 focus:border-amber-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-2.5 p-1 rounded-lg text-amber-600 dark:text-amber-400 hover:text-amber-500 hover:bg-amber-500/20 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {confirmError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3 h-3" /> {confirmError}
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-ember-600 to-amber-500 hover:from-ember-500 hover:to-amber-400 text-white font-bold shadow-md transition-all duration-300 text-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Processing...</span>
              ) : isLogin ? (
                <span>Log In to Hearth</span>
              ) : (
                <span>Create & Kindle Account</span>
              )}
            </button>
          </form>

          {/* Toggle Login/Signup footer line */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => handleSwitchTab(!isLogin)}
              className="text-amber-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
