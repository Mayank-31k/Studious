import React from 'react';

export function LoadingSpinner({ fullScreen = false }: { fullScreen?: boolean }) {
    const content = (
        <div className="flex items-center justify-center">
            <div className="w-16 h-16 flex items-center justify-center bg-[#2D5A27] border-4 border-[#1E3D1A] shadow-[0_0_30px_rgba(74,140,63,0.4)] animate-pulse">
                <span className="font-pixel text-[#E8B923] text-lg">S</span>
            </div>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen bg-[#0F1210] flex items-center justify-center">
                {content}
            </div>
        );
    }

    return content;
}

export function LoadingSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="h-48 bg-[#1A1F1C] border-4 border-[#2E3830] animate-pulse"
                />
            ))}
        </div>
    );
}
