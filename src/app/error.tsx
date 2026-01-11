'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to console for debugging (only visible server-side in production)
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="text-center max-w-md space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We encountered an unexpected error. Don't worry, our team has been notified.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={reset}
                        className="bg-black hover:bg-gray-800 text-white"
                    >
                        Try again
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        Go to Dashboard
                    </Button>
                </div>

                <p className="text-xs text-muted-foreground">
                    Error ID: {error.digest || 'Unknown'}
                </p>
            </div>
        </div>
    );
}
