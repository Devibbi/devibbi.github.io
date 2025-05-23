"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, Send, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [tempMessages, setTempMessages] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch clients and messages
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const { messages, clients } = await response.json();
      
      if (!Array.isArray(messages) || !Array.isArray(clients)) {
        throw new Error('Invalid data format from API');
      }

      setMessages(messages);
      setClients(clients);
      setError('');
      setIsRateLimited(false);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
      if (err.message.includes('429')) {
        setIsRateLimited(true);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

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
        console.error('Failed to update message status');
        return;
      }
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, read: isRead } : msg
      ));
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  // Send response to client
  const sendResponse = async (e) => {
    e.preventDefault();
    
    if (!selectedClient || !currentMessage.trim()) {
      setError('Please enter a message');
      return;
    }
    
    try {
      setSending(true);
      setError('');
      
      // Create a temporary message
      const tempMessage = {
        id: `temp-${Date.now()}`,
        subject: 'Admin Response',
        message: currentMessage,
        createdAt: new Date().toISOString(),
        sender: 'admin',
        client: selectedClient,
        isAdminResponse: true,
        isTemporary: true
      };
      
      // Add to temporary messages
      setTempMessages(prev => [...prev, tempMessage]);
      
      // Clear input field immediately
      setCurrentMessage('');
      
      // Send the message to the server
      const response = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: selectedClient.id,
          subject: 'Admin Response',
          message: tempMessage.message,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Fetch updated data after sending
      setTimeout(() => {
        fetchData();
      }, 1000);
      
    } catch (error) {
      setError('Error sending message. Please try again.');
      console.error('Send error:', error);
      if (error.message.includes('429')) {
        setIsRateLimited(true);
      }
    } finally {
      setSending(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchData();
    
    // Set up polling to check for new messages every 5 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchData();
    }, 5000);
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [fetchData]);
  
  // Scroll to bottom when messages change or client is selected
  useEffect(() => {
    scrollToBottom();
  }, [messages, tempMessages, selectedClient]);

  // Handle client selection
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    
    // Mark unread messages as read
    messages
      .filter(msg => msg.client?.id === client.id && !msg.read)
      .forEach(msg => markAsRead(msg.id));
  };
  
  // Get conversation for selected client
  const getClientConversation = () => {
    if (!selectedClient) return [];
    
    // Get all messages for this client
    const clientMessages = messages.filter(msg => 
      msg.client?.id === selectedClient.id
    ).map(msg => ({
      ...msg,
      isAdminResponse: msg.sender === 'admin'
    }));
    
    // Get temporary messages for this client
    const clientTempMessages = tempMessages.filter(msg => 
      msg.client?.id === selectedClient.id
    );
    
    // Combine and sort by timestamp
    const allMessages = [...clientMessages, ...clientTempMessages].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );
    
    return allMessages;
  };

  // Format date
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Messenger</h1>
          <Link href="/" className="text-white/80 hover:text-white transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Site
          </Link>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-4">
        {/* Clients list */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-semibold">Clients</h2>
            <button 
              onClick={fetchData}
              className="text-blue-600 hover:text-blue-800 p-1 rounded-full"
              title="Refresh messages"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          
          <div className="overflow-y-auto flex-grow">
            {loading && clients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Loading clients...
              </div>
            ) : error ? (
              <div className="p-4 text-red-500 text-center">
                {error}
              </div>
            ) : (clients?.length || 0) === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No clients yet.
              </div>
            ) : (
              <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
                {clients.map((client) => (
                  <div 
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedClient?.id === client.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {client.image && (
                          <Image
                            src={client.image}
                            alt={`${client.name}'s avatar`}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized={true}
                          />
                        )}
                        {client.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {client.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium truncate">{client.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{client.email}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
          {isRateLimited && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
              <p>Too many requests. Please wait a few seconds before trying again.</p>
            </div>
          )}
          {selectedClient ? (
            <>
              {/* Client header */}
              <div className="p-4 bg-gray-50 border-b flex items-center gap-3">
                {selectedClient.image && (
                  <Image
                    src={selectedClient.image}
                    alt={`${selectedClient.name}'s avatar`}
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized={true}
                  />
                )}
                <div>
                  <h2 className="font-semibold">{selectedClient.name}</h2>
                  <p className="text-sm text-gray-500">{selectedClient.email}</p>
                </div>
              </div>
              
              {/* Messages */}
              <div className="flex-grow overflow-y-auto p-4 max-h-[calc(100vh-300px)]">
                {getClientConversation().length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    No messages yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getClientConversation().map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.isAdminResponse || msg.isTemporary ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${msg.isAdminResponse || msg.isTemporary 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}
                        >
                          <div className="font-semibold text-xs mb-1">
                            {msg.isAdminResponse || msg.isTemporary ? 'You' : msg.client?.name || 'Client'}
                          </div>
                          <p className="whitespace-pre-wrap break-words">{msg.message}</p>
                          <div className={`text-xs mt-1 ${msg.isAdminResponse || msg.isTemporary ? 'text-blue-200' : 'text-gray-500'} text-right`}>
                            {formatDate(msg.createdAt)}
                            {msg.isTemporary && <span className="ml-1 opacity-70">(Sent)</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <form onSubmit={sendResponse} className="p-4 border-t flex items-end">
                <div className="flex-grow relative">
                  {error && (
                    <div className="absolute -top-10 left-0 right-0 p-2 bg-red-100 border border-red-300 rounded-lg text-sm">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}
                  <textarea
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-12 max-h-32"
                    placeholder="Type a message..."
                    disabled={sending}
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendResponse(e);
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="ml-2 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 p-8">
              <div className="text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl font-medium mb-2">Select a client to start messaging</p>
                <p>Choose a client from the list to view conversation history and send messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;