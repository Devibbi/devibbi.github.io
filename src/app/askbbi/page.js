"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const MAX_FREE_QUESTIONS = 5;

const AskBbiPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am AskBbi. Ask me anything.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (questionCount >= MAX_FREE_QUESTIONS && status !== 'authenticated') {
      // Redirect to client login page
      router.push('/client/login');
    }
  }, [questionCount, status, router]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setQuestionCount(count => count + 1);
    try {
      const res = await fetch('/api/askbbi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.answer }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col h-[600px] animate-fade-in">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold text-lg text-purple-700">AskBbi</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-gray-800">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`rounded-xl px-4 py-2 max-w-[80%] ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-2 mr-2 outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="Ask me anything..."
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AskBbiPage;
