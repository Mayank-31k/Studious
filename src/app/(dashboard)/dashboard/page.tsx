'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import type { Group } from '@/types/database.types';

export default function DashboardPage() {
    const { user, profile, signOut, loading: authLoading, groups, groupsLoading, refreshGroups } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // Modal states
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(false);

    // Form states
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupDescription, setNewGroupDescription] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const generateInviteCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const handleCreateGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        if (!user) return;

        const invite_code = generateInviteCode();

        // Create group
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .insert({
                name: newGroupName,
                description: newGroupDescription || null,
                created_by: user.id,
                invite_code,
            })
            .select()
            .single();

        if (groupError) {
            setFormError(groupError.message);
            setFormLoading(false);
            return;
        }

        // Add creator as admin
        const { error: memberError } = await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: user.id,
                role: 'admin',
            });

        if (memberError) {
            setFormError(memberError.message);
            setFormLoading(false);
            return;
        }

        setNewGroupName('');
        setNewGroupDescription('');
        setFormLoading(false);
        setCreateModalOpen(false);
        refreshGroups();
    };

    const handleJoinGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        setFormLoading(true);

        if (!user) return;

        // Find group by invite code
        const { data: group, error: findError } = await supabase
            .from('groups')
            .select('id')
            .eq('invite_code', inviteCode.toUpperCase())
            .single();

        if (findError || !group) {
            setFormError('Invalid invite code. Please check and try again.');
            setFormLoading(false);
            return;
        }

        // Check if already a member
        const { data: existing } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            setFormError('You are already a member of this group.');
            setFormLoading(false);
            return;
        }

        // Join group
        const { error: joinError } = await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: user.id,
                role: 'member',
            });

        if (joinError) {
            setFormError(joinError.message);
            setFormLoading(false);
            return;
        }

        setInviteCode('');
        setFormLoading(false);
        setJoinModalOpen(false);
        refreshGroups();
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-[#0F1210] flex items-center justify-center">
                <div className="text-center">
                    <div className="
            w-16 h-16 mx-auto mb-4 flex items-center justify-center
            bg-[#2D5A27] border-4 border-[#1E3D1A]
            shadow-[0_0_30px_rgba(74,140,63,0.4)]
            animate-pulse
          ">
                        <span className="font-pixel text-[#E8B923] text-lg">S</span>
                    </div>
                    <p className="text-[#8BA889]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F1210] flex flex-col">
            <Header
                user={profile ? { ...profile, id: user.id } : null}
                onSignOut={signOut}
            />

            <div className="flex-1 flex">
                <Sidebar
                    groups={groups}
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    onCreateGroup={() => setCreateModalOpen(true)}
                />

                <main className="flex-1 p-6 overflow-auto">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="font-pixel text-base text-[#E8F5E9] mb-2">
                            WELCOME BACK{profile?.full_name ? `, ${profile.full_name.split(' ')[0].toUpperCase()}` : ''}!
                        </h1>
                        <p className="text-[#8BA889]">Manage your study groups and collaborate with classmates</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-4 mb-8">
                        <Button
                            variant="primary"
                            onClick={() => setCreateModalOpen(true)}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        >
                            Create Group
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setJoinModalOpen(true)}
                            leftIcon={
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            }
                        >
                            Join Group
                        </Button>
                    </div>

                    {/* Groups Grid */}
                    <div className="mb-6">
                        <h2 className="font-pixel text-xs text-[#B8C9BA] mb-4">YOUR GROUPS</h2>

                        {groupsLoading ? (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-40 bg-[#1A1F1C] border-4 border-[#2E3830] skeleton" />
                                ))}
                            </div>
                        ) : groups.length === 0 ? (
                            <Card padding="lg">
                                <CardContent className="text-center py-12">
                                    <div className="
                    w-16 h-16 mx-auto mb-6 flex items-center justify-center
                    bg-[#1A1F1C] border-4 border-[#2E3830]
                  ">
                                        <svg className="w-8 h-8 text-[#8BA889]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-pixel text-xs text-[#E8F5E9] mb-2">NO GROUPS YET</h3>
                                    <p className="text-sm text-[#8BA889] mb-6">
                                        Create a new group or join an existing one to start collaborating
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
                                            Create Group
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setJoinModalOpen(true)}>
                                            Join Group
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {groups.map((group) => (
                                    <Link key={group.id} href={`/groups/${group.id}`}>
                                        <Card variant="hover" padding="md" className="h-full">
                                            <CardHeader>
                                                <div className="flex items-center gap-3">
                                                    <Avatar fallback={group.name} size="md" variant="pixel" />
                                                    <CardTitle>{group.name}</CardTitle>
                                                </div>
                                                {group.description && (
                                                    <CardDescription className="mt-2 line-clamp-2">
                                                        {group.description}
                                                    </CardDescription>
                                                )}
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex items-center justify-between text-xs text-[#8BA889]">
                                                    <span>Code: {group.invite_code}</span>
                                                    <svg className="w-5 h-5 text-[#4A8C3F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Create Group Modal */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                title="Create New Group"
                description="Start a new study group and invite your classmates"
            >
                <form onSubmit={handleCreateGroup}>
                    {formError && (
                        <div className="mb-4 p-3 bg-[#EF5350]/10 border-2 border-[#EF5350] text-[#EF5350] text-sm">
                            {formError}
                        </div>
                    )}
                    <div className="space-y-4">
                        <Input
                            label="Group Name"
                            placeholder="e.g., CS101 Study Group"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            required
                        />
                        <Textarea
                            label="Description (Optional)"
                            placeholder="What's this group about?"
                            value={newGroupDescription}
                            onChange={(e) => setNewGroupDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <ModalFooter>
                        <Button variant="ghost" type="button" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" isLoading={formLoading}>
                            Create Group
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>

            {/* Join Group Modal */}
            <Modal
                isOpen={joinModalOpen}
                onClose={() => setJoinModalOpen(false)}
                title="Join a Group"
                description="Enter the invite code shared by your classmate"
            >
                <form onSubmit={handleJoinGroup}>
                    {formError && (
                        <div className="mb-4 p-3 bg-[#EF5350]/10 border-2 border-[#EF5350] text-[#EF5350] text-sm">
                            {formError}
                        </div>
                    )}
                    <Input
                        label="Invite Code"
                        placeholder="e.g., ABC123"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                        required
                        className="font-mono text-center text-lg tracking-widest"
                    />
                    <ModalFooter>
                        <Button variant="ghost" type="button" onClick={() => setJoinModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="secondary" type="submit" isLoading={formLoading}>
                            Join Group
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}
