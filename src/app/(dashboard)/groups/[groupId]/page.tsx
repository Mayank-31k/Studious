'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, MoreVertical, Paperclip, Smile, Send, Folder, Settings } from 'lucide-react';
import { GroupSettingsDialog } from '@/components/groups/GroupSettingsDialog';
import type { Group, Message, Profile, MessageWithSender } from '@/types/database.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function GroupChatPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params['groupId'] as string;

    const { user, loading: authLoading } = useAuth();
    const { showToast } = useToast();
    const supabase = createClient();

    const [group, setGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchGroupData = async () => {
            if (!user || !groupId) return;

            try {
                // Fetch group details
                const { data: groupData, error: groupError } = await supabase
                    .from('groups')
                    .select('*')
                    .eq('id', groupId)
                    .single();

                if (groupError) throw groupError;
                setGroup(groupData);

                // Fetch messages
                const { data: messagesData, error: messagesError } = await supabase
                    .from('messages')
                    .select('*, sender:profiles(*)')
                    .eq('group_id', groupId)
                    .order('created_at', { ascending: true });

                if (messagesError) throw messagesError;
                setMessages(messagesData as MessageWithSender[]);

                // Check if user is admin
                const { data: memberData } = await supabase
                    .from('group_members')
                    .select('role')
                    .eq('group_id', groupId)
                    .eq('user_id', user.id)
                    .single();

                setIsAdmin(memberData?.role === 'admin' || groupData.created_by === user.id);

                setLoading(false);
                setTimeout(scrollToBottom, 100);

            } catch (error) {
                console.error('Error fetching group data:', error);
                setLoading(false);
            }
        };

        fetchGroupData();

        // Realtime subscription
        const channel = supabase
            .channel(`group_chat:${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `group_id=eq.${groupId}`,
                },
                async (payload) => {
                    const { data: senderData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', payload.new.sender_id)
                        .single();

                    if (senderData) {
                        const incomingMessage = { ...payload.new, sender: senderData } as MessageWithSender;
                        setMessages((prev) => {
                            const updatedMessages = [...prev, incomingMessage];
                            // Show toast notification for messages from other users
                            if (payload.new.sender_id !== user?.id) {
                                const senderName = senderData.full_name?.split(' ')[0] || 'Someone';
                                showToast(`${senderName}: "${incomingMessage.content.substring(0, 50)}${incomingMessage.content.length > 50 ? '...' : ''}" • ${updatedMessages.length} messages`, 'info');
                                setUnreadCount(prev => prev + 1);
                            }
                            return updatedMessages;
                        });
                        scrollToBottom();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, authLoading, groupId, router, supabase]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || sending) return;

        setSending(true);
        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    group_id: groupId,
                    sender_id: user.id,
                    content: newMessage.trim(),
                    message_type: 'text',
                });

            if (error) throw error;
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    if (loading || !group) {
        return <div className="flex-1 flex items-center justify-center h-full bg-[var(--background)] text-[var(--muted-foreground)]">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-[var(--background)]">
            {/* Minimal Header */}
            <div className="h-16 px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Avatar src={group.avatar_url || undefined} fallback={group.name} className="h-10 w-10 border border-[var(--border)]" />
                    <div>
                        <h2 className="font-semibold text-[var(--foreground)]">{group.name}</h2>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-[var(--muted-foreground)]">{group.description || "Active now"}</p>
                            {messages.length > 0 && (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full">
                                    {messages.length} messages
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                        onClick={() => router.push(`/groups/${groupId}/resources`)}
                    >
                        <Folder className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        onClick={() => setSettingsOpen(true)}
                    >
                        <Settings className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                        <Info className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <ScrollArea className="flex-1 p-6">
                <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                    {messages.map((message, index) => {
                        const isSelf = message.sender_id === user?.id;
                        const showAvatar = index === 0 || messages[index - 1].sender_id !== message.sender_id;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={message.id}
                                className={cn(
                                    "flex gap-3",
                                    isSelf ? "flex-row-reverse" : "flex-row"
                                )}
                            >
                                {showAvatar ? (
                                    <Avatar
                                        src={message.sender.avatar_url || undefined}
                                        fallback={message.sender.full_name || '?'}
                                        className="h-8 w-8 mt-1 border border-[var(--border)]"
                                    />
                                ) : (
                                    <div className="w-8" />
                                )}

                                <div className={cn(
                                    "flex flex-col max-w-[70%]",
                                    isSelf ? "items-end" : "items-start"
                                )}>
                                    {showAvatar && !isSelf && (
                                        <span className="text-xs text-[var(--muted-foreground)] mb-1 ml-1">
                                            {message.sender.full_name?.split(' ')[0]}
                                        </span>
                                    )}
                                    <div className={cn(
                                        "px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm transition-all",
                                        isSelf
                                            ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm"
                                            : "bg-secondary text-foreground rounded-tl-sm border-0"
                                    )}>
                                        {message.content}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Minimal Input */}
            <div className="p-4 bg-[var(--background)] max-w-4xl mx-auto w-full">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/20 focus-within:ring-1 focus-within:ring-[var(--ring)] transition-all shadow-sm"
                >
                    <div className="flex-1">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="bg-transparent border-none focus-visible:ring-0 px-2 shadow-none min-h-[24px]"
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!newMessage.trim() || sending}
                        className={cn(
                            "rounded-xl h-9 w-9 transition-all shrink-0",
                            newMessage.trim()
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            {/* Settings Dialog */}
            {
                group && (
                    <GroupSettingsDialog
                        open={settingsOpen}
                        onOpenChange={setSettingsOpen}
                        group={group}
                        isAdmin={isAdmin}
                        onGroupUpdated={() => {
                            // Refetch group data
                            supabase
                                .from('groups')
                                .select('*')
                                .eq('id', groupId)
                                .single()
                                .then(({ data }) => {
                                    if (data) setGroup(data);
                                });
                        }}
                    />
                )
            }
        </div >
    );
}
