import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    children: React.ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-sans font-semibold
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1210]
    disabled:opacity-50 disabled:cursor-not-allowed
    relative overflow-hidden
  `;

    const variants = {
        primary: `
      bg-[#2D5A27] text-[#E8F5E9]
      border-4 border-[#1E3D1A]
      shadow-[inset_-3px_-3px_0_#1E3D1A,inset_3px_3px_0_#4A8C3F]
      hover:bg-[#4A8C3F] hover:shadow-[0_0_20px_rgba(74,140,63,0.4)]
      active:shadow-[inset_3px_3px_0_#1E3D1A,inset_-3px_-3px_0_#4A8C3F]
      focus:ring-[#4A8C3F]
    `,
        secondary: `
      bg-[#E8B923] text-[#0F1210]
      border-4 border-[#C49A1A]
      shadow-[inset_-3px_-3px_0_#C49A1A,inset_3px_3px_0_#FFD54F]
      hover:bg-[#FFD54F] hover:shadow-[0_0_20px_rgba(232,185,35,0.4)]
      active:shadow-[inset_3px_3px_0_#C49A1A,inset_-3px_-3px_0_#FFD54F]
      focus:ring-[#E8B923]
    `,
        outline: `
      bg-transparent text-[#E8F5E9]
      border-4 border-[#2E3830]
      hover:border-[#4A8C3F] hover:text-[#4A8C3F]
      active:bg-[#1A1F1C]
      focus:ring-[#4A8C3F]
    `,
        ghost: `
      bg-transparent text-[#B8C9BA]
      border-none
      hover:bg-[#1A1F1C] hover:text-[#E8F5E9]
      active:bg-[#232A26]
      focus:ring-[#4A8C3F]
    `,
        danger: `
      bg-[#EF5350] text-white
      border-4 border-[#C62828]
      shadow-[inset_-3px_-3px_0_#C62828,inset_3px_3px_0_#FF8A80]
      hover:bg-[#FF8A80] hover:shadow-[0_0_20px_rgba(239,83,80,0.4)]
      active:shadow-[inset_3px_3px_0_#C62828,inset_-3px_-3px_0_#FF8A80]
      focus:ring-[#EF5350]
    `,
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-7 py-3.5 text-base',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                leftIcon
            )}
            {children}
            {rightIcon && !isLoading && rightIcon}
        </button>
    );
}
