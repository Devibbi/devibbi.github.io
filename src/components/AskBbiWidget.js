"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const MAX_FREE_QUESTIONS = 5;

const AskBbiWidget = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hi! I am AskBbi. Ask me anything.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  const shouldHide = pathname && pathname.startsWith('/client/login');

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  useEffect(() => {
    if (questionCount >= MAX_FREE_QUESTIONS && status !== 'authenticated') {
      setShowLoginPrompt(true);
    }
  }, [questionCount, status]);

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

  const handleLogin = () => {
    setShowLoginPrompt(false);
    setOpen(false);
    router.push('/client/login');
  };

  if (shouldHide) {
    return <></>;
  }

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed z-50 bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl hover:scale-110 transition-all"
        onClick={() => setOpen(o => !o)}
        aria-label="AskBbi Chat"
        style={{ display: pathname && (pathname.startsWith('/client/dashboard') || pathname === '/') ? 'flex' : 'flex' }}
      >
        <span className="text-2xl">🤖</span>
      </button>
      {/* Chat widget */}
      {open && (
        <div className="fixed z-50 bottom-24 right-6 w-80 max-w-full bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col h-[420px] animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <span className="font-bold text-lg text-purple-700">AskBbi</span>
            <div>
              <a
                href="/askbbi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Open in new tab
              </a>
              <button
                className="ml-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
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
          <div className="p-3 border-t border-gray-200 dark:border-gray-800 flex gap-2">
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
      )}
      {/* Login to use prompt */}
      {showLoginPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col items-center max-w-xs">
            <span className="text-lg font-bold mb-4 text-purple-700">Login to use</span>
            <p className="mb-6 text-gray-700 dark:text-gray-200 text-center">You need to login as a client to continue using AskBbi.</p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                onClick={handleLogin}
              >
                Login
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={handleLogin}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AskBbiWidget;
