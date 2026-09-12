import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Sparkles,
  RefreshCw,
  Tag,
  Flame,
  Coins,
  Check,
} from 'lucide-react';
import { TaskItem, CompleteTaskResponse } from '../services/api';

interface TaskListPanelProps {
  tasks: TaskItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onCreateTask: (data: {
    title: string;
    description?: string;
    category?: string;
    attribute_name?: string;
    due_date?: string;
  }) => Promise<void>;
  onCompleteTask: (taskId: string) => Promise<CompleteTaskResponse | null>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export const TaskListPanel: React.FC<TaskListPanelProps> = ({
  tasks,
  loading,
  error,
  onRetry,
  onCreateTask,
  onCompleteTask,
  onDeleteTask,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newAttribute, setNewAttribute] = useState('Focus');
  const [submitting, setSubmitting] = useState(false);

  // Optimistic completing set
  const [completingTaskIds, setCompletingTaskIds] = useState<Set<string>>(new Set());

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || submitting) return;

    try {
      setSubmitting(true);
      await onCreateTask({
        title: newTitle.trim(),
        category: newCategory.trim() || undefined,
        attribute_name: newAttribute || undefined,
      });
      setNewTitle('');
      setNewCategory('');
      setIsAdding(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (task: TaskItem) => {
    if (task.completed || completingTaskIds.has(task.id)) return;

    // Optimistic UI state update
    setCompletingTaskIds((prev) => new Set(prev).add(task.id));

    try {
      await onCompleteTask(task.id);
    } catch (err) {
      // Revert optimistic state on failure
      setCompletingTaskIds((prev) => {
        const next = new Set(prev);
        next.delete(task.id);
        return next;
      });
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const isCompleted = t.completed || completingTaskIds.has(t.id);
    if (filter === 'pending') return !isCompleted;
    if (filter === 'completed') return isCompleted;
    return true;
  });

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 pointer-events-auto min-h-[380px]">
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 rounded-lg skeleton-shimmer" />
          <div className="h-8 w-24 rounded-xl skeleton-shimmer" />
        </div>
        <div className="space-y-3 my-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 w-full rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center pointer-events-auto min-h-[380px]">
        <p className="text-sm text-rose-400 font-medium mb-3">Failed to load tasks</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:bg-rose-500/30 transition-all text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-3xl p-6 pointer-events-auto flex flex-col gap-4"
    >
      {/* Panel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-ember-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-cinzel">
            Habits & Daily Tasks
          </h3>
        </div>

        {/* Filter Pills & Add Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 text-xs font-semibold">
            {(['pending', 'all', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg capitalize transition-all ${
                  filter === tab
                    ? 'bg-ember-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-2 rounded-xl bg-ember-500 hover:bg-ember-400 text-white transition-all shadow-md shadow-ember-500/30"
            title="Create Task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Add Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="glass-card rounded-2xl p-4 flex flex-col gap-3 border border-ember-500/30 overflow-hidden"
          >
            <input
              type="text"
              placeholder="What task or habit will you conquer?"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
              className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/50 rounded-xl px-3.5 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-ember-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Category (e.g. Work, Health)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-ember-500"
              />
              <select
                value={newAttribute}
                onChange={(e) => setNewAttribute(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700/50 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-ember-500"
              >
                <option value="Focus">Focus (+10 XP)</option>
                <option value="Health">Health (+10 XP)</option>
                <option value="Knowledge">Knowledge (+10 XP)</option>
                <option value="Discipline">Discipline (+10 XP)</option>
                <option value="Creativity">Creativity (+10 XP)</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-1.5 rounded-xl bg-ember-500 hover:bg-ember-400 text-white text-xs font-semibold shadow-md"
              >
                {submitting ? 'Creating...' : 'Add Task'}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Task List */}
      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            <p>No tasks match this view.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Add a task above to earn XP and nourish Wick!
            </p>
          </div>
        ) : (
          filteredTasks.map((t) => {
            const isDone = t.completed || completingTaskIds.has(t.id);
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass-card rounded-2xl p-3.5 flex items-center justify-between gap-3 border transition-all ${
                  isDone
                    ? 'opacity-60 bg-slate-900/20 border-slate-800'
                    : 'hover:border-ember-500/40 border-slate-700/30'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleComplete(t)}
                    disabled={isDone}
                    className={`transition-colors flex-shrink-0 ${
                      isDone
                        ? 'text-emerald-500'
                        : 'text-slate-400 hover:text-ember-500'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-semibold truncate ${
                        isDone
                          ? 'line-through text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {t.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      {t.category && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                          {t.category}
                        </span>
                      )}
                      {t.attribute_name && (
                        <span className="text-amber-400 font-medium">
                          {t.attribute_name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Rewards & Delete */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5" />
                    <span>+{t.xp_reward} XP</span>
                  </div>

                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};
