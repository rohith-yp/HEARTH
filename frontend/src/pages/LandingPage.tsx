import React, { useState, useEffect, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { WickShowcaseSection } from '../components/sections/WickShowcaseSection';
import { HabitsSection } from '../components/sections/HabitsSection';
import { AttributesSection } from '../components/sections/AttributesSection';
import { AiChatSection } from '../components/sections/AiChatSection';
import { CtaSection } from '../components/sections/CtaSection';
import { AuthModal } from '../components/AuthModal';
import { DashboardModal } from '../components/DashboardModal';
import { WelcomeModal } from '../components/WelcomeModal';
import { WickEvolutionModal } from '../components/WickEvolutionModal';
import { HearthWorld } from '../components/scene/HearthWorld';
import { HeroImageBackground } from '../components/scene/HeroImageBackground';
import { useAuth } from '../services/authContext';
import {
  apiService,
  UserProfile,
  WickState,
  Attribute,
  TaskItem,
  MemoryItem,
  CompleteTaskResponse,
} from '../services/api';

const DEMO_PROFILE: UserProfile = {
  id: 'demo',
  username: 'wanderer',
  display_name: 'Wanderer',
  total_xp: 250,
  coins: 45,
  current_streak: 3,
  longest_streak: 5,
};

const DEMO_WICK: WickState = {
  stage: 'Ember',
  mood: 'happy',
  energy: 85,
  bond: 40,
};

const DEMO_ATTRIBUTES: Attribute[] = [
  { name: 'Focus', level: 2, xp: 140 },
  { name: 'Health', level: 1, xp: 60 },
  { name: 'Knowledge', level: 3, xp: 210 },
  { name: 'Discipline', level: 2, xp: 120 },
  { name: 'Creativity', level: 1, xp: 80 },
];

const DEMO_TASKS: TaskItem[] = [
  {
    id: 'demo-1',
    title: 'Complete 30 mins focused deep work',
    category: 'Work',
    attribute_name: 'Focus',
    xp_reward: 10,
    coin_reward: 5,
    completed: false,
  },
  {
    id: 'demo-2',
    title: 'Morning 15-min mindfulness stretch',
    category: 'Wellness',
    attribute_name: 'Health',
    xp_reward: 10,
    coin_reward: 5,
    completed: false,
  },
  {
    id: 'demo-3',
    title: 'Read 2 chapters of personal growth book',
    category: 'Learning',
    attribute_name: 'Knowledge',
    xp_reward: 10,
    coin_reward: 5,
    completed: true,
  },
];

const DEMO_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    memory: 'User started their journey and kindled Wick.',
    importance: 5,
    created_at: new Date().toISOString(),
  },
];

