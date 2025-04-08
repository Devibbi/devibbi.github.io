"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Send, LogOut, User, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const ClientDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/client/login');
    }
  }, [status, router]);

  const fetchConversation = async () => {
    if (status !== 'authenticated') return;
    
    setLoading(true);
    try {
      // Fetch client messages
      const clientMessagesRes = await fetch('/api/client/message');
      if (!clientMessagesRes.ok) {
        throw new Error('Failed to fetch client messages');
      }
      const clientMessagesData = await clientMessagesRes.json();
      
      // Fetch admin responses
      const adminResponsesRes = await fetch('/api/client/responses');
      if (!adminResponsesRes.ok) {
        throw new Error('Failed to fetch admin responses');
      }
      const adminResponsesData = await adminResponsesRes.json();
      
      // Combine and sort all messages by timestamp
      const clientMessages = (clientMessagesData.messages || []).map(msg => ({
        id: msg.id,
        content: msg.message,
        timestamp: msg.createdAt,
        sender: 'client',
        subject: msg.subject
      }));
      
      const adminResponses = (adminResponsesData.responses || []).map(resp => ({
        id: resp.id,
        content: resp.message,
        timestamp: resp.createdAt,
        sender: 'admin',
        subject: resp.subject
      }));
      
      const allMessages = [...clientMessages, ...adminResponses].sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
      );
      
      setConversations(allMessages);
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setError('Failed to load conversation history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
    
    // Set up more frequent polling (every 5 seconds) to improve real-time experience
    pollingIntervalRef.current = setInterval(() => {
      fetchConversation();
    }, 5000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [status]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [conversations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setSending(true);
    setError('');
    
    try {
      const response = await fetch('/api/client/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'Chat message',  // Default subject for chat messages
          message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      // Add the new message to the conversation with the ID from the server response
      // This prevents duplicate messages when polling fetches the same message
      const newMessageId = data.message?.id || `temp-${Date.now()}`;
      
      setConversations(prev => [...prev, {
        id: newMessageId,
        content: message,
        timestamp: new Date().toISOString(),
        sender: 'client',
        subject: 'Chat message'
      }]);
      
      setMessage('');
      
      // Immediately fetch conversation after sending to get any new messages
      // This helps with synchronization between client and admin
      setTimeout(() => {
        fetchConversation();
      }, 1000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      hour: 'numeric', 
      minute: 'numeric',
      hour12: true,
      month: 'short',
      day: 'numeric'
    });
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* User info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-4 shadow-xl flex items-center">
          {session?.user?.image ? (
            <Image 
              src={session.user.image} 
              alt={session.user.name} 
              className="w-10 h-10 rounded-full border-2 border-white/50 mr-3"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
              <User className="w-5 h-5" />
            </div>
          )}
          <div>
            <h2 className="font-semibold">{session?.user?.name}</h2>
            <p className="text-white/70 text-sm">{session?.user?.email}</p>
          </div>
        </div>
        
        {/* Chat area */}
        <div className="flex-grow bg-white/10 backdrop-blur-md rounded-xl p-4 shadow-xl mb-4 flex flex-col">
          <div className="flex-grow overflow-y-auto max-h-[calc(100vh-300px)] mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {loading && conversations.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-white/60 h-full flex flex-col justify-center items-center">
                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p>No messages yet. Start a conversation!</p>
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {conversations.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === 'client' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-white/20 text-white rounded-tl-none'}`}
                    >
                      <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      <div className="text-xs mt-1 opacity-70 text-right">
                        {formatDate(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message input */}
          <form onSubmit={handleSubmit} className="flex items-end">
            <div className="flex-grow relative">
              {error && (
                <div className="absolute -top-10 left-0 right-0 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-sm">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-12 max-h-32"
                placeholder="Type a message..."
                disabled={sending}
                rows="1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="ml-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;