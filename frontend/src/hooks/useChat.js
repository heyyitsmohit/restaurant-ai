// hooks/useChat.js
import { useState, useCallback, useRef } from 'react';
import { sendChatMessage } from '../api/client';

function getOrCreateSessionId() {
  const key = 'bistro_chat_session';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: "Hello! I'm Bistro's AI assistant. I can help you browse the menu, place an order, or track an existing one. What can I do for you today? 🍽️",
      ts: Date.now(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sessionId = useRef(getOrCreateSessionId());

  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now() + '_u', role: 'user', text, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const data = await sendChatMessage(text, sessionId.current);
      // Update session id if server returns one
      if (data.session_id) sessionId.current = data.session_id;
      const botMsg = { id: Date.now() + '_b', role: 'bot', text: data.reply, ts: Date.now() };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      const errMsg = {
        id: Date.now() + '_e',
        role: 'bot',
        text: "I'm having trouble connecting right now. Please try again or call us directly at (555) 123-4567.",
        ts: Date.now(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  return {
    messages,
    isTyping,
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
    sendMessage,
  };
}
