'use client';

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const LoadingAnimation = () => {
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-32 h-32 md:w-48 md:h-48">
                <DotLottieReact
                    src="https://lottie.host/fc8f671b-6960-48f2-adca-7468b3506af3/xMgp6eJeKG.lottie"
                    loop
                    autoplay
                />
            </div>

        </div>
    );
};

export const FullPageLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
            <LoadingAnimation />
        </div>
    );
};
