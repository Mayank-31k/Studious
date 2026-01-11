'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
    const { showError, showSuccess } = useToast();

    const [showVerificationMessage, setShowVerificationMessage] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(email, password, fullName);

            if (error) {
                showError(getErrorMessage(error));
                setLoading(false);
            } else {
                setShowVerificationMessage(true);
                setLoading(false);
                // Don't redirect to dashboard - user needs to verify email first
            }
        } catch (err) {
            showError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            const { error } = await signInWithGoogle();
            if (error) {
                showError(getErrorMessage(error));
                setGoogleLoading(false);
            }
            // Note: On success, user will be redirected to Google OAuth page
        } catch (err) {
            showError('Failed to sign in with Google. Please try again.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8">
                {showVerificationMessage ? (
                    /* Email Verification Message */
                    <div className="text-center space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Check your email
                            </h1>
                            <p className="mt-3 text-base text-muted-foreground">
                                We've sent a verification link to
                            </p>
                            <p className="mt-1 text-base font-medium text-foreground">
                                {email}
                            </p>
                        </div>
                        <div className="bg-secondary/30 border border-border/30 rounded-lg p-4 text-sm text-muted-foreground text-left space-y-2">
                            <p className="font-medium text-foreground">Next steps:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-2">
                                <li>Check your email inbox (and spam folder)</li>
                                <li>Click the verification link in the email</li>
                                <li>Return here to sign in</li>
                            </ol>
                        </div>
                        <div className="pt-4">
                            <Link href="/login">
                                <Button className="w-full" size="lg">
                                    Go to Sign In
                                </Button>
                            </Link>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Didn't receive the email?{' '}
                            <button
                                onClick={() => setShowVerificationMessage(false)}
                                className="underline underline-offset-4 hover:text-primary"
                            >
                                Try again
                            </button>
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="text-center">
                            <h1 className="text-3xl font-bold tracking-tight text-foreground">
                                Create an account
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Enter your email below to create your account
                            </p>
                        </div>

                        {/* Google Sign In Button */}
                        <Button
                            variant="outline"
                            className="w-full h-11"
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                        >
                            {googleLoading ? (
                                <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                                <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                                    <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                                </svg>
                            )}
                            {googleLoading ? 'Signing in...' : 'Continue with Google'}
                        </Button>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                isLoading={loading}
                            >
                                Sign Up
                            </Button>
                        </form>

                        {/* Bottom Links */}
                        <div className="text-center text-sm text-muted-foreground">
                            <div className="mt-2">
                                Already have an account?{' '}
                                <Link href="/login" className="underline underline-offset-4 hover:text-primary">
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
