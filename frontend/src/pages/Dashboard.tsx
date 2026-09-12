import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, CheckCircle, Trophy, UserPlus } from 'lucide-react';
import { Header } from '../components/Header';
import { XpGrowthPanel } from '../components/XpGrowthPanel';
import { TaskListPanel } from '../components/TaskListPanel';
import { WickJourneyPanel } from '../components/WickJourneyPanel';
import { AuthModal } from '../components/AuthModal';
import { ForestScene } from '../components/three/ForestScene';
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

// Fallback guest demo data for unauthenticated mode
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
  {
    id: 'mem-2',
    memory: "User completed the task 'Read 2 chapters of personal growth book'.",
    importance: 2,
    created_at: new Date().toISOString(),
  },
];

export const DashboardPage: React.FC = () => {
  const { theme, isAuthenticated, dashboardRefreshTrigger } = useAuth();

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Real API State
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wick, setWick] = useState<WickState | null>(null);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);

  // Loading & Error states per panel
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);

  const [memoriesLoading, setMemoriesLoading] = useState(false);
  const [memoriesError, setMemoriesError] = useState<string | null>(null);

  // Latest AI response notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Dashboard Profile, Wick, Attributes
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) {
      setProfile(DEMO_PROFILE);
      setWick(DEMO_WICK);
      setAttributes(DEMO_ATTRIBUTES);
      return;
    }

    setDashboardLoading(true);
    setDashboardError(null);

    try {
      const data = await apiService.getDashboard();
      setProfile(data.profile);
      setWick(data.wick);
      setAttributes(data.attributes);
    } catch (err: any) {
      setDashboardError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setDashboardLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Tasks
  const fetchTasksData = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks(DEMO_TASKS);
      return;
    }

    setTasksLoading(true);
    setTasksError(null);

    try {
      const data = await apiService.getTasks();
      setTasks(data.tasks);
    } catch (err: any) {
      setTasksError(err.response?.data?.detail || 'Failed to load tasks');
    } finally {
      setTasksLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch Memories
  const fetchMemoriesData = useCallback(async () => {
    if (!isAuthenticated) {
      setMemories(DEMO_MEMORIES);
      return;
    }

    setMemoriesLoading(true);
    setMemoriesError(null);

    try {
      const data = await apiService.getMemories();
      setMemories(data.memories);
    } catch (err: any) {
      setMemoriesError(err.response?.data?.detail || 'Failed to load memories');
    } finally {
      setMemoriesLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
    fetchTasksData();
    fetchMemoriesData();
  }, [fetchDashboardData, fetchTasksData, fetchMemoriesData, dashboardRefreshTrigger]);

  // Task creation handler
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

  // Task completion handler
  const handleCompleteTask = async (taskId: string): Promise<CompleteTaskResponse | null> => {
    if (!isAuthenticated) {
      // Demo complete
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
      );
      setProfile((prev) =>
        prev ? { ...prev, total_xp: prev.total_xp + 10, coins: prev.coins + 5 } : prev
      );
      setToastMessage("Wick glows brighter from your achievement!");
      setTimeout(() => setToastMessage(null), 4000);
      return null;
    }

    const res = await apiService.completeTask(taskId);
    if (res) {
      // Update local state from server authoritative response
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? res.task : t))
      );
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
      }
      if (res.attribute) {
        setAttributes((prev) =>
          prev.map((a) => (a.name === res.attribute?.name ? res.attribute! : a))
        );
      }
      if (res.wick_response) {
        setToastMessage(res.wick_response);
        setTimeout(() => setToastMessage(null), 5000);
      }
      fetchMemoriesData();
    }
    return res;
  };

  // Task deletion handler
  const handleDeleteTask = async (taskId: string) => {
    if (!isAuthenticated) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      return;
    }
    await apiService.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Chat with Wick handler
  const handleSendChat = async (msg: string): Promise<string | null> => {
    if (!isAuthenticated) {
      return "Log in to connect Wick to the Groq AI engine for full natural responses!";
    }
    const res = await apiService.chatWithWick(msg);
    if (res.wick) {
      setWick(res.wick);
    }
    return res.response;
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans transition-colors duration-1000">
      {/* 3D Background R3F Forest Scene */}
      <ForestScene
        theme={theme}
        mood={wick?.mood}
        energy={wick?.energy}
        stage={wick?.stage}
      />

      {/* Header Bar */}
      <Header profile={profile} onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Guest Mode Banner */}
      {!isAuthenticated && (
        <div className="w-full px-4 sm:px-8 pt-2 pointer-events-auto z-30">
          <div className="max-w-7xl mx-auto glass-panel rounded-2xl px-6 py-2.5 flex items-center justify-between border-amber-500/30 bg-amber-500/10">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
              <Sparkles className="w-4 h-4" />
              <span>Preview Mode: You are exploring Hearth as a guest.</span>
            </div>
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-md transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Log in to Save Progress</span>
            </button>
          </div>
        </div>
      )}

      {/* Notification Toast for Wick AI response */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 glass-panel border border-amber-500/40 rounded-2xl px-6 py-3 shadow-2xl flex items-center gap-3 bg-forest-950/90 max-w-lg"
          >
            <div className="w-8 h-8 rounded-full bg-ember-500/20 flex items-center justify-center text-ember-500">
              <Flame className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider block">
                Wick says:
              </span>
              <p className="text-xs text-slate-100 italic">"{toastMessage}"</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dashboard Floating Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-8 py-6 z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: XP & Growth */}
        <div className="lg:col-span-1">
          <XpGrowthPanel
            profile={profile}
            attributes={attributes}
            loading={dashboardLoading}
            error={dashboardError}
            onRetry={fetchDashboardData}
          />
        </div>

        {/* Center Column: Task List */}
        <div className="lg:col-span-1">
          <TaskListPanel
            tasks={tasks}
            loading={tasksLoading}
            error={tasksError}
            onRetry={fetchTasksData}
            onCreateTask={handleCreateTask}
            onCompleteTask={handleCompleteTask}
            onDeleteTask={handleDeleteTask}
          />
        </div>

        {/* Right Column: Wick's Journey & AI Companion */}
        <div className="lg:col-span-1">
          <WickJourneyPanel
            wick={wick}
            memories={memories}
            loading={dashboardLoading || memoriesLoading}
            error={dashboardError || memoriesError}
            onRetry={() => {
              fetchDashboardData();
              fetchMemoriesData();
            }}
            onSendChat={handleSendChat}
            latestWickResponse={toastMessage}
          />
        </div>
      </main>

      {/* Auth Login/Signup Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};
