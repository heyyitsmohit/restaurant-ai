// components/ChatWidget.jsx
import { useRef, useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';

export default function ChatWidget() {
  const { messages, isTyping, isOpen, toggle, close, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const suggestions = [
    "What's on the menu?",
    "Vegetarian options?",
    "Track my order",
  ];

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="chat-open fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 z-50 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-[#D85A30] px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Bistro Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                  <p className="text-white/80 text-xs">Online</p>
                </div>
              </div>
            </div>
            <button
              onClick={close}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#D85A30] text-white rounded-tr-sm'
                      : `bg-stone-100 text-[#1a1a1a] rounded-tl-sm ${msg.isError ? 'border border-red-200' : ''}`
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  <span className="typing-dot w-2 h-2 rounded-full bg-stone-400 block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-stone-400 block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-stone-400 block" />
                </div>
              </div>
            )}

            {/* Quick suggestions (shown only at start) */}
            {messages.length === 1 && !isTyping && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-xs bg-white border border-stone-200 hover:border-[#D85A30] hover:text-[#D85A30] rounded-full px-3 py-1.5 transition-colors font-medium"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-stone-100 p-3 flex gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask me anything…"
              className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#D85A30]/30 focus:border-[#D85A30]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 bg-[#D85A30] hover:bg-[#c04f28] disabled:bg-stone-200 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={toggle}
        className={`fixed bottom-6 right-4 sm:right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all duration-300 ${
          isOpen ? 'bg-stone-700 rotate-0' : 'bg-[#D85A30] hover:bg-[#c04f28] hover:scale-110'
        }`}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}
