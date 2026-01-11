'use client';

import { Button } from '@/components/ui/button';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-white px-4">
                    <div className="text-center max-w-md space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl font-bold text-gray-900">
                                Critical Error
                            </h1>
                            <p className="text-gray-600">
                                Something went wrong with the application. Please try refreshing the page.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Try again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Go to Home
                            </button>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    );
}
