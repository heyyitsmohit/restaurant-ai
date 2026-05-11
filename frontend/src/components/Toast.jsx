// components/Toast.jsx
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 3500 }) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 300);
    }, duration);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full px-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`
              flex items-start gap-3 p-4 rounded-xl shadow-xl border
              ${toast.exiting ? 'toast-exit' : 'toast-enter'}
              ${toast.type === 'success' ? 'bg-white border-emerald-200' :
                toast.type === 'error' ? 'bg-white border-red-200' :
                'bg-white border-amber-200'}
            `}
          >
            <span className={`text-lg mt-0.5 ${
              toast.type === 'success' ? 'text-emerald-500' :
              toast.type === 'error' ? 'text-red-500' :
              'text-amber-500'
            }`}>
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <p className="text-sm font-medium text-gray-800 leading-snug">{toast.message}</p>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be inside ToastProvider');
  return ctx;
}
