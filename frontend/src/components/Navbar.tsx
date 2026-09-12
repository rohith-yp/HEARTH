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
    <header className="fixed top-0 left-0 right-0 z-40 px-6 lg:px-14 py-3.5 pointer-events-auto bg-[#3a82ce] shadow-md border-b border-white/15">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Title (Left) */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-ember-500 flex items-center justify-center shadow-lg shadow-ember-500/40 group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white fill-white/20" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white font-cinzel drop-shadow-md">
              HEARTH
            </h1>
            <p className="text-[10px] text-sky-100 font-medium tracking-wide drop-shadow">
              Life RPG Companion
            </p>
          </div>
        </div>

        {/* Minimal Nav Links (Center/Right) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white drop-shadow-md">
          {[
            { id: 'home', label: 'Home' },
            { id: 'features', label: 'Features' },
            { id: 'journey', label: 'Journey' },
            { id: 'about', label: 'About' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative py-1 transition-colors hover:text-amber-200 ${
                activeSection === item.id ? 'text-white font-bold' : 'text-white/90'
              }`}
            >
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white rounded-full shadow-sm" />
              )}
            </button>
          ))}
        </nav>

        {/* Auth Action Pill Button (Right) */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenDashboard}
                className="px-5 py-2 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-lg transition-all hover:scale-105 flex items-center gap-2"
              >
                <Flame className="w-4 h-4 text-ember-500" />
                <span>Dashboard ({displayName})</span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 rounded-full bg-white/90 hover:bg-white text-rose-600 shadow-md transition-all text-xs font-semibold"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-slate-900 shadow-lg font-bold text-xs sm:text-sm transition-all hover:scale-105"
            >
              <UserIcon className="w-4 h-4 text-slate-800" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
