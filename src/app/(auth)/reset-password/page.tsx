'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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
            setError(getErrorMessage(error));
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
                {/* Ambient Background */}
                <div className="absolute inset-0 bg-black">
                    <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse-glow" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md relative z-10 px-4"
                >
                    <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
                        <CardContent className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-green-500/10 rounded-full">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Check your email</h2>
                            <p className="text-muted-foreground mb-6">
                                If an account exists for <span className="text-white font-medium">{email}</span>,
                                we&apos;ve sent a password reset link.
                            </p>
                            <Link href="/login">
                                <Button variant="outline" className="border-white/10 hover:bg-white/5 text-white">
                                    Back to Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute bottom-[-20%] right-[10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse-glow" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md relative z-10 px-4"
            >
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">Reset Password</h1>
                    <p className="text-muted-foreground">Enter your email to receive instructions</p>
                </div>

                <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <Input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                leftIcon={<Mail className="w-4 h-4" />}
                                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:bg-white/10 focus:border-blue-500/50"
                            />

                            <Button
                                type="submit"
                                className="w-full bg-white text-black hover:bg-neutral-200 border-0"
                                size="lg"
                                isLoading={loading}
                            >
                                Send Reset Link
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="justify-center border-t border-white/5 pt-6">
                        <Link href="/login" className="text-sm text-neutral-400 hover:text-white transition-colors">
                            ← Back to Login
                        </Link>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
