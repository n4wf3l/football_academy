import { createContext, useContext, useState, useCallback, useRef } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  exiting?: boolean;
}

interface ToastContextType {
  toast: {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.toast;
}

const icons: Record<ToastType, JSX.Element> = {
  success: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

const styles: Record<ToastType, { bg: string; icon: string; bar: string }> = {
  success: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-emerald-500',
    bar: 'bg-emerald-500',
  },
  error: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-red-500',
    bar: 'bg-red-500',
  },
  info: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-blue-500',
    bar: 'bg-blue-500',
  },
  warning: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-amber-500',
    bar: 'bg-amber-500',
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  const toast = {
    success: (title: string, message?: string) => addToast('success', title, message),
    error: (title: string, message?: string) => addToast('error', title, message),
    info: (title: string, message?: string) => addToast('info', title, message),
    warning: (title: string, message?: string) => addToast('warning', title, message),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-[400px] w-full">
        {toasts.map((t) => {
          const s = styles[t.type];
          return (
            <div
              key={t.id}
              className={`pointer-events-auto ${s.bg} rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden transition-all duration-300 ${
                t.exiting
                  ? 'opacity-0 translate-x-[120%]'
                  : 'opacity-100 translate-x-0 animate-[slideInRight_0.4s_cubic-bezier(0.16,1,0.3,1)]'
              }`}
            >
              {/* Progress bar */}
              <div className="relative h-[3px] bg-gray-100">
                <div
                  className={`absolute inset-y-0 left-0 ${s.bar} rounded-full`}
                  style={{
                    animation: t.exiting ? 'none' : 'shrink 4.5s linear forwards',
                  }}
                />
              </div>

              <div className="flex items-start gap-3 px-4 py-3.5">
                {/* Icon */}
                <div className={`${s.icon} mt-0.5 shrink-0`}>
                  {icons[t.type]}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-900 leading-snug">{t.title}</p>
                  {t.message && (
                    <p className="text-[12px] text-gray-400 mt-0.5 leading-snug">{t.message}</p>
                  )}
                </div>

                {/* Close */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all duration-200 -mr-1 -mt-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
