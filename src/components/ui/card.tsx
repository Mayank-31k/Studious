import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hover' | 'glow';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    onClick?: () => void;
}

export function Card({
    children,
    className = '',
    variant = 'default',
    padding = 'md',
    onClick,
}: CardProps) {
    const baseStyles = `
    bg-[#1A1F1C]
    border-4 border-[#2E3830]
    shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.3),inset_3px_3px_0_rgba(255,255,255,0.03)]
    transition-all duration-300
  `;

    const variants = {
        default: '',
        hover: `
      cursor-pointer
      hover:border-[#3D4A42]
      hover:shadow-[0_0_20px_rgba(74,140,63,0.2)]
      hover:translate-y-[-2px]
      active:translate-y-0
    `,
        glow: `
      border-[#4A8C3F]
      shadow-[0_0_20px_rgba(74,140,63,0.3),inset_-3px_-3px_0_#1E3D1A,inset_3px_3px_0_#4A8C3F]
    `,
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-7',
    };

    return (
        <div
            className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
    return (
        <div className={`mb-4 ${className}`}>
            {children}
        </div>
    );
}

interface CardTitleProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className = '', as: Component = 'h3' }: CardTitleProps) {
    return (
        <Component className={`font-pixel text-sm text-[#E8F5E9] ${className}`}>
            {children}
        </Component>
    );
}

interface CardDescriptionProps {
    children: React.ReactNode;
    className?: string;
}

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
    return (
        <p className={`text-sm text-[#8BA889] mt-1 ${className}`}>
            {children}
        </p>
    );
}

interface CardContentProps {
    children: React.ReactNode;
    className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
    return (
        <div className={className}>
            {children}
        </div>
    );
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
    return (
        <div className={`mt-4 pt-4 border-t-2 border-[#2E3830] ${className}`}>
            {children}
        </div>
    );
}
