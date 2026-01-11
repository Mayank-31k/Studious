"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Trash2, Upload, Shield, ShieldOff } from 'lucide-react';
import type { Group, GroupMember, Profile } from '@/types/database.types';
import { useRouter } from 'next/navigation';

interface GroupSettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    group: Group;
    onGroupUpdated: () => void;
    isAdmin?: boolean;
}

interface MemberWithProfile extends GroupMember {
    profile: Profile;
}

export function GroupSettingsDialog({ open, onOpenChange, group, onGroupUpdated, isAdmin = false }: GroupSettingsDialogProps) {
    const { user, refreshGroups } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const supabase = createClient();

    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || '');
    const [members, setMembers] = useState<MemberWithProfile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState('');

    useEffect(() => {
        if (open) {
            setName(group.name);
            setDescription(group.description || '');
            fetchMembers();
        }
    }, [open, group]);

    const fetchMembers = async () => {
        const { data } = await supabase
            .from('group_members')
            .select('*, profile:user_id(id, email, full_name, avatar_url)')
            .eq('group_id', group.id);

        if (data) {
            setMembers(data as unknown as MemberWithProfile[]);
        }
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            // Use timestamp in filename to bust cache
            const fileName = `${group.id}_${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('group-avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('group-avatars')
                .getPublicUrl(filePath);

            // Add cache-busting query param
            const avatarUrlWithCacheBust = `${publicUrl}?t=${Date.now()}`;

            const { error: updateError } = await supabase
                .from('groups')
                .update({ avatar_url: avatarUrlWithCacheBust })
                .eq('id', group.id);

            if (updateError) throw updateError;

            // Refresh groups in sidebar
            await refreshGroups();
            onGroupUpdated();
            showToast('Avatar updated successfully', 'success');
        } catch (error) {
            showToast('Failed to upload avatar', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('groups')
                .update({ name, description })
                .eq('id', group.id);

            if (error) throw error;

            onGroupUpdated();
            onOpenChange(false);
        } catch (error) {
            console.error('Error updating group:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleToggleAdmin = async (memberId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';

        const { error } = await supabase
            .from('group_members')
            .update({ role: newRole })
            .eq('id', memberId);

        if (!error) {
            fetchMembers();
        }
    };

    const handleDeleteGroup = async () => {
        if (deleteConfirm !== group.name) return;

        try {
            // Delete all related data
            await supabase.from('messages').delete().eq('group_id', group.id);
            await supabase.from('shared_resources').delete().eq('group_id', group.id);
            await supabase.from('group_members').delete().eq('group_id', group.id);
            await supabase.from('groups').delete().eq('id', group.id);

            // Close the dialog and navigate
            onOpenChange(false);
            router.push('/dashboard');

            // Refresh groups list to update UI immediately
            // Note: We need to get refreshGroups from AuthContext
            window.location.reload();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col bg-white border-gray-200 p-0" onClose={() => onOpenChange(false)}>
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex-shrink-0">
                    <DialogTitle className="text-2xl font-semibold text-gray-900">
                        Group Settings
                    </DialogTitle>
                    <DialogDescription className="text-[15px] text-gray-600 mt-1">
                        Manage your group settings and members
                    </DialogDescription>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                    {/* Avatar Section */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900">Group Avatar</label>
                        <div className="flex items-center gap-4">
                            <Avatar
                                src={group.avatar_url || undefined}
                                fallback={group.name}
                                className="h-20 w-20 border-2 border-gray-200 rounded-xl"
                            />
                            <div>
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => document.getElementById('avatar-upload')?.click()}
                                    disabled={uploading}
                                    className="border-gray-300 hover:bg-gray-50 text-gray-700"
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    {uploading ? 'Uploading...' : 'Change Avatar'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Name & Description */}
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Group Name</label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter group name"
                                disabled={!isAdmin}
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-900">Description</label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter group description"
                                disabled={!isAdmin}
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Members Management */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-900">Members ({members.length})</label>
                        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-64 overflow-y-auto">
                            {members.map((member) => {
                                const isCreator = member.user_id === group.created_by;
                                const isCurrentUser = member.user_id === user?.id;

                                return (
                                    <div key={member.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={member.profile?.avatar_url || undefined}
                                                fallback={member.profile?.full_name || '?'}
                                                className="h-10 w-10"
                                            />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{member.profile?.full_name || member.profile?.email}</p>
                                                <p className="text-xs text-gray-600">
                                                    {isCreator ? 'Creator' : member.role}
                                                </p>
                                            </div>
                                        </div>
                                        {!isCreator && !isCurrentUser && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleAdmin(member.id, member.role)}
                                                className="text-xs text-gray-700 hover:text-gray-900"
                                            >
                                                {member.role === 'admin' ? (
                                                    <>
                                                        <ShieldOff className="h-3 w-3 mr-1" />
                                                        Remove Admin
                                                    </>
                                                ) : (
                                                    <>
                                                        <Shield className="h-3 w-3 mr-1" />
                                                        Make Admin
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Delete Group - Admin Only */}
                    {isAdmin && (
                        <div className="space-y-3 pt-6 border-t border-gray-200">
                            <label className="text-sm font-semibold text-red-600">Danger Zone</label>
                            <p className="text-sm text-gray-600">
                                Type the group name "<span className="font-medium text-gray-900">{group.name}</span>" to confirm deletion
                            </p>
                            <Input
                                value={deleteConfirm}
                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                placeholder="Type group name to confirm"
                                className="h-11 bg-white border-gray-300 focus:border-red-500 focus:ring-red-500 text-gray-900 rounded-lg"
                            />
                            <Button
                                variant="outline"
                                className="w-full h-11 text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 rounded-lg"
                                onClick={handleDeleteGroup}
                                disabled={deleteConfirm !== group.name}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Group
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 flex-shrink-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-11 border-gray-300 hover:bg-white text-gray-700 rounded-lg"
                    >
                        Cancel
                    </Button>
                    {isAdmin && (
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-11 bg-black hover:bg-gray-800 text-white rounded-lg"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
