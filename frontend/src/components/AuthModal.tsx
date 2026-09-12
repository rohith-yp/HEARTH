import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, X, Lock, Mail, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../services/authContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, refreshDashboard } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const res = await apiService.login(email, password);
        if (res.session?.access_token && res.user) {
          login(res.session.access_token, res.user);
          refreshDashboard();
          onClose();
        } else {
          setError('Login failed. Please check your credentials.');
        }
      } else {
        const res = await apiService.signup(email, password);
        if (res.session?.access_token && res.user) {
          login(res.session.access_token, res.user);
          refreshDashboard();
          onClose();
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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="glass-panel rounded-3xl p-8 max-w-md w-full relative border border-ember-500/30 shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ember-600 to-amber-400 flex items-center justify-center shadow-lg shadow-ember-500/40 mb-3">
              <Flame className="w-7 h-7 text-white animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-cinzel">
              {isLogin ? 'Welcome Back to Hearth' : 'Begin Your Hearth Journey'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isLogin
                ? 'Log in to awaken Wick and continue your habits'
                : 'Create an account to kindle your ember companion'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-ember-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-ember-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-ember-600 to-amber-500 hover:from-ember-500 hover:to-amber-400 text-white font-bold shadow-lg shadow-ember-500/30 transition-all duration-300 text-sm mt-2"
            >
              {loading
                ? 'Processing...'
                : isLogin
                ? 'Log In to Hearth'
                : 'Create Account'}
            </button>
          </form>

          {/* Toggle Login/Signup */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-ember-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
