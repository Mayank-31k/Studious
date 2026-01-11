'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 4000);
    }, []);

    const showSuccess = useCallback((message: string) => showToast(message, 'success'), [showToast]);
    const showError = useCallback((message: string) => showToast(message, 'error'), [showToast]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const getToastConfig = (type: string) => {
        switch (type) {
            case 'success':
                return {
                    bgClass: 'bg-white dark:bg-zinc-900',
                    borderClass: 'border-green-200 dark:border-green-800',
                    iconBgClass: 'bg-green-50 dark:bg-green-900/30',
                    iconColorClass: 'text-green-600 dark:text-green-400',
                    textClass: 'text-zinc-900 dark:text-zinc-100',
                    icon: CheckCircle2
                };
            case 'error':
                return {
                    bgClass: 'bg-white dark:bg-zinc-900',
                    borderClass: 'border-red-200 dark:border-red-800',
                    iconBgClass: 'bg-red-50 dark:bg-red-900/30',
                    iconColorClass: 'text-red-600 dark:text-red-400',
                    textClass: 'text-zinc-900 dark:text-zinc-100',
                    icon: XCircle
                };
            case 'warning':
                return {
                    bgClass: 'bg-white dark:bg-zinc-900',
                    borderClass: 'border-amber-200 dark:border-amber-800',
                    iconBgClass: 'bg-amber-50 dark:bg-amber-900/30',
                    iconColorClass: 'text-amber-600 dark:text-amber-400',
                    textClass: 'text-zinc-900 dark:text-zinc-100',
                    icon: AlertTriangle
                };
            default:
                return {
                    bgClass: 'bg-white dark:bg-zinc-900',
                    borderClass: 'border-zinc-200 dark:border-zinc-700',
                    iconBgClass: 'bg-zinc-100 dark:bg-zinc-800',
                    iconColorClass: 'text-zinc-600 dark:text-zinc-400',
                    textClass: 'text-zinc-900 dark:text-zinc-100',
                    icon: Info
                };
        }
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
            {children}

            {/* Toast Container - Bottom Right */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => {
                        const config = getToastConfig(toast.type);
                        const Icon = config.icon;

                        return (
                            <motion.div
                                key={toast.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.95 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 400,
                                    damping: 25
                                }}
                                className={`
                                    flex items-start gap-3 p-4 rounded-xl border shadow-lg
                                    backdrop-blur-sm
                                    ${config.bgClass} ${config.borderClass}
                                `}
                            >
                                {/* Icon */}
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${config.iconBgClass}`}>
                                    <Icon className={`w-4 h-4 ${config.iconColorClass}`} />
                                </div>

                                {/* Message */}
                                <p className={`flex-1 text-sm font-medium leading-relaxed pt-1 ${config.textClass}`}>
                                    {toast.message}
                                </p>

                                {/* Close Button */}
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="flex-shrink-0 p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                >
                                    <X className="w-4 h-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300" />
                                </button>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}
