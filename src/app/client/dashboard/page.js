"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Send, LogOut, User } from 'lucide-react';

const ClientDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/client/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
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
          subject,
          message,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }
      
      setSubject('');
      setMessage('');
      setSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-4 mb-6">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name} 
                    className="w-16 h-16 rounded-full border-2 border-white/50"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                    <User className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-bold">{session.user.name}</h2>
                  <p className="text-white/70">{session.user.email}</p>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h3 className="text-lg font-semibold mb-2">Account Info</h3>
                <p className="text-white/70 mb-1">Signed in with: {session.user.provider || 'OAuth'}</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
              
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300">Your message has been sent successfully! I'll get back to you soon.</p>
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-300">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-white/80 mb-2">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="e.g., Website Development Project"
                    disabled={sending}
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="message" className="block text-white/80 mb-2">Message</label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-40"
                    placeholder="Describe your project, requirements, timeline, etc."
                    disabled={sending}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
