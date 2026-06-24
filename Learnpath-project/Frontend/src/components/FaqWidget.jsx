import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../api/api';

const FaqWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am the LearnPath FAQ Bot. Ask me anything about the platform.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/faq-bot/chat`, {
        message: userMessage
      });

      setMessages(prev => [...prev, { sender: 'bot', text: response.data }]);
    } catch (error) {
      console.error("Error connecting to FAQ bot:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the server right now.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window — anchored independently above the FAB */}
      <div
        className={`fixed right-4 z-50 transform transition-all duration-300 ease-in-out origin-bottom-right shadow-2xl rounded-2xl flex flex-col bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-slate-700 overflow-hidden w-80 sm:w-96 ${
          isOpen
            ? 'scale-100 opacity-100 h-[500px] bottom-[76px]'
            : 'scale-0 opacity-0 h-0 w-0 bottom-4 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <h5 className="font-semibold text-lg m-0">FAQ Support</h5>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:bg-white/20 p-1 rounded-full transition-colors focus:outline-none"
            aria-label="Close chat"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-slate-800/50">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-700 text-text-light dark:text-text-dark border border-gray-100 dark:border-slate-600 rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-700 border border-gray-100 dark:border-slate-600 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark flex gap-2">
          <input
            type="text"
            className="flex-1 bg-gray-100 dark:bg-slate-800 border-transparent focus:bg-white dark:focus:bg-slate-900 border focus:border-primary text-text-light dark:text-text-dark rounded-xl px-4 py-2 text-sm transition-all focus:outline-none"
            placeholder="Type your question..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary-dark text-white rounded-xl p-2.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center focus:outline-none"
            disabled={isLoading || !inputMessage.trim()}
          >
            <PaperAirplaneIcon className="w-5 h-5 -rotate-45" />
          </button>
        </form>
      </div>

      {/* Floating Action Button — always pinned at extreme bottom-right */}
      <button
        className={`fixed bottom-4 right-4 z-50 bg-primary hover:bg-primary-dark text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none flex items-center justify-center ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:-translate-y-1'
        }`}
        onClick={toggleChat}
        aria-label="Open chat"
      >
        <ChatBubbleLeftRightIcon className="w-7 h-7" />
      </button>
    </>
  );
};

export default FaqWidget;