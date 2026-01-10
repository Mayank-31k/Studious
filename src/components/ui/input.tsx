import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export function Input({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    id,
    ...props
}: InputProps) {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-[#B8C9BA] mb-2"
                >
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8BA889]">
                        {leftIcon}
                    </div>
                )}
                <input
                    id={inputId}
                    className={`
            w-full px-4 py-3
            bg-[#1A1F1C] text-[#E8F5E9]
            border-4 border-[#2E3830]
            shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3),inset_2px_2px_0_rgba(255,255,255,0.05)]
            placeholder:text-[#8BA889]
            transition-all duration-200
            focus:outline-none focus:border-[#4A8C3F] focus:shadow-[0_0_15px_rgba(74,140,63,0.3)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-[#EF5350] focus:border-[#EF5350] focus:shadow-[0_0_15px_rgba(239,83,80,0.3)]' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8BA889]">
                        {rightIcon}
                    </div>
                )}
            </div>
            {error && (
                <p className="mt-2 text-sm text-[#EF5350]">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-sm text-[#8BA889]">{helperText}</p>
            )}
        </div>
    );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function Textarea({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}: TextareaProps) {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="w-full">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-[#B8C9BA] mb-2"
                >
                    {label}
                </label>
            )}
            <textarea
                id={textareaId}
                className={`
          w-full px-4 py-3 min-h-[120px] resize-y
          bg-[#1A1F1C] text-[#E8F5E9]
          border-4 border-[#2E3830]
          shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3),inset_2px_2px_0_rgba(255,255,255,0.05)]
          placeholder:text-[#8BA889]
          transition-all duration-200
          focus:outline-none focus:border-[#4A8C3F] focus:shadow-[0_0_15px_rgba(74,140,63,0.3)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-[#EF5350] focus:border-[#EF5350] focus:shadow-[0_0_15px_rgba(239,83,80,0.3)]' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-2 text-sm text-[#EF5350]">{error}</p>
            )}
            {helperText && !error && (
                <p className="mt-2 text-sm text-[#8BA889]">{helperText}</p>
            )}
        </div>
    );
}
