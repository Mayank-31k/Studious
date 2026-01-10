'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import type { Group, Message, Profile, MessageWithSender } from '@/types/database.types';

// In-memory cache for group chat data
const groupChatCache = new Map<string, {
    group: Group | null;
    messages: MessageWithSender[];
    members: { user: Profile; role: string }[];
    timestamp: number;
}>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function GroupChatPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;

    const { user, profile, signOut, loading: authLoading } = useAuth();
    const supabase = createClient();

    const [group, setGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [members, setMembers] = useState<{ user: Profile; role: string }[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const hasFetched = useRef(false);
    const subscriptionRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && groupId) {
            // Check cache first
            const cached = groupChatCache.get(groupId);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setGroup(cached.group);
                setMessages(cached.messages);
                setMembers(cached.members);
                setLoading(false);

                // Still subscribe to real-time updates
                if (!subscriptionRef.current) {
                    subscriptionRef.current = subscribeToMessages();
                }
            } else if (!hasFetched.current) {
                hasFetched.current = true;
                fetchGroup();
                fetchMessages();
                fetchMembers();
                subscriptionRef.current = subscribeToMessages();
            }

            return () => {
                if (subscriptionRef.current) {
                    subscriptionRef.current();
                    subscriptionRef.current = null;
                }
            };
        }
    }, [user, groupId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchGroup = async () => {
        const { data } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();

        if (data) {
            setGroup(data);
            updateCache({ group: data });
        }
    };

    const updateCache = (updates: Partial<{ group: Group | null; messages: MessageWithSender[]; members: { user: Profile; role: string }[] }>) => {
        const existing = groupChatCache.get(groupId) || { group: null, messages: [], members: [], timestamp: Date.now() };
        groupChatCache.set(groupId, { ...existing, ...updates, timestamp: Date.now() });
    };

    const fetchMessages = async () => {
        // Only show loading if no messages yet
        if (messages.length === 0) {
            setLoading(true);
        }

        const { data } = await supabase
            .from('messages')
            .select(`
        *,
        sender:sender_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
            .eq('group_id', groupId)
            .order('created_at', { ascending: true })
            .limit(100);

        if (data) {
            const msgs = data as MessageWithSender[];
            setMessages(msgs);
            updateCache({ messages: msgs });
        }

        setLoading(false);
    };

    const fetchMembers = async () => {
        const { data } = await supabase
            .from('group_members')
            .select(`
        role,
        user:user_id (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
            .eq('group_id', groupId);

        if (data) {
            const mbrs = data as unknown as { user: Profile; role: string }[];
            setMembers(mbrs);
            updateCache({ members: mbrs });
        }
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`messages:${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `group_id=eq.${groupId}`,
                },
                async (payload) => {
                    // Fetch the sender profile for the new message
                    const { data: sender } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', payload.new.sender_id)
                        .single();

                    if (sender) {
                        const newMsg = {
                            ...payload.new,
                            sender,
                        } as MessageWithSender;

                        setMessages((prev) => {
                            const updated = [...prev, newMsg];
                            // Update cache with new messages
                            updateCache({ messages: updated });
                            return updated;
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newMessage.trim() || !user) return;

        setSending(true);

        const { error } = await supabase
            .from('messages')
            .insert({
                group_id: groupId,
                sender_id: user.id,
                content: newMessage.trim(),
                message_type: 'text',
            });

        if (!error) {
            setNewMessage('');
            inputRef.current?.focus();
        }

        setSending(false);
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        <div className="min-h-screen bg-[#0F1210] flex flex-col">
            <Header user={profile ? { ...profile, id: user.id } : null} onSignOut={signOut} />

            <div className="flex-1 flex overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {/* Group Header */}
                    <div className="px-6 py-4 bg-[#1A1F1C] border-b-4 border-[#2E3830] flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard" className="p-2 text-[#8BA889] hover:text-[#E8F5E9] hover:bg-[#232A26] transition-colors">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="flex items-center gap-3">
                                <Avatar fallback={group?.name || ''} size="md" variant="glow" />
                                <div>
                                    <h1 className="font-pixel text-xs text-[#E8F5E9]">{group?.name || 'Loading...'}</h1>
                                    <p className="text-xs text-[#8BA889]">{members.length} members</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowMembers(!showMembers)}
                                className={`p-2 transition-colors ${showMembers ? 'text-[#4A8C3F] bg-[#232A26]' : 'text-[#8BA889] hover:text-[#E8F5E9] hover:bg-[#232A26]'}`}
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </button>
                            <Link
                                href={`/groups/${groupId}/resources`}
                                className="p-2 text-[#8BA889] hover:text-[#E8F5E9] hover:bg-[#232A26] transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-grid">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-[#8BA889]">Loading messages...</p>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="w-16 h-16 mb-4 flex items-center justify-center bg-[#1A1F1C] border-4 border-[#2E3830]">
                                    <svg className="w-8 h-8 text-[#8BA889]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <p className="text-[#8BA889]">No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => {
                                    const isOwn = message.sender_id === user.id;
                                    const showDate = index === 0 ||
                                        formatDate(messages[index - 1].created_at) !== formatDate(message.created_at);

                                    return (
                                        <React.Fragment key={message.id}>
                                            {showDate && (
                                                <div className="flex items-center justify-center my-4">
                                                    <span className="px-3 py-1 bg-[#1A1F1C] border-2 border-[#2E3830] text-xs text-[#8BA889]">
                                                        {formatDate(message.created_at)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                                <Avatar
                                                    src={message.sender?.avatar_url}
                                                    fallback={message.sender?.full_name || message.sender?.email || '?'}
                                                    size="sm"
                                                    variant="pixel"
                                                />
                                                <div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
                                                    <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
                                                        <span className="text-xs font-medium text-[#B8C9BA]">
                                                            {isOwn ? 'You' : message.sender?.full_name || message.sender?.email?.split('@')[0]}
                                                        </span>
                                                        <span className="text-xs text-[#8BA889]">{formatTime(message.created_at)}</span>
                                                    </div>
                                                    <div className={`
                            px-4 py-3
                            ${isOwn
                                                            ? 'bg-[#2D5A27] border-4 border-[#1E3D1A] shadow-[inset_-2px_-2px_0_#1E3D1A,inset_2px_2px_0_#4A8C3F]'
                                                            : 'bg-[#1A1F1C] border-4 border-[#2E3830]'
                                                        }
                          `}>
                                                        <p className="text-sm text-[#E8F5E9] whitespace-pre-wrap break-words">
                                                            {message.content}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>

                    {/* Message Input */}
                    <form onSubmit={handleSendMessage} className="p-4 bg-[#1A1F1C] border-t-4 border-[#2E3830]">
                        <div className="flex gap-3">
                            <input
                                ref={inputRef}
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="
                  flex-1 px-4 py-3
                  bg-[#0F1210] text-[#E8F5E9]
                  border-4 border-[#2E3830]
                  placeholder:text-[#8BA889]
                  focus:outline-none focus:border-[#4A8C3F]
                  transition-colors
                "
                            />
                            <Button type="submit" variant="primary" disabled={!newMessage.trim() || sending}>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Members Sidebar */}
                {showMembers && (
                    <div className="w-64 bg-[#0F1210] border-l-4 border-[#2E3830] p-4 overflow-y-auto animate-slide-up">
                        <h3 className="font-pixel text-xs text-[#B8C9BA] mb-4">MEMBERS</h3>
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div key={member.user.id} className="flex items-center gap-3">
                                    <Avatar
                                        src={member.user.avatar_url}
                                        fallback={member.user.full_name || member.user.email}
                                        size="sm"
                                        variant="pixel"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#E8F5E9] truncate">
                                            {member.user.full_name || member.user.email?.split('@')[0]}
                                        </p>
                                        <p className="text-xs text-[#8BA889]">{member.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Invite Code */}
                        <div className="mt-6 pt-4 border-t-2 border-[#2E3830]">
                            <p className="text-xs text-[#8BA889] mb-2">INVITE CODE</p>
                            <div className="flex items-center gap-2 p-2 bg-[#1A1F1C] border-2 border-[#2E3830]">
                                <code className="flex-1 font-mono text-sm text-[#E8B923]">{group?.invite_code}</code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(group?.invite_code || '')}
                                    className="p-1 text-[#8BA889] hover:text-[#E8F5E9]"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
