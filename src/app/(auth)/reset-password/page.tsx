'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const { resetPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await resetPassword(email);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0F1210] bg-grid p-4">
                <div className="w-full max-w-md animate-slide-up">
                    <Card variant="glow" padding="lg">
                        <CardContent className="text-center py-8">
                            <div className="
                w-16 h-16 mx-auto mb-6 flex items-center justify-center
                bg-[#E8B923] border-4 border-[#C49A1A]
                shadow-[0_0_30px_rgba(232,185,35,0.4)]
              ">
                                <svg className="w-8 h-8 text-[#0F1210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h2 className="font-pixel text-sm text-[#E8F5E9] mb-3">CHECK YOUR EMAIL</h2>
                            <p className="text-[#B8C9BA] mb-6">
                                If an account exists for <span className="text-[#E8B923]">{email}</span>,
                                we&apos;ve sent a password reset link.
                            </p>
                            <Link href="/login">
                                <Button variant="outline" size="md">
                                    Back to Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F1210] bg-grid p-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="
              w-16 h-16 mx-auto mb-4 flex items-center justify-center
              bg-[#2D5A27] border-4 border-[#1E3D1A]
              shadow-[inset_-3px_-3px_0_#1E3D1A,inset_3px_3px_0_#4A8C3F,0_0_30px_rgba(74,140,63,0.4)]
            ">
                            <span className="font-pixel text-[#E8B923] text-xl">S</span>
                        </div>
                    </Link>
                    <h1 className="font-pixel text-xl text-[#E8F5E9]">STUDIOUS</h1>
                    <p className="text-[#8BA889] mt-2">Reset your password</p>
                </div>

                <Card variant="glow" padding="lg">
                    <CardHeader>
                        <CardTitle>Forgot Password?</CardTitle>
                        <CardDescription>Enter your email and we&apos;ll send you a reset link</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-[#EF5350]/10 border-2 border-[#EF5350] text-[#EF5350] text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="you@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                }
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={loading}
                            >
                                Send Reset Link
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <Link href="/login" className="text-sm text-[#E8B923] hover:text-[#FFD54F]">
                            ← Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