export const LandingPage: React.FC = () => {
  const { isAuthenticated, dashboardRefreshTrigger, theme } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const [evolutionData, setEvolutionData] = useState<{
    isOpen: boolean;
    oldStage: string;
    newStage: string;
  }>({ isOpen: false, oldStage: 'Spark', newStage: 'Ember' });

  // Real backend data state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wick, setWick] = useState<WickState | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBackendData = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(DEMO_PROFILE);
      setWick(DEMO_WICK);
      setAttributes(DEMO_ATTRIBUTES);
      setTasks(DEMO_TASKS);
      setMemories(DEMO_MEMORIES);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [dash, taskRes, memRes] = await Promise.all([
        apiService.getDashboard(),
        apiService.getTasks(),
        apiService.getMemories(),
      ]);
      setProfile(dash.profile);
      setWick(dash.wick);
      setAttributes(dash.attributes);
      setTasks(taskRes.tasks);
      setMemories(memRes.memories);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to connect to backend');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData, dashboardRefreshTrigger]);

  const handleCreateTask = async (data: {
    title: string;
    description?: string;
    category?: string;
    attribute_name?: string;
    due_date?: string;
  }) => {
    if (!isAuthenticated) {
      const newTask: TaskItem = {
        id: `demo-${Date.now()}`,
        title: data.title,
        category: data.category,
        attribute_name: data.attribute_name,
        xp_reward: 10,
        coin_reward: 5,
        completed: false,
      };
      setTasks((prev) => [newTask, ...prev]);
      return;
    }

    const res = await apiService.createTask(data);
    if (res.task) {
      setTasks((prev) => [res.task, ...prev]);
    }
  };

  const handleCompleteTask = async (taskId: string): Promise<CompleteTaskResponse | null> => {
    const oldStage = wick?.stage || 'Spark';

    if (!isAuthenticated) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );
      setProfile((prev) =>
        prev ? { ...prev, total_xp: prev.total_xp + 10, coins: prev.coins + 5 } : prev
      );
      return null;
    }

    const res = await apiService.completeTask(taskId);
    if (res) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? res.task : t)));
      if (res.progression) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                total_xp: res.progression.total_xp,
                coins: res.progression.coins,
                current_streak: res.progression.current_streak,
                longest_streak: res.progression.longest_streak,
              }
            : prev
        );
      }
      if (res.wick) {
        setWick(res.wick);
        if (res.wick.stage && res.wick.stage.toLowerCase() !== oldStage.toLowerCase()) {
          setEvolutionData({
            isOpen: true,
            oldStage,
            newStage: res.wick.stage,
          });
        }
      }
      if (res.attribute) {
        setAttributes((prev) =>
          prev.map((a) => (a.name === res.attribute?.name ? res.attribute! : a))
        );
      }
      fetchBackendData();
    }
    return res;
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!isAuthenticated) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return;
    }
    await apiService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleSendChat = async (msg: string): Promise<string | null> => {
    if (!isAuthenticated) {
      return "Log in to connect Wick to the Groq AI engine for full natural responses!";
    }
    const res = await apiService.chatWithWick(msg);
    if (res.wick) setWick(res.wick);
    return res.response;
  };

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const isNight = theme === 'dark';

  return (
    <div
      className={`relative min-h-screen w-full font-sans transition-colors duration-700 overflow-x-hidden selection:bg-amber-500 selection:text-white ${
        isNight
          ? 'bg-gradient-to-b from-[#0c0a17] via-[#151124] via-[#1b152d] to-[#120d20] text-amber-100'
          : 'bg-gradient-to-b from-amber-100/50 via-orange-50/60 via-amber-50/80 to-amber-100/40 text-slate-800'
      }`}
    >
      {/* Hero Section */}
      <HeroSection
        onStartJourney={() => {
          if (isAuthenticated) {
            setIsDashboardOpen(true);
          } else {
            setIsAuthOpen(true);
          }
        }}
        onWatchDemo={() => handleNavigate('features')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onNavigate={handleNavigate}
        isAuthenticated={isAuthenticated}
      />

      {/* Scrollable Story Sections */}
      <div className="relative z-10 space-y-16 pb-16">
        <WickShowcaseSection wick={wick} profile={profile} />
        <HabitsSection
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onCreateTask={handleCreateTask}
        />
        <AttributesSection profile={profile} attributes={attributes} />
        <AiChatSection onSendChat={handleSendChat} memories={memories} />
        <CtaSection
          isAuthenticated={isAuthenticated}
          onStartJourney={() => {
            if (isAuthenticated) {
              setIsDashboardOpen(true);
            } else {
              setIsAuthOpen(true);
            }
          }}
          onOpenDashboard={() => setIsDashboardOpen(true)}
        />

      </div>

      {/* Full-Width Real Footer Section */}
      <footer className="relative z-10 w-full bg-[#f5eedf]/95 dark:bg-[#080612]/95 border-t border-amber-300/70 dark:border-amber-500/20 backdrop-blur-md pt-16 pb-12 px-6 sm:px-12 lg:px-16 pointer-events-auto transition-colors duration-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Brand Information */}
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-md">
                  <Flame className="w-5 h-5 text-slate-950" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel tracking-wider">
                  HEARTH
                </h4>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-amber-200/90 max-w-md leading-relaxed">
                A warm RPG habit-building companion for everyday mindfulness, focus, and personal growth. Better Habits, Brighter Days.
              </p>
            </div>

            {/* Quick Links Column 1 */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-widest">
                Explore
              </h5>
              <ul className="space-y-2 text-sm font-bold text-slate-800 dark:text-amber-100">
                <li>
                  <button
                    onClick={() => handleNavigate('journey')}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    Journey Companion
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('features')}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    Habits & Quests
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('features')}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    Life Attributes
                  </button>
                </li>
              </ul>
            </div>

            {/* Quick Links Column 2 */}
            <div className="md:col-span-3 space-y-3">
              <h5 className="text-xs font-extrabold text-amber-900 dark:text-amber-300 uppercase tracking-widest">
                Features
              </h5>
              <ul className="space-y-2 text-sm font-bold text-slate-800 dark:text-amber-100">
                <li>
                  <button
                    onClick={() => handleNavigate('features')}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    AI Chat with Wick
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigate('journey')}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    Evolution Stages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      if (isAuthenticated) setIsDashboardOpen(true);
                      else setIsAuthOpen(true);
                    }}
                    className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
                  >
                    Sanctuary Dashboard
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Divider & Copyright */}
          <div className="border-t border-amber-300/80 dark:border-amber-500/20 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-800 dark:text-amber-200/80">
            <p>© {new Date().getFullYear()} HEARTH. All rights reserved.</p>
            <p className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <span>Kindled with warmth & care</span>
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </p>
          </div>
        </div>
      </footer>

      {/* Login / Register Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(isSignup) => {
          setIsSignupSuccess(isSignup);
          setIsWelcomeOpen(true);
        }}
      />

      {/* Welcome & Guidance Notification Modal */}
      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        profile={profile}
        wick={wick}
        isSignup={isSignupSuccess}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      {/* Cinematic Evolution Transition Modal */}
      <WickEvolutionModal
        isOpen={evolutionData.isOpen}
        oldStage={evolutionData.oldStage}
        newStage={evolutionData.newStage}
        onClose={() =>
          setEvolutionData((prev) => ({ ...prev, isOpen: false }))
        }
      />

      {/* Interactive Sanctuary Dashboard View Modal */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        profile={profile}
        wick={wick}
        attributes={attributes}
        tasks={tasks}
        memories={memories}
        loading={loading}
        error={error}
        onRetry={fetchBackendData}
        onCreateTask={handleCreateTask}
        onCompleteTask={handleCompleteTask}
        onDeleteTask={handleDeleteTask}
        onSendChat={handleSendChat}
      />
    </div>
  );
};
