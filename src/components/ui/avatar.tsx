import React from 'react';

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'pixel' | 'glow';
    className?: string;
}

export function Avatar({
    src,
    alt = 'User avatar',
    fallback,
    size = 'md',
    variant = 'default',
    className = '',
}: AvatarProps) {
    const sizes = {
        xs: 'w-6 h-6 text-[8px]',
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-20 h-20 text-lg',
    };

    const variants = {
        default: 'border-2 border-[#2E3830]',
        pixel: 'border-4 border-[#2E3830] shadow-[inset_-2px_-2px_0_rgba(0,0,0,0.3),inset_2px_2px_0_rgba(255,255,255,0.05)]',
        glow: 'border-4 border-[#4A8C3F] shadow-[0_0_15px_rgba(74,140,63,0.4)]',
    };

    const getFallbackInitials = () => {
        if (fallback) return fallback.slice(0, 2).toUpperCase();
        if (alt) return alt.split(' ').map(word => word[0]).join('').slice(0, 2).toUpperCase();
        return '?';
    };

    const getBackgroundColor = () => {
        const colors = [
            'bg-[#2D5A27]',
            'bg-[#4A8C3F]',
            'bg-[#E8B923]',
            'bg-[#C49A1A]',
            'bg-[#1E3D1A]',
        ];
        const index = (fallback || alt || '').charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div
            className={`
        relative inline-flex items-center justify-center
        rounded-sm overflow-hidden
        ${sizes[size]}
        ${variants[variant]}
        ${!src ? getBackgroundColor() : ''}
        ${className}
      `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : (
                <span className="font-pixel text-[#E8F5E9]">
                    {getFallbackInitials()}
                </span>
            )}
        </div>
    );
}

interface AvatarGroupProps {
    children: React.ReactNode;
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    className?: string;
}

export function AvatarGroup({
    children,
    max = 4,
    size = 'md',
    className = '',
}: AvatarGroupProps) {
    const childrenArray = React.Children.toArray(children);
    const visibleChildren = childrenArray.slice(0, max);
    const remainingCount = childrenArray.length - max;

    const overlapClasses = {
        xs: '-ml-2',
        sm: '-ml-3',
        md: '-ml-4',
        lg: '-ml-5',
    };

    return (
        <div className={`flex items-center ${className}`}>
            {visibleChildren.map((child, index) => (
                <div
                    key={index}
                    className={index > 0 ? overlapClasses[size] : ''}
                    style={{ zIndex: visibleChildren.length - index }}
                >
                    {child}
                </div>
            ))}
            {remainingCount > 0 && (
                <div className={overlapClasses[size]} style={{ zIndex: 0 }}>
                    <Avatar
                        size={size}
                        fallback={`+${remainingCount}`}
                        variant="pixel"
                    />
                </div>
            )}
        </div>
    );
}
