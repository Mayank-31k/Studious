'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Avatar } from '@/components/ui/avatar';
import { getErrorMessage } from '@/lib/utils/errorHandler';
import { Plus, ArrowRight, Hash, Loader2 } from 'lucide-react';
import { LoadingAnimation } from '@/components/ui/loading-animation';

export default function DashboardPage() {
    const { user, profile, loading: authLoading, groups, groupsLoading, refreshGroups } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [joinModalOpen, setJoinModalOpen] = useState(false);
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

    const generateInviteCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            setFormError('Workspace name is required');
            return;
        }
        setFormError('');
        setFormLoading(true);

        if (!user) return;

        const invite_code = generateInviteCode();
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .insert({ name: newGroupName, description: newGroupDescription || null, created_by: user.id, invite_code })
            .select().single();

        if (groupError) {
            setFormError(getErrorMessage(groupError));
            setFormLoading(false);
            return;
        }

        const { error: memberError } = await supabase
            .from('group_members')
            .insert({ group_id: group.id, user_id: user.id, role: 'admin' });

        if (memberError) {
            setFormError(getErrorMessage(memberError));
            setFormLoading(false);
            return;
        }

        setNewGroupName('');
        setNewGroupDescription('');
        setFormLoading(false);
        setCreateModalOpen(false);
        refreshGroups();
    };

    const handleJoinGroup = async () => {
        if (!inviteCode.trim()) {
            setFormError('Invite code is required');
            return;
        }
        setFormError('');
        setFormLoading(true);

        if (!user) return;

        const { data: group, error: findError } = await supabase
            .from('groups')
            .select('id')
            .eq('invite_code', inviteCode.toUpperCase())
            .single();

        if (findError || !group) {
            setFormError('Invalid invite code');
            setFormLoading(false);
            return;
        }

        const { data: existing } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', group.id)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            setFormError('Already a member');
            setFormLoading(false);
            return;
        }

        const { error: joinError } = await supabase
            .from('group_members')
            .insert({ group_id: group.id, user_id: user.id, role: 'member' });

        if (joinError) {
            setFormError(getErrorMessage(joinError));
            setFormLoading(false);
            return;
        }

        setInviteCode('');
        setFormLoading(false);
        setJoinModalOpen(false);
        refreshGroups();
    };

    if (authLoading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white">
                <LoadingAnimation />
            </div>
        );
    }
    if (!user) return null;

    return (
        <div className="flex-1 overflow-y-auto bg-white">
            <div className="max-w-[1400px] mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-[42px] font-semibold text-foreground tracking-tight mb-2">
                                Workspaces
                            </h1>
                            <p className="text-[17px] text-muted-foreground">
                                Manage your collaborative spaces
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setJoinModalOpen(true)}
                                className="h-11 px-5 border-border hover:bg-secondary text-foreground font-medium rounded-lg transition-all"
                            >
                                Join workspace
                            </Button>
                            <Button
                                onClick={() => setCreateModalOpen(true)}
                                className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New workspace
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Workspaces Grid */}
                {groupsLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <LoadingAnimation />
                    </div>
                ) : groups.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">No workspaces yet</h3>
                        <p className="text-muted-foreground mb-8 text-center max-w-md">
                            Create your first workspace to start collaborating
                        </p>
                        <Button
                            onClick={() => setCreateModalOpen(true)}
                            className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create workspace
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groups.map((group) => (
                            <Link
                                key={group.id}
                                href={`/groups/${group.id}`}
                                className="group block"
                            >
                                <div className="bg-white border border-[#611f69]/30 hover:border-[#611f69] shadow-sm hover:shadow-md transition-all duration-200 h-full rounded-xl overflow-hidden">
                                    {/* Purple accent bar */}
                                    <div className="h-1 bg-[#611f69]" />

                                    <div className="p-5">
                                        <div className="flex items-start gap-4 mb-3">
                                            <Avatar
                                                src={group.avatar_url || undefined}
                                                fallback={group.name}
                                                className="w-12 h-12 rounded-xl shadow-sm"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[17px] font-semibold text-gray-900 mb-1 truncate group-hover:text-[#611f69] transition-colors">
                                                    {group.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 font-mono">
                                                    #{group.invite_code}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-[15px] text-gray-600 line-clamp-2 mb-4">
                                            {group.description || "No description"}
                                        </p>

                                        <div className="flex items-center text-sm text-[#611f69] font-medium">
                                            Open workspace
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Workspace Modal */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setNewGroupName('');
                    setNewGroupDescription('');
                    setFormError('');
                }}
                title="Create a new workspace"
                description="Create a workspace for your team to collaborate"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1.5">
                            Workspace Name *
                        </label>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="e.g., Study Group 101"
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1.5">
                            Description (optional)
                        </label>
                        <textarea
                            value={newGroupDescription}
                            onChange={(e) => setNewGroupDescription(e.target.value)}
                            placeholder="What's this workspace about?"
                            rows={3}
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69] resize-none"
                        />
                    </div>
                    {formError && (
                        <p className="text-red-400 text-sm">{formError}</p>
                    )}
                </div>
                <ModalFooter>
                    <button
                        onClick={() => {
                            setCreateModalOpen(false);
                            setNewGroupName('');
                            setNewGroupDescription('');
                            setFormError('');
                        }}
                        className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        disabled={formLoading}
                        className="px-4 py-2 bg-[#611f69] text-white text-sm font-medium rounded-md hover:bg-[#7c2d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {formLoading ? 'Creating...' : 'Create Workspace'}
                    </button>
                </ModalFooter>
            </Modal>

            {/* Join Workspace Modal */}
            <Modal
                isOpen={joinModalOpen}
                onClose={() => {
                    setJoinModalOpen(false);
                    setInviteCode('');
                    setFormError('');
                }}
                title="Join a workspace"
                description="Enter the invite code shared by your team"
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-1.5">
                            Invite Code *
                        </label>
                        <input
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="e.g., ABC123"
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69] uppercase tracking-wider text-center text-lg font-mono"
                        />
                        <p className="text-xs text-white/50 mt-1.5">
                            Ask your workspace admin for the invite code
                        </p>
                    </div>
                    {formError && (
                        <p className="text-red-400 text-sm">{formError}</p>
                    )}
                </div>
                <ModalFooter>
                    <button
                        onClick={() => {
                            setJoinModalOpen(false);
                            setInviteCode('');
                            setFormError('');
                        }}
                        className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoinGroup}
                        disabled={formLoading}
                        className="px-4 py-2 bg-[#611f69] text-white text-sm font-medium rounded-md hover:bg-[#7c2d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {formLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {formLoading ? 'Joining...' : 'Join Workspace'}
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
