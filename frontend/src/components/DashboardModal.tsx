import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Sparkles, LogOut } from 'lucide-react';
import { useAuth } from '../services/authContext';
import { XpGrowthPanel } from './XpGrowthPanel';
import { TaskListPanel } from './TaskListPanel';
import { WickJourneyPanel } from './WickJourneyPanel';
import {
  UserProfile,
  WickState,
  Attribute,
  TaskItem,
  MemoryItem,
  CompleteTaskResponse,
} from '../services/api';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  wick: WickState | null;
  attributes: Attribute[];
  tasks: TaskItem[];
  memories: MemoryItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreateTask: (data: any) => Promise<any>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResponse | null>;
  onDeleteTask: (taskId: string) => Promise<any>;
  onSendChat: (msg: string) => Promise<string | null>;
}

export const DashboardModal: React.FC<DashboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  wick,
  attributes,
  tasks,
  memories,
  loading,
  error,
  onRetry,
  onCreateTask,
  onCompleteTask,
  onDeleteTask,
  onSendChat,
}) => {
  const { logout } = useAuth();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 max-w-6xl w-full relative border border-amber-300/80 dark:border-amber-500/30 shadow-2xl my-auto bg-[#fdfbf7]/95 dark:bg-forest-950/90 text-slate-900 dark:text-white max-h-[90vh] overflow-y-auto"
        >
          {/* Header Action Buttons (Logout & Close) */}
          <div className="absolute top-6 right-6 flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              title="Log Out of Hearth"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-300 border border-rose-500/30 font-bold text-xs transition-all hover:scale-105"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-ember-500 flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-cinzel text-slate-900 dark:text-white">
                Hearth Sanctuary Dashboard
              </h2>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-bold">
                Your Sanctuary · Habits, Progression & Companion Journal
              </p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <XpGrowthPanel
              profile={profile}
              attributes={attributes}
              loading={loading}
              error={error}
              onRetry={onRetry}
            />

            <TaskListPanel
              tasks={tasks}
              loading={loading}
              error={error}
              onRetry={onRetry}
              onCreateTask={onCreateTask}
              onCompleteTask={onCompleteTask}
              onDeleteTask={onDeleteTask}
            />

            <WickJourneyPanel
              wick={wick}
              memories={memories}
              loading={loading}
              error={error}
              totalXp={profile?.total_xp}
              onRetry={onRetry}
              onSendChat={onSendChat}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
