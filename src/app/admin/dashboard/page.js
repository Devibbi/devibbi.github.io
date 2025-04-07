"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Circle, Send } from 'lucide-react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [responseSubject, setResponseSubject] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // Fetch messages
  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages');
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/admin/login');
          return;
        }
        throw new Error('Failed to fetch messages');
      }
      
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      setError('Error loading messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mark message as read
  const markAsRead = async (messageId, isRead = true) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId, read: isRead }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update message');
      }
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: isRead } : msg
      ));
      
      if (selectedMessage && selectedMessage.id === messageId) {
        setSelectedMessage({ ...selectedMessage, read: isRead });
      }
    } catch (error) {
      setError('Error updating message. Please try again.');
    }
  };

  // Send response to client
  const sendResponse = async (e) => {
    e.preventDefault();
    
    if (!selectedMessage || !responseSubject || !responseMessage) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setSending(true);
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedMessage.client.id,
          subject: responseSubject,
          message: responseMessage,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send response');
      }
      
      setSuccess('Response sent successfully!');
      setResponseSubject('');
      setResponseMessage('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (error) {
      setError('Error sending response. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Load messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle message selection
  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setResponseSubject(`Re: ${message.subject}`);
    
    // Mark as read if not already read
    if (!message.read) {
      markAsRead(message.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Link href="/" className="text-white/80 hover:text-white transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Site
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Messages list */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-semibold">Client Messages</h2>
            <button 
              onClick={fetchMessages}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full"
              title="Refresh messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading messages...
            </div>
          ) : error ? (
            <div className="p-4 text-red-500 text-center">
              {error}
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No messages yet.
            </div>
          ) : (
            <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
              {messages.map((message) => (
                <div 
                  key={message.id}
                  onClick={() => handleSelectMessage(message)}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className={`font-medium ${!message.read ? 'font-bold' : ''}`}>
                      {message.subject}
                    </h3>
                    {message.read ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                    <img 
                      src={message.client?.image || '/placeholder-avatar.png'} 
                      alt={message.client?.name || 'Client'}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{message.client?.name || 'Unknown Client'}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {message.message}
                  </p>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Message detail and response */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          {selectedMessage ? (
            <div className="flex flex-col h-full">
              {/* Message details */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    <button 
                      onClick={() => markAsRead(selectedMessage.id, !selectedMessage.read)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {selectedMessage.read ? 'Mark as unread' : 'Mark as read'}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={selectedMessage.client?.image || '/placeholder-avatar.png'} 
                    alt={selectedMessage.client?.name || 'Client'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium">{selectedMessage.client?.name || 'Unknown Client'}</div>
                    <div className="text-sm text-gray-500">{selectedMessage.client?.email || ''}</div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
              
              {/* Response form */}
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Send Response</h3>
                
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">
                    {success}
                  </div>
                )}
                
                <form onSubmit={sendResponse}>
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={responseSubject}
                      onChange={(e) => setResponseSubject(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={responseMessage}
                      onChange={(e) => setResponseMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={sending}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? 'Sending...' : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Response
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
              <div>
                <p className="mb-2">Select a message to view details and respond</p>
                {messages.length === 0 && !loading && (
                  <p className="text-sm">No messages received yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
