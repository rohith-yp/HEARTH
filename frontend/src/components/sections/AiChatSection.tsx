import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, MessageSquare, BookOpen, RefreshCw } from 'lucide-react';
import { MemoryItem } from '../../services/api';

interface AiChatSectionProps {
  onSendChat: (msg: string) => Promise<string | null>;
  memories: MemoryItem[];
}

export const AiChatSection: React.FC<AiChatSectionProps> = ({
  onSendChat,
  memories,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatting, setChatting] = useState(false);
  const [speech, setSpeech] = useState<string>(
    "I'm sitting here by the fire watching your progress. What would you like to talk about today?"
  );

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatting) return;
    const msg = chatMessage.trim();
    setChatMessage('');
    setChatting(true);
    try {
      const resp = await onSendChat(msg);
      if (resp) {
        setSpeech(resp);
      }
    } finally {
      setChatting(false);
    }
  };

  return (
    <section className="py-24 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left AI Chat Box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 bg-white/85 border-white/95 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-ember-500" />
            <h3 className="font-bold text-lg text-slate-950 font-cinzel">
              Chat with Wick (Llama 3.1 AI)
            </h3>
          </div>

          <div className="p-5 rounded-2xl bg-ember-500/10 border border-ember-500/20 mb-6">
            <span className="text-xs font-bold text-ember-600 block mb-1">
              Wick says:
            </span>
            <p className="text-sm italic font-medium text-slate-900 leading-relaxed">
              "{speech}"
            </p>
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Wick for encouragement, advice, or chat..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-ember-500 shadow-inner"
            />
            <button
              type="submit"
              disabled={chatting || !chatMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-ember-500 hover:bg-ember-400 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2"
            >
              {chatting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>

        {/* Right Memory Feed */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-5"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200 text-amber-700 text-xs font-bold shadow-sm mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Living Companion Memory</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 font-cinzel leading-tight">
            Wick Remembers Your Journey.
          </h2>
          <p className="text-sm text-slate-700 font-medium mt-3 leading-relaxed">
            Wick remembers your achievements, milestone streaks, and task completions, crafting personal AI responses tailored to your actual story.
          </p>

          <div className="space-y-2.5 mt-6 max-h-[220px] overflow-y-auto pr-1">
            {memories.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-white/80 border border-white/90 shadow-sm text-xs font-medium text-slate-800">
                <span className="text-amber-600 font-bold block mb-0.5">★ Memory Record</span>
                {m.memory}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
