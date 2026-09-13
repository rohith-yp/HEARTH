import React, { useState, useRef, useEffect } from 'react';
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
import { getStageProgress } from '../services/wickEvolution';

interface WickJourneyPanelProps {
  wick: WickState | null;
  memories: MemoryItem[];
  loading: boolean;
  error: string | null;
  totalXp?: number;
  onRetry: () => void;
  onSendChat: (msg: string) => Promise<string | null>;
  latestWickResponse?: string | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'wick';
  text: string;
}

export const WickJourneyPanel: React.FC<WickJourneyPanelProps> = ({
  wick,
  memories,
  loading,
  error,
  totalXp = 250,
  onRetry,
  onSendChat,
  latestWickResponse,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatting, setChatting] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'memories'>('chat');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'wick',
      text: latestWickResponse || "I'm right here beside you. How goes your journey today?",
    },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const scrollToBottom = (smooth = true) => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrollToBottom(true);
  }, [chatHistory, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatting) return;

    const msg = chatMessage.trim();
    setChatMessage('');
    setChatting(true);

    const userMsgObj: ChatMessage = { id: `u-${Date.now()}`, sender: 'user', text: msg };
    setChatHistory((prev) => [...prev, userMsgObj]);

    try {
      const resp = await onSendChat(msg);
      if (resp) {
        setChatHistory((prev) => [...prev, { id: `w-${Date.now()}`, sender: 'wick', text: resp }]);
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

  const progressInfo = getStageProgress(totalXp, stage);

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
          <Flame className="w-5 h-5 text-ember-500" />
          <h3 className="font-bold text-lg text-slate-900 dark:text-white font-cinzel">
            Wick's Companion State
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-ember-600 to-amber-500 text-white shadow-md">
          Stage: {stage}
        </span>
      </div>

      {/* Real XP Stage Progression Bar */}
      <div className="p-3.5 rounded-2xl bg-amber-100/60 dark:bg-[#110e1f]/70 border border-amber-300/60 dark:border-amber-500/25">
        <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-amber-100 mb-1.5">
          <span>Stage Progress ({progressInfo.progressPercent}%)</span>
          <span className="text-amber-700 dark:text-amber-300">{totalXp} XP</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-200 dark:bg-slate-950 overflow-hidden border border-amber-300/40">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressInfo.progressPercent}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
          />
        </div>
        <p className="text-[11px] font-bold text-slate-700 dark:text-amber-200/80 mt-1.5">
          {progressInfo.isMaxStage
            ? 'Highest Evolution Form Reached!'
            : `${progressInfo.remainingXp} XP needed to reach ${progressInfo.nextStage?.name}`}
        </p>
      </div>

      {/* Stats Overview Grid (Mood, Energy, Bond) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Mood</span>
          <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 capitalize mt-1">
            {mood}
          </span>
        </div>
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
            <Battery className="w-3 h-3 text-amber-500" />
            <span>Energy</span>
          </div>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white mt-1">
            {energy}%
          </span>
        </div>
        <div className="glass-card rounded-2xl p-3 flex flex-col items-center text-center">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">
            <Heart className="w-3 h-3 text-rose-500" />
            <span>Bond</span>
          </div>
          <span className="text-sm font-extrabold text-rose-600 dark:text-rose-400 mt-1">
            {bond}%
          </span>
        </div>
      </div>

      {/* Tabs: AI Chat vs Memories */}
      <div className="flex items-center border-b border-amber-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-amber-500 text-amber-700 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat with Wick</span>
        </button>
        <button
          onClick={() => setActiveTab('memories')}
          className={`flex items-center gap-2 pb-2 px-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'memories'
              ? 'border-amber-500 text-amber-700 dark:text-amber-400'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Memories ({memories.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' ? (
        <div className="space-y-3">
          {/* Scrollable Conversation Thread History */}
          <div
            ref={chatContainerRef}
            className="max-h-[220px] overflow-y-auto space-y-2.5 p-3 rounded-2xl bg-amber-100/40 dark:bg-[#110e1f]/70 border border-amber-300/50 dark:border-amber-500/20 pr-2"
          >
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex flex-col text-xs ${
                  chat.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                    chat.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow-sm'
                      : 'bg-white dark:bg-[#1e1933] border border-amber-200/80 dark:border-amber-500/30 text-slate-800 dark:text-amber-100 font-medium rounded-tl-none shadow-sm'
                  }`}
                >
                  {chat.sender === 'wick' && (
                    <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-amber-700 dark:text-amber-300">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Wick:</span>
                    </div>
                  )}
                  <p>{chat.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Speak with Wick..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-white dark:bg-slate-900/70 border border-amber-300/80 dark:border-slate-700/60 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={chatting || !chatMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold shadow-md flex items-center justify-center transition-colors"
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
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium italic text-center py-4">
              Wick has no memories recorded yet. Complete tasks to form memories!
            </p>
          ) : (
            memories.map((m) => (
              <div
                key={m.id}
                className="glass-card rounded-xl p-3 text-xs flex flex-col gap-1 border-amber-200/70 dark:border-slate-700/30"
              >
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                  <span>Importance: {'★'.repeat(m.importance)}</span>
                  <span>{new Date(m.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-900 dark:text-slate-100 font-medium">
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
