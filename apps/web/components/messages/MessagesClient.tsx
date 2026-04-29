'use client';

import { useState } from 'react';
import { Send, Search, Phone, MoreVertical, ArrowLeft, CheckCheck, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';
import { sendMessage } from '@/lib/actions';
import { toast } from 'sonner';

interface MessagesClientProps {
  conversations: any[];
  currentUserId: string;
}

export default function MessagesClient({ conversations, currentUserId }: MessagesClientProps) {
  const [selected, setSelected] = useState(conversations[0]?.id || null);
  const [newMsg, setNewMsg] = useState('');
  const [mobileChat, setMobileChat] = useState(false);
  const [localConversations, setLocalConversations] = useState(conversations);
  const [isSending, setIsSending] = useState(false);
  
  const activeConversation = localConversations.find(c => c.id === selected);
  const otherParticipant = activeConversation?.participants.find((p: any) => p.id !== currentUserId);

  const handleSend = async () => {
    if (!newMsg.trim() || !selected || isSending) return;
    const text = newMsg.trim();
    setNewMsg('');
    
    // Optimistic update: add message to UI immediately
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      content: text,
      createdAt: new Date().toISOString(),
    };
    
    setLocalConversations(prev => prev.map(c => 
      c.id === selected 
        ? { ...c, messages: [optimisticMsg, ...c.messages] }
        : c
    ));
    
    setIsSending(true);
    try {
      const result = await sendMessage(selected, text);
      if (!result.success) {
        toast.error(result.error || 'Failed to send message');
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-gray-50/50">
        <div className="section-padding py-8">
          <h1 className="text-2xl font-bold text-dark-900 mb-6">Messages</h1>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="flex h-full">
              {/* Conversation list */}
              <div className={cn('w-full md:w-80 border-r border-gray-100 flex flex-col', mobileChat ? 'hidden md:flex' : 'flex')}>
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input placeholder="Search messages..." className="flex-1 bg-transparent text-sm outline-none text-dark-900 placeholder:text-gray-400" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.length > 0 ? (
                    conversations.map(c => {
                      const other = c.participants.find((p: any) => p.id !== currentUserId);
                      const lastMsg = c.messages[0];
                      return (
                        <button 
                          key={c.id} 
                          onClick={() => { setSelected(c.id); setMobileChat(true); }} 
                          className={cn(
                            'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left', 
                            selected === c.id && 'bg-brand-50/50'
                          )}
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold">
                              {other?.firstName?.charAt(0) || 'U'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-dark-900">{other?.firstName} {other?.lastName}</span>
                              <span className="text-[10px] text-gray-400">{lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                            </div>
                            <p className="text-xs text-gray-400 truncate">{c.booking?.listing?.title || 'Tool Rental'}</p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{lastMsg?.content || 'No messages yet'}</p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No conversations yet
                    </div>
                  )}
                </div>
              </div>

              {/* Chat area */}
              <div className={cn('flex-1 flex flex-col', !mobileChat ? 'hidden md:flex' : 'flex')}>
                {activeConversation ? (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                      <button onClick={() => setMobileChat(false)} className="md:hidden p-1 rounded hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                      </button>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold text-sm">
                        {otherParticipant?.firstName?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-dark-900">{otherParticipant?.firstName} {otherParticipant?.lastName}</p>
                        <p className="text-xs text-gray-400">{activeConversation.booking?.listing?.title}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100"><Phone className="w-4 h-4 text-gray-400" /></button>
                      <button className="p-2 rounded-lg hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {/* For now we only show the last message as a placeholder if there are no messages */}
                      {activeConversation.messages.length > 0 ? (
                        activeConversation.messages.map((m: any) => (
                          <div key={m.id} className={cn('flex', m.senderId === currentUserId ? 'justify-end' : 'justify-start')}>
                            <div className={cn(
                              'max-w-[70%] px-4 py-2.5 rounded-2xl', 
                              m.senderId === currentUserId ? 'bg-brand-500 text-white rounded-br-md' : 'bg-gray-100 text-dark-900 rounded-bl-md'
                            )}>
                              <p className="text-sm">{m.content}</p>
                              <div className={cn('flex items-center gap-1 mt-1', m.senderId === currentUserId ? 'justify-end' : '')}>
                                <span className={cn('text-[10px]', m.senderId === currentUserId ? 'text-white/60' : 'text-gray-400')}>
                                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {m.senderId === currentUserId && <CheckCheck className="w-3 h-3 text-white/60" />}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-20 text-gray-400 text-sm">
                          Start your conversation about the {activeConversation.booking?.listing?.title}
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <input 
                          value={newMsg} 
                          onChange={e => setNewMsg(e.target.value)} 
                          placeholder="Type a message..." 
                          className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none border border-transparent focus:border-brand-300 focus:bg-white transition-all" 
                          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                        />
                        <button onClick={handleSend} disabled={isSending || !newMsg.trim()} className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50">
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
                    <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                    <h3 className="text-lg font-semibold text-dark-900">Select a conversation</h3>
                    <p className="text-gray-500 text-sm">Pick a message from the list to start chatting</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
