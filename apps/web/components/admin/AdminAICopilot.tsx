'use client';

import { useChat } from 'ai/react';
import { Bot, User, Send, X, Sparkles, Terminal, BarChart3, ShieldAlert, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function AdminAICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/admin/chat',
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full bg-dark-900 text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-50 group",
          isOpen && "hidden"
        )}
      >
        <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand-500 rounded-full border-2 border-white animate-pulse" />
      </button>

      {/* Copilot Sidebar */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-[400px] bg-white shadow-[-20px_0_40px_rgba(0,0,0,0.1)] z-[60] flex flex-col transition-transform duration-500 ease-out border-l border-gray-100",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-dark-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-brand-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Admin Copilot</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Ollama Llama 3 Online</span>
              </div>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { icon: BarChart3, label: "Get Stats" },
            { icon: ShieldAlert, label: "Moderation" },
            { icon: Terminal, label: "System Health" }
          ].map((action) => (
            <button 
              key={action.label}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-all whitespace-nowrap shadow-sm"
            >
              <action.icon className="w-3 h-3" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <Sparkles className="w-8 h-8 text-brand-500" />
              </div>
              <div>
                <h4 className="font-bold text-dark-900 text-sm">How can I help today?</h4>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Ask me to fetch stats, analyze listings, or help you with moderation tasks.
                </p>
              </div>
            </div>
          )}
          
          {messages.map((m) => (
            <div key={m.id} className={cn(
              "flex gap-4 animate-in fade-in slide-in-from-bottom-2",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                m.role === 'user' ? "bg-brand-600" : "bg-dark-900 border border-white/10"
              )}>
                {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-brand-400" />}
              </div>
              <div className={cn(
                "max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed",
                m.role === 'user' 
                  ? "bg-brand-500 text-white rounded-tr-none" 
                  : "bg-gray-100 text-dark-900 rounded-tl-none border border-gray-200"
              )}>
                {m.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-dark-900 flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4 text-brand-400" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
                <span className="text-xs text-gray-400 italic font-medium">Processing request...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-100 bg-white">
          <form onSubmit={handleSubmit} className="relative">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask the Admin Copilot..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-gray-400"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-2 w-10 h-10 bg-dark-900 text-white rounded-xl flex items-center justify-center hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-dark-900 transition-all shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-gray-400 mt-4 text-center">
            Powered by <b>Ollama</b> · Local & Private
          </p>
        </div>
      </div>
    </>
  );
}
