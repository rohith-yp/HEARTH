import React from 'react';
import { Flame, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { UserProfile } from '../services/api';

interface NavbarProps {
  profile: UserProfile | null;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  onOpenAuth,
  onOpenDashboard,
  activeSection,
  onNavigate,
}) => {
  const { isAuthenticated, logout, user } = useAuth();
  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'Seeker';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-12 py-5 pointer-events-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-ember-500 flex items-center justify-center shadow-lg shadow-ember-500/30 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-widest text-slate-900 font-cinzel">
              HEARTH
            </h1>
            <p className="text-[10px] text-amber-700 font-semibold tracking-wide">
              Life RPG Companion
            </p>
          </div>
        </div>

        {/* Minimal Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-800">
          {[
            { id: 'home', label: 'Home' },
            { id: 'features', label: 'Features' },
            { id: 'journey', label: 'Journey' },
            { id: 'about', label: 'About' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative transition-colors hover:text-ember-600 ${
                activeSection === item.id ? 'text-slate-950 font-bold' : 'text-slate-700'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-950 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Auth Action Pill Button */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="px-4 py-2 rounded-full bg-slate-950 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-ember-500" />
                <span>Dashboard ({displayName})</span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-full bg-white/80 hover:bg-white text-rose-600 border border-slate-200 transition-all text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-md font-semibold text-xs sm:text-sm transition-all hover:scale-105"
            >
              <UserIcon className="w-4 h-4 text-slate-700" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
