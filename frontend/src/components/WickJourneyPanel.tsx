import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Heart,
  Battery,
  Send,
  Sparkles,
  RefreshCw,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { WickState, MemoryItem } from '../services/api';

interface WickJourneyPanelProps {
  wick: WickState | null;
  memories: MemoryItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSendChat: (msg: string) => Promise<string | null>;
  latestWickResponse?: string | null;
}

export const WickJourneyPanel: React.FC<WickJourneyPanelProps> = ({
  wick,
  memories,
  loading,
  error,
  onRetry,
  onSendChat,
  latestWickResponse,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatting, setChatting] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memories'>('chat');
  const [localResponse, setLocalResponse] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatting) return;

    const msg = chatMessage.trim();
    setChatMessage('');
    setChatting(true);

    try {
      const resp = await onSendChat(msg);
      if (resp) {
        setLocalResponse(resp);
      }
    } finally {
      setChatting(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 pointer-events-auto min-h-[380px]">
        <div className="flex items-center justify-between">
          <div className="h-6 w-40 rounded-lg skeleton-shimmer" />
          <div className="h-6 w-20 rounded-lg skeleton-shimmer" />
        </div>
        <div className="h-24 w-full rounded-2xl skeleton-shimmer my-2" />
        <div className="h-16 w-full rounded-xl skeleton-shimmer" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center text-center pointer-events-auto min-h-[380px]">
        <p className="text-sm text-rose-400 font-medium mb-3">Failed to load Wick's Journey</p>
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

  const stage = wick?.stage || 'Spark';
  const mood = wick?.mood || 'neutral';
  const energy = wick?.energy ?? 100;
  const bond = wick?.bond ?? 0;

  const currentSpeech = localResponse || latestWickResponse || "I'm right here beside you. How goes your journey today?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-3xl p-6 pointer-events-auto flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-ember-500 animate-pulse" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-cinzel">
            Wick's Companion State
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-ember-600 to-amber-500 text-white shadow-md">
          Stage: {stage}
        </span>
      </div>

      {/* Stats Overview Grid (Mood, Energy, Bond) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400">Mood</span>
          <span className="text-sm font-extrabold text-amber-500 capitalize mt-1">
            {mood}
          </span>
        </div>
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
            <Battery className="w-3 h-3 text-ember-500" />
            <span>Energy</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            {energy}%
          </span>
        </div>
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
            <Heart className="w-3 h-3 text-rose-500" />
            <span>Bond</span>
          </div>
          <span className="text-sm font-extrabold text-rose-400 mt-1">
            {bond}%
          </span>
        </div>
      </div>

      {/* Tabs: AI Chat vs Memories */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 pb-2 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-ember-500 text-ember-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Wick AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`flex items-center gap-2 pb-2 px-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'memories'
              ? 'border-ember-500 text-ember-500'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Memories ({memories.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <div className="space-y-4">
          {/* Wick Spoken Dialogue Box */}
          <div className="glass-card rounded-2xl p-4 border border-ember-500/20 bg-ember-500/5 relative">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-amber-500">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wick says:</span>
            </div>
            <p className="text-sm italic text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              "{currentSpeech}"
            </p>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Speak with Wick..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-slate-100 dark:bg-slate-900/70 border border-slate-300 dark:border-slate-700/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-ember-500"
            />
            <button
              type="submit"
              disabled={chatting || !chatMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-ember-500 hover:bg-ember-400 disabled:opacity-50 text-white font-semibold shadow-md flex items-center justify-center"
            >
              {chatting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </form>
        </div>
      ) : (
        /* Memories List Feed */
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {memories.length === 0 ? (
            <p className="text-xs text-slate-500 italic text-center py-4">
              Wick has no memories recorded yet. Complete tasks to form memories!
            </p>
          ) : (
            memories.map((m) => (
              <div
                key={m.id}
                className="glass-card rounded-xl p-3 text-xs flex flex-col gap-1 border-slate-700/30"
              >
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>Importance: {'★'.repeat(m.importance)}</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {m.memory}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};
