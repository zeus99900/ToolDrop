'use client';

import { useChat } from 'ai/react';
import { Bot, User, Send, X, MessageCircle, Wrench, Loader2, Minus, Maximize2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import Link from 'next/link';

export default function UserAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-brand-600 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[100] group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors" />
        <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed bottom-6 right-6 w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] flex flex-col transition-all duration-300 border border-gray-100 overflow-hidden",
      isMinimized ? "h-[72px]" : "h-[600px]"
    )}>
      {/* Header */}
      <div className="p-4 bg-brand-600 text-white flex items-center justify-between cursor-pointer" onClick={() => isMinimized && setIsMinimized(false)}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Wrench className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">ToolDrop Scout</h3>
            <p className="text-[10px] text-brand-100 font-medium">Always here to help you build</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/50">
            {messages.length === 0 && (
              <div className="space-y-4 py-4">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                  <p className="text-sm text-dark-900 leading-relaxed">
                    Hey there! I'm the <b>ToolDrop Scout</b>. Need help finding a specific tool or starting a DIY project? Just ask! 🛠️
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "I need a drill for a fence project",
                    "How do I rent a tool?",
                    "Do you have 10mm sockets in Halifax?"
                  ].map((q) => (
                    <button 
                      key={q}
                      onClick={() => handleInputChange({ target: { value: q } } as any)}
                      className="text-left p-3 rounded-xl bg-white border border-gray-100 text-xs text-gray-600 hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={cn(
                "flex gap-3",
                m.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                  m.role === 'user' ? "bg-dark-900" : "bg-brand-600"
                )}>
                  {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl p-3.5 text-sm leading-relaxed",
                  m.role === 'user' 
                    ? "bg-dark-900 text-white rounded-tr-none" 
                    : "bg-white text-dark-900 rounded-tl-none border border-gray-100 shadow-sm"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center animate-bounce">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2 border border-gray-100 shadow-sm">
                  <Loader2 className="w-3 h-3 animate-spin text-brand-500" />
                  <span className="text-xs text-gray-400 font-medium italic">Scouting for answers...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <form onSubmit={handleSubmit} className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Type your message..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 top-1.5 w-9 h-9 bg-brand-600 text-white rounded-xl flex items-center justify-center hover:bg-brand-700 disabled:opacity-50 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
