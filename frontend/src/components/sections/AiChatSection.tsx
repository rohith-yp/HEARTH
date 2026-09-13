import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, MessageSquare, BookOpen, RefreshCw } from 'lucide-react';
import { MemoryItem } from '../../services/api';

interface AiChatSectionProps {
  onSendChat: (msg: string) => Promise<string | null>;
  memories: MemoryItem[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'wick';
  text: string;
}

export const AiChatSection: React.FC<AiChatSectionProps> = ({
  onSendChat,
  memories,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatting, setChatting] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'wick',
      text: "I'm sitting here by the fire watching your progress. What would you like to talk about today?",
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
  }, [chatHistory]);

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

  return (
    <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto pointer-events-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left AI Chat Box */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 rounded-3xl p-6 sm:p-8 bg-white/85 dark:bg-[#18132b]/85 border border-amber-200/60 dark:border-amber-500/25 shadow-sm hover:shadow-md backdrop-blur-md transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-amber-100 font-cinzel">
              Chat with Wick
            </h3>
          </div>

          {/* Scrollable Conversation Thread History */}
          <div
            ref={chatContainerRef}
            className="max-h-[260px] overflow-y-auto space-y-3 p-4 rounded-2xl bg-amber-500/5 dark:bg-[#110e1f]/70 border border-amber-300/50 dark:border-amber-500/30 mb-6 pr-2"
          >
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className={`flex flex-col text-xs sm:text-sm ${
                  chat.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    chat.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-bold rounded-tr-none shadow-sm'
                      : 'bg-white dark:bg-[#1e1933] border border-amber-200/70 dark:border-amber-500/30 text-slate-800 dark:text-amber-100 font-medium rounded-tl-none shadow-sm'
                  }`}
                >
                  {chat.sender === 'wick' && (
                    <div className="flex items-center gap-1.5 mb-1 text-xs font-bold text-amber-600 dark:text-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Wick:</span>
                    </div>
                  )}
                  <p>{chat.text}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Wick for encouragement, advice, or chat..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 bg-white dark:bg-[#110e1f] border border-amber-200/80 dark:border-amber-500/30 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-amber-100 placeholder-slate-400 dark:placeholder-amber-200/50 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-inner font-medium"
            />
            <button
              type="submit"
              disabled={chatting || !chatMessage.trim()}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-colors"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 dark:bg-amber-500/20 border border-amber-300/70 dark:border-amber-500/40 text-amber-900 dark:text-amber-300 text-xs font-bold shadow-sm mb-4">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Living Companion Memory</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-amber-100 font-cinzel leading-tight drop-shadow-sm">
            Wick Remembers Your Journey.
          </h2>
          <p className="text-sm text-slate-700 dark:text-amber-100/90 font-medium mt-3 leading-relaxed">
            Wick remembers your achievements, milestone streaks, and task completions, offering warm guidance tailored to your unique journey.
          </p>

          <div className="space-y-2.5 mt-6 max-h-[220px] overflow-y-auto pr-1">
            {memories.map((m) => (
              <div key={m.id} className="p-3.5 rounded-2xl bg-white/85 dark:bg-[#1d1733]/90 border border-amber-200/60 dark:border-amber-500/25 shadow-sm text-xs font-medium text-slate-800 dark:text-amber-100">
                <span className="text-amber-700 dark:text-amber-300 font-bold block mb-0.5">★ Memory Record</span>
                {m.memory}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
