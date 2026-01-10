'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

export default function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { signUp } = useAuth();
    const router = useRouter();
    const { showError, showSuccess } = useToast();

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
                showSuccess('Account created successfully!');
                setLoading(false);
                router.push('/dashboard');
            }
        } catch (err) {
            showError('An unexpected error occurred. Please try again.');
            setLoading(false);
        }
    };

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
                    <p className="text-[#8BA889] mt-2">Join the study revolution</p>
                </div>

                <Card variant="glow" padding="lg">
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Start collaborating with your classmates</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Your Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                }
                            />

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

                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                helperText="At least 6 characters"
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                }
                            />

                            <Input
                                label="Confirm Password"
                                type="password"
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                leftIcon={
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
                                Create Account
                            </Button>
                        </form>
                    </CardContent>

                    <CardFooter className="justify-center">
                        <p className="text-sm text-[#8BA889]">
                            Already have an account?{' '}
                            <Link href="/login" className="text-[#E8B923] hover:text-[#FFD54F] font-medium">
                                Log in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
