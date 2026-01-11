"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { PenSquare, LogOut, Home, Hash, ChevronDown, Plus, Search, MessageSquare, UserPlus, Loader2 } from 'lucide-react';

export function GroupSidebar() {
    const { groups, profile, signOut, refreshGroups, user } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [channelsExpanded, setChannelsExpanded] = useState(true);

    // Create workspace modal state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createDescription, setCreateDescription] = useState('');
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    // Join workspace modal state
    const [joinModalOpen, setJoinModalOpen] = useState(false);
    const [joinCode, setJoinCode] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const [joinError, setJoinError] = useState('');

    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(search.toLowerCase())
    );

    // Generate unique invite code
    const generateInviteCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    // Create workspace handler
    const handleCreateWorkspace = async () => {
        if (!createName.trim()) {
            setCreateError('Workspace name is required');
            return;
        }
        if (!user) {
            setCreateError('You must be logged in');
            return;
        }

        setCreateLoading(true);
        setCreateError('');

        try {
            const supabase = createClient();
            const inviteCode = generateInviteCode();

            // Create the group
            const { data: group, error: groupError } = await supabase
                .from('groups')
                .insert({
                    name: createName.trim(),
                    description: createDescription.trim() || null,
                    created_by: user.id,
                    invite_code: inviteCode,
                })
                .select()
                .single();

            if (groupError) throw groupError;

            // Add creator as admin member
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.id,
                    role: 'admin',
                });

            if (memberError) throw memberError;

            // Refresh groups and close modal
            await refreshGroups();
            setCreateModalOpen(false);
            setCreateName('');
            setCreateDescription('');

            // Navigate to the new workspace
            router.push(`/groups/${group.id}`);
        } catch (error: any) {
            setCreateError(error.message || 'Failed to create workspace');
        } finally {
            setCreateLoading(false);
        }
    };

    // Join workspace handler
    const handleJoinWorkspace = async () => {
        if (!joinCode.trim()) {
            setJoinError('Invite code is required');
            return;
        }
        if (!user) {
            setJoinError('You must be logged in');
            return;
        }

        setJoinLoading(true);
        setJoinError('');

        try {
            const supabase = createClient();

            // Find the group by invite code
            const { data: group, error: groupError } = await supabase
                .from('groups')
                .select('id, name')
                .eq('invite_code', joinCode.trim().toUpperCase())
                .single();

            if (groupError || !group) {
                throw new Error('Invalid invite code. Please check and try again.');
            }

            // Check if already a member
            const { data: existingMember } = await supabase
                .from('group_members')
                .select('id')
                .eq('group_id', group.id)
                .eq('user_id', user.id)
                .single();

            if (existingMember) {
                throw new Error('You are already a member of this workspace.');
            }

            // Add user as member
            const { error: memberError } = await supabase
                .from('group_members')
                .insert({
                    group_id: group.id,
                    user_id: user.id,
                    role: 'member',
                });

            if (memberError) throw memberError;

            // Refresh groups and close modal
            await refreshGroups();
            setJoinModalOpen(false);
            setJoinCode('');

            // Navigate to the joined workspace
            router.push(`/groups/${group.id}`);
        } catch (error: any) {
            setJoinError(error.message || 'Failed to join workspace');
        } finally {
            setJoinLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full w-[280px]" style={{ backgroundColor: '#3F0E40' }}>
            {/* Workspace Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: '#522653' }}>
                <button
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    onClick={() => router.push('/dashboard')}
                >
                    <span className="text-lg font-bold text-white">Studious</span>
                    <ChevronDown className="h-4 w-4 text-white/70" />
                </button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                >
                    <PenSquare className="h-4 w-4" />
                </Button>
            </div>

            {/* Search Bar */}
            <div className="px-3 py-3">
                <button
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                    <Search className="h-4 w-4 text-white/60" />
                    <span className="text-white/60">Search Studious</span>
                </button>
            </div>

            {/* Navigation Items */}
            <div className="px-2 space-y-0.5">
                <button
                    onClick={() => router.push('/dashboard')}
                    className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                        pathname === '/dashboard'
                            ? "bg-[#1164A3] text-white"
                            : "text-white/80 hover:bg-white/10"
                    )}
                >
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                </button>

            </div>

            {/* Channels Section */}
            <div className="mt-4">
                <button
                    onClick={() => setChannelsExpanded(!channelsExpanded)}
                    className="w-full flex items-center gap-1 px-4 py-1 text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                    <ChevronDown className={cn(
                        "h-3 w-3 transition-transform",
                        !channelsExpanded && "-rotate-90"
                    )} />
                    <span>Workspaces</span>
                </button>
            </div>

            {/* Groups/Channels List */}
            <ScrollArea className="flex-1 px-2">
                {channelsExpanded && (
                    <div className="py-1 space-y-0.5">
                        {filteredGroups.map(group => {
                            const isActive = pathname === `/groups/${group.id}`;
                            return (
                                <Link
                                    key={group.id}
                                    href={`/groups/${group.id}`}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors group",
                                        isActive
                                            ? "bg-[#1164A3] text-white"
                                            : "text-white/80 hover:bg-white/10"
                                    )}
                                >
                                    <Hash className="h-4 w-4 flex-shrink-0" />
                                    <span className="truncate font-medium">{group.name.toLowerCase().replace(/\s+/g, '-')}</span>
                                </Link>
                            );
                        })}

                        {/* Add Channel Button */}
                        <button
                            onClick={() => setCreateModalOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add workspace</span>
                        </button>

                        {/* Join Workspace Button */}
                        <button
                            onClick={() => setJoinModalOpen(true)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                        >
                            <UserPlus className="h-4 w-4" />
                            <span>Join workspace</span>
                        </button>
                    </div>
                )}
            </ScrollArea>

            {/* User Footer */}
            <div className="mt-auto border-t" style={{ borderColor: '#522653', backgroundColor: '#350D36' }}>
                <div
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-3 p-3 cursor-pointer group hover:bg-white/5 transition-colors"
                >
                    <div className="relative">
                        <Avatar
                            src={profile?.avatar_url || undefined}
                            fallback={profile?.full_name || '?'}
                            className="h-9 w-9 ring-2 ring-white/20"
                        />
                        {/* Online Status Indicator */}
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2" style={{ borderColor: '#350D36' }}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{profile?.full_name}</p>
                        <p className="text-xs text-green-400 truncate flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                            Active
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                            e.stopPropagation();
                            signOut();
                        }}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-white/60 hover:text-white hover:bg-white/10"
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Create Workspace Modal */}
            <Modal
                isOpen={createModalOpen}
                onClose={() => {
                    setCreateModalOpen(false);
                    setCreateName('');
                    setCreateDescription('');
                    setCreateError('');
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
                            value={createName}
                            onChange={(e) => setCreateName(e.target.value)}
                            placeholder="e.g., Study Group 101"
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-1.5">
                            Description (optional)
                        </label>
                        <textarea
                            value={createDescription}
                            onChange={(e) => setCreateDescription(e.target.value)}
                            placeholder="What's this workspace about?"
                            rows={3}
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69] resize-none"
                        />
                    </div>
                    {createError && (
                        <p className="text-red-400 text-sm">{createError}</p>
                    )}
                </div>
                <ModalFooter>
                    <button
                        onClick={() => {
                            setCreateModalOpen(false);
                            setCreateName('');
                            setCreateDescription('');
                            setCreateError('');
                        }}
                        className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateWorkspace}
                        disabled={createLoading}
                        className="px-4 py-2 bg-[#611f69] text-white text-sm font-medium rounded-md hover:bg-[#7c2d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {createLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {createLoading ? 'Creating...' : 'Create Workspace'}
                    </button>
                </ModalFooter>
            </Modal>

            {/* Join Workspace Modal */}
            <Modal
                isOpen={joinModalOpen}
                onClose={() => {
                    setJoinModalOpen(false);
                    setJoinCode('');
                    setJoinError('');
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
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                            placeholder="e.g., ABC123"
                            className="w-full px-3 py-2 bg-[#522653] border border-[#611f69] rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#611f69] uppercase tracking-wider text-center text-lg font-mono"
                        />
                        <p className="text-xs text-white/50 mt-1.5">
                            Ask your workspace admin for the invite code
                        </p>
                    </div>
                    {joinError && (
                        <p className="text-red-400 text-sm">{joinError}</p>
                    )}
                </div>
                <ModalFooter>
                    <button
                        onClick={() => {
                            setJoinModalOpen(false);
                            setJoinCode('');
                            setJoinError('');
                        }}
                        className="px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleJoinWorkspace}
                        disabled={joinLoading}
                        className="px-4 py-2 bg-[#611f69] text-white text-sm font-medium rounded-md hover:bg-[#7c2d82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {joinLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {joinLoading ? 'Joining...' : 'Join Workspace'}
                    </button>
                </ModalFooter>
            </Modal>
        </div>
    );
}
