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
    <section id="features" className="py-24 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-amber-700 text-xs font-bold shadow-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Turn Actions Into Progress</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-cinzel leading-tight">
            Every Task Nourishes Your Companion.
          </h2>
          <p className="text-base text-slate-700 font-medium mt-4 leading-relaxed">
            Completing habits is no longer a chore. Every completed action awards XP, coins, streak momentum, and attribute levels while raising Wick's energy and bond.
          </p>
        </motion.div>

        {/* Right Interactive Task List */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 bg-white/80 border-white/90 shadow-2xl"
        >
          <form onSubmit={handleCreate} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Add a new habit or daily quest..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ember-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-center text-slate-500 text-xs py-8">
                No tasks yet. Add one above to experience RPG progression!
              </p>
            ) : (
              tasks.slice(0, 5).map((t) => (
                <div
                  key={t.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    t.completed
                      ? 'bg-slate-100/60 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onCompleteTask(t.id)}
                      disabled={t.completed}
                      className="text-slate-400 hover:text-ember-500 transition-colors"
                    >
                      {t.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <div>
                      <h4
                        className={`text-sm font-bold ${
                          t.completed ? 'line-through text-slate-500' : 'text-slate-900'
                        }`}
                      >
                        {t.title}
                      </h4>
                      {t.attribute_name && (
                        <span className="text-[11px] font-semibold text-amber-600">
                          {t.attribute_name} Attribute
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-600 bg-amber-500/10 px-3 py-1 rounded-xl">
                    <Flame className="w-3.5 h-3.5" />
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
