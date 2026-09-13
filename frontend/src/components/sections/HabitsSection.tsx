import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Plus, Sparkles, Flame } from 'lucide-react';
import { TaskItem } from '../../services/api';

interface HabitsSectionProps {
  tasks: TaskItem[];
  onCompleteTask: (taskId: string) => Promise<any>;
  onCreateTask: (data: { title: string; category?: string; attribute_name?: string }) => Promise<any>;
}

export const HabitsSection: React.FC<HabitsSectionProps> = ({
  tasks,
  onCompleteTask,
  onCreateTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onCreateTask({ title: newTitle.trim(), attribute_name: 'Focus' });
      setNewTitle('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="features" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-500/20 border border-amber-300/70 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-sm mb-4">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Turn Actions Into Progress</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel leading-tight drop-shadow-sm">
            Every Task Nourishes Your Companion.
          </h2>
          <p className="text-base text-slate-700 dark:text-amber-100/90 font-medium mt-4 leading-relaxed">
            Completing habits is no longer a chore. Every completed action awards XP, coins, streak momentum, and attribute levels while raising Wick's energy and bond.
          </p>
        </motion.div>

        {/* Right Interactive Task List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/85 dark:bg-[#18132b]/85 border border-amber-200/60 dark:border-amber-500/25 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300"
        >
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add a new habit or daily quest..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-white dark:bg-[#110e1f] border border-amber-200/80 dark:border-amber-500/30 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-amber-100 placeholder-slate-400 dark:placeholder-amber-200/50 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-2xl bg-amber-600 dark:bg-amber-500 hover:bg-amber-700 dark:hover:bg-amber-400 text-white dark:text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-center text-slate-500 dark:text-amber-200/70 text-xs py-8 font-medium">
                No tasks yet. Add one above to experience RPG progression!
              </p>
            ) : (
              tasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    t.completed
                      ? 'bg-amber-50/60 dark:bg-[#151124]/80 border-amber-200/40 dark:border-amber-500/10 opacity-70'
                      : 'bg-white dark:bg-[#201938] border-amber-200/70 dark:border-amber-500/25 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onCompleteTask(t.id)}
                      disabled={t.completed}
                      className="text-slate-400 dark:text-amber-300 hover:text-amber-500 transition-colors"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          t.completed ? 'line-through text-slate-500 dark:text-amber-300/60' : 'text-slate-900 dark:text-amber-100'
                        }`}
                      >
                        {t.title}
                      </h4>
                      {t.attribute_name && (
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">
                          {t.attribute_name} Attribute
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-900 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-3 py-1 rounded-xl border border-amber-200/50 dark:border-amber-500/30">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>+{t.xp_reward} XP</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
