'use client';

import React, { useEffect, useCallback } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
}: ModalProps) {
    const handleEscape = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const sizes = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
          relative w-full ${sizes[size]} mx-4
          bg-[#1A1F1C]
          border-4 border-[#4A8C3F]
          shadow-[0_0_40px_rgba(74,140,63,0.4),inset_-4px_-4px_0_#1E3D1A,inset_4px_4px_0_#4A8C3F]
          animate-slide-up
        `}
            >
                {/* Header */}
                {(title || showCloseButton) && (
                    <div className="flex items-start justify-between p-5 border-b-4 border-[#2E3830]">
                        <div>
                            {title && (
                                <h2 className="font-pixel text-sm text-[#E8F5E9]">{title}</h2>
                            )}
                            {description && (
                                <p className="mt-2 text-sm text-[#8BA889]">{description}</p>
                            )}
                        </div>
                        {showCloseButton && (
                            <button
                                onClick={onClose}
                                className="
                  p-2 -mt-1 -mr-2
                  text-[#8BA889] hover:text-[#E8F5E9]
                  hover:bg-[#232A26]
                  transition-colors duration-200
                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                {/* Body */}
                <div className="p-5">
                    {children}
                </div>
            </div>
        </div>
    );
}

interface ModalFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
    return (
        <div className={`flex items-center justify-end gap-3 mt-5 pt-5 border-t-2 border-[#2E3830] ${className}`}>
            {children}
        </div>
    );
}
