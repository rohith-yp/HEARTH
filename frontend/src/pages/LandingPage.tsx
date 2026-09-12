import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { WickShowcaseSection } from '../components/sections/WickShowcaseSection';
import { HabitsSection } from '../components/sections/HabitsSection';
import { AttributesSection } from '../components/sections/AttributesSection';
import { AiChatSection } from '../components/sections/AiChatSection';
import { CtaSection } from '../components/sections/CtaSection';
import { AuthModal } from '../components/AuthModal';
import { DashboardModal } from '../components/DashboardModal';
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
  const { isAuthenticated, dashboardRefreshTrigger } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

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
      if (res.wick) setWick(res.wick);
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

  return (
    <div className="relative min-h-screen w-full font-sans bg-sky-300 overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        profile={profile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Exact Reference Hero Section */}
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
      <div className="relative z-10 space-y-12">
        <WickShowcaseSection wick={wick} />
        <HabitsSection
          tasks={tasks}
          onCompleteTask={handleCompleteTask}
          onCreateTask={handleCreateTask}
        />
        <AttributesSection profile={profile} attributes={attributes} />
        <AiChatSection onSendChat={handleSendChat} memories={memories} />
        <CtaSection
          onStartJourney={() => {
            if (isAuthenticated) {
              setIsDashboardOpen(true);
            } else {
              setIsAuthOpen(true);
            }
          }}
        />
      </div>

      {/* Login / Register Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

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
