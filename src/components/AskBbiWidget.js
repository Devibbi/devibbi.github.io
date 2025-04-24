"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const MAX_FREE_QUESTIONS = 7;

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

  // Conversation state management
  const [conversationState, setConversationState] = useState('introduction');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    location: '',
    contact: '',
    service: ''
  });

  const shouldHide = pathname && pathname.startsWith('/client/login');

  // Initialize chat with introduction
  useEffect(() => {
    // Only run this once when component mounts
    handleApiPrompt("I am AskBbi. I represent Ibraheem, a full stack developer with experience in multiple coding languages, networking, pentesting, and administration skills. Would you like to become a client? Type YES to proceed.");
  }, []);

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

  // Helper function to send a system prompt to the API
  const handleApiPrompt = async (prompt) => {
    try {
      const res = await fetch('/api/askbbi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: `SYSTEM: ${prompt}` })
      });
      const data = await res.json();
      setMessages(msgs => msgs.length === 1 && msgs[0].text === 'Hi! I am AskBbi. Ask me anything.'
        ? [{ sender: 'ai', text: data.answer }]  // Replace the initial message
        : [...msgs, { sender: 'ai', text: data.answer }]); // Or add to conversation
    } catch (e) {
      console.error("API prompt error:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { sender: 'user', text: input };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    setQuestionCount(count => count + 1);

    // Handle conversation flow based on current state
    const userInput = input.trim().toLowerCase();

    // Process the conversation based on state
    switch (conversationState) {
      case 'introduction':
        if (userInput === 'yes') {
          setConversationState('ask_name');
          await handleApiPrompt("Great! Let's start with your name. What should I call you?");
        } else {
          await handleApiCall(`The user said: "${input}". Respond to their query, but also mention that if they change their mind about becoming a client, they can type YES anytime.`);
        }
        break;

      case 'ask_name':
        setClientInfo(prev => ({ ...prev, name: input.trim() }));
        setConversationState('ask_email');
        await handleApiPrompt(`Thanks, ${input.trim()}! Now, please share your email address so we can contact you.`);
        break;

      case 'ask_email':
        setClientInfo(prev => ({ ...prev, email: input.trim() }));
        setConversationState('ask_location');
        await handleApiPrompt('Perfect! Where are you located? (City/Country)');
        break;

      case 'ask_location':
        setClientInfo(prev => ({ ...prev, location: input.trim() }));
        setConversationState('ask_contact');
        await handleApiPrompt('Thanks! Could you share your phone number or social media handle? (This is optional)');
        break;

      case 'ask_contact':
        setClientInfo(prev => ({ ...prev, contact: input.trim() }));
        setConversationState('ask_service');
        await handleApiPrompt('Great! DeviBbi offers the following services:\n\n• Website Design & Development\n• Network Management\n• Database Administration\n• Advanced Programming Solutions\n• Penetration Testing\n\nWhat service are you interested in?');
        break;

      case 'ask_service':
        setClientInfo(prev => ({ ...prev, service: input.trim() }));
        setConversationState('completed');

        // Save the client information
        try {
          const saveRes = await fetch('/api/save-client-info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...clientInfo,
              service: input.trim()
            })
          });

          if (!saveRes.ok) {
            console.error("Failed to save client info:", await saveRes.text());
          }
        } catch (e) {
          console.error("Error saving client info:", e);
        }

        await handleApiPrompt(`Thank you for your interest in ${input.trim()}! We've recorded your information and Ibraheem will get back to you soon.\n\nIn a hurry? Contact Ibraheem directly:\n• WhatsApp: +923313488884\n• Instagram: ibbi_125\n• Email: ibraheem.zaffar123@gmail.com or askibbi@yahoo.com\n\nIs there anything else you'd like to know?`);
        break;

      case 'completed':
      default:
        // For any messages after completion, use the API directly
        await handleApiCall(input);
        break;
    }

    setLoading(false);
  };

  const handleApiCall = async (question) => {
    try {
      const res = await fetch('/api/askbbi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.answer }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Sorry, something went wrong.' }]);
    }
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
              placeholder="Type your message..."
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
                onClick={() => setShowLoginPrompt(false)}
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