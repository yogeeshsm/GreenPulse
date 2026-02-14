import { useState, useEffect, useCallback } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProviderProps {
  children: React.ReactNode;
}

let addToastGlobal: ((toast: Omit<Toast, 'id'>) => void) | null = null;

export function showToast(message: string, type: Toast['type'] = 'success', duration = 3000) {
  addToastGlobal?.({ message, type, duration });
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 3000);
  }, []);

  useEffect(() => {
    addToastGlobal = addToast;
    return () => { addToastGlobal = null; };
  }, [addToast]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const icons = {
    success: Check,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: 'bg-[#22C55E] text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  };

  return (
    <>
      {children}
      <div className="fixed top-20 right-4 z-[300] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`${colors[toast.type]} px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)} className="hover:opacity-70">
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
