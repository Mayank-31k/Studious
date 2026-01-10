'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

export default function ProfilePage() {
    const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth();
    const router = useRouter();

    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    React.useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setAvatarUrl(profile.avatar_url || '');
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setSaving(true);

        const { error } = await updateProfile({
            full_name: fullName,
            avatar_url: avatarUrl || null,
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        }

        setSaving(false);
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#0F1210] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-[#2D5A27] border-4 border-[#1E3D1A] shadow-[0_0_30px_rgba(74,140,63,0.4)] animate-pulse">
                        <span className="font-pixel text-[#E8B923] text-lg">S</span>
                    </div>
                    <p className="text-[#8BA889]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1210]">
            <Header user={profile ? { ...profile, id: user.id } : null} onSignOut={signOut} />

            <div className="max-w-2xl mx-auto p-6">
                <h1 className="font-pixel text-base text-[#E8F5E9] mb-6">PROFILE SETTINGS</h1>

                <Card variant="glow" padding="lg">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={avatarUrl}
                                fallback={fullName || user.email || '?'}
                                size="xl"
                                variant="glow"
                            />
                            <div>
                                <CardTitle>{fullName || 'Your Name'}</CardTitle>
                                <p className="text-sm text-[#8BA889] mt-1">{user.email}</p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-3 bg-[#EF5350]/10 border-2 border-[#EF5350] text-[#EF5350] text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-[#4CAF50]/10 border-2 border-[#4CAF50] text-[#4CAF50] text-sm">
                                    Profile updated successfully!
                                </div>
                            )}

                            <Input
                                label="Full Name"
                                type="text"
                                placeholder="Your Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />

                            <Input
                                label="Avatar URL"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                helperText="Enter a URL to an image for your avatar"
                            />

                            <Input
                                label="Email"
                                type="email"
                                value={user.email || ''}
                                disabled
                                helperText="Email cannot be changed"
                            />

                            <div className="flex items-center justify-between pt-4 border-t-2 border-[#2E3830]">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.push('/dashboard')}
                                >
                                    Back to Dashboard
                                </Button>
                                <Button type="submit" variant="primary" isLoading={saving}>
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
