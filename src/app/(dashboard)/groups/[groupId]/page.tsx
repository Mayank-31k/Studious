'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Info, Send, Folder, Settings, Paperclip, X,
    MoreVertical, Copy, Trash2, Share2, FileText, Image as ImageIcon, Download, Smile
} from 'lucide-react';
import { GroupSettingsDialog } from '@/components/groups/GroupSettingsDialog';
import type { Group, Message, Profile, MessageWithSender } from '@/types/database.types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { LoadingAnimation } from '@/components/ui/loading-animation';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

// File attachment state type
interface FileAttachment {
    file: File;
    preview: string | null;
    type: 'image' | 'document';
}

export default function GroupChatPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params['groupId'] as string;

    // Destructure groups for optimistic rendering
    const { user, loading: authLoading, groups } = useAuth();
    const { showToast } = useToast();
    const supabase = createClient();

    const [group, setGroup] = useState<Group | null>(null);
    const [messages, setMessages] = useState<MessageWithSender[]>([]);
    const [deletedMessageIds, setDeletedMessageIds] = useState<Set<string>>(new Set());
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    // File attachment state
    const [attachment, setAttachment] = useState<FileAttachment | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{ messageId: string; x: number; y: number } | null>(null);

    // Emoji picker state
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const emojiPickerRef = useRef<HTMLDivElement>(null);

    // Optimistic group finding
    const cachedGroup = groups.find(g => g.id === groupId);
    const displayGroup = group || cachedGroup;

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        // Use requestAnimationFrame to ensure DOM is updated
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior });
        });
    }, []);

    // Fetch user's deleted messages
    const fetchDeletedMessages = useCallback(async () => {
        if (!user) return;

        const { data } = await supabase
            .from('message_deletions')
            .select('message_id')
            .eq('user_id', user.id);

        if (data) {
            setDeletedMessageIds(new Set(data.map(d => d.message_id)));
        }
    }, [user, supabase]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchGroupData = async () => {
            if (!user || !groupId) return;

            try {
                // Fetch everything in parallel for better performance
                const [groupResult, messagesResult, memberResult] = await Promise.all([
                    supabase
                        .from('groups')
                        .select('*')
                        .eq('id', groupId)
                        .single(),

                    supabase
                        .from('messages')
                        .select('*, sender:profiles(*)')
                        .eq('group_id', groupId)
                        .is('deleted_at', null) // Only fetch non-deleted messages
                        .order('created_at', { ascending: true }),

                    supabase
                        .from('group_members')
                        .select('role')
                        .eq('group_id', groupId)
                        .eq('user_id', user.id)
                        .single()
                ]);

                if (groupResult.error) throw groupResult.error;
                if (messagesResult.error) throw messagesResult.error;

                setGroup(groupResult.data);
                setMessages(messagesResult.data as MessageWithSender[]);
                setIsAdmin(memberResult.data?.role === 'admin' || groupResult.data.created_by === user.id);

                // Fetch user's deleted messages
                await fetchDeletedMessages();

                setLoading(false);
                // Use 'auto' for instant scroll on initial load
                setTimeout(() => scrollToBottom('auto'), 50);

            } catch (error) {
                setLoading(false);
            }
        };

        fetchGroupData();

        // Realtime subscription for new messages
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
                            if (payload.new.sender_id !== user?.id) {
                                const senderName = senderData.full_name?.split(' ')[0] || 'Someone';
                                const messagePreview = incomingMessage.content
                                    ? `"${incomingMessage.content.substring(0, 50)}${incomingMessage.content.length > 50 ? '...' : ''}"`
                                    : 'Sent an attachment';
                                showToast(`${senderName}: ${messagePreview}`, 'info');
                                setUnreadCount(prev => prev + 1);
                            }
                            return updatedMessages;
                        });
                        scrollToBottom();
                    }
                }
            )
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'messages',
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    // Handle message updates (e.g., deleted_at set)
                    if (payload.new.deleted_at) {
                        setMessages(prev => prev.map(m =>
                            m.id === payload.new.id
                                ? { ...m, deleted_at: payload.new.deleted_at, content: null }
                                : m
                        ));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, authLoading, groupId, router, supabase, fetchDeletedMessages, scrollToBottom, showToast]);

    // Handle file selection
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Check file size (max 10MB)
        const MAX_SIZE = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            showToast('File too large. Maximum size is 10MB.', 'error');
            return;
        }

        const isImage = file.type.startsWith('image/');
        let preview: string | null = null;

        if (isImage) {
            preview = URL.createObjectURL(file);
        }

        setAttachment({
            file,
            preview,
            type: isImage ? 'image' : 'document'
        });
    };

    // Remove attachment
    const removeAttachment = () => {
        if (attachment?.preview) {
            URL.revokeObjectURL(attachment.preview);
        }
        setAttachment(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Send message (with optional file)
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedMessage = newMessage.trim();

        if ((!trimmedMessage && !attachment) || !user || sending) return;

        const MAX_MESSAGE_LENGTH = 5000;
        if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
            showToast(`Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`, 'error');
            return;
        }

        setSending(true);
        setUploading(!!attachment);

        try {
            let fileUrl: string | null = null;
            let fileName: string | null = null;
            let fileType: string | null = null;
            let fileSize: number | null = null;
            let messageType: 'text' | 'file' = 'text';

            // Upload file if attached
            if (attachment) {
                const fileExt = attachment.file.name.split('.').pop();
                const filePath = `${groupId}/${Date.now()}_${user.id}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('group-files')
                    .upload(filePath, attachment.file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('group-files')
                    .getPublicUrl(filePath);

                fileUrl = publicUrl;
                fileName = attachment.file.name;
                fileType = attachment.file.type;
                fileSize = attachment.file.size;
                messageType = 'file';
            }

            const { error } = await supabase
                .from('messages')
                .insert({
                    group_id: groupId,
                    sender_id: user.id,
                    content: trimmedMessage || null,
                    message_type: messageType,
                    file_url: fileUrl,
                    file_name: fileName,
                    file_type: fileType,
                    file_size: fileSize,
                });

            if (error) throw error;

            setNewMessage('');
            removeAttachment();

            // Immediate scroll after sending
            scrollToBottom('auto');

        } catch (error: any) {
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            setSending(false);
            setUploading(false);
        }
    };

    // Delete message for me
    const handleDeleteForMe = async (messageId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('message_deletions')
                .insert({
                    message_id: messageId,
                    user_id: user.id
                });

            if (error) throw error;

            setDeletedMessageIds(prev => new Set([...prev, messageId]));
            showToast('Message deleted for you', 'success');
        } catch (error) {
            showToast('Failed to delete message', 'error');
        }
        setContextMenu(null);
    };

    // Delete message for everyone
    const handleDeleteForEveryone = async (messageId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from('messages')
                .update({ deleted_at: new Date().toISOString(), content: null })
                .eq('id', messageId)
                .eq('sender_id', user.id); // Only sender can delete

            if (error) throw error;

            showToast('Message deleted for everyone', 'success');
        } catch (error) {
            showToast('Failed to delete message', 'error');
        }
        setContextMenu(null);
    };

    // Copy message
    const handleCopyMessage = (content: string | null) => {
        if (content) {
            navigator.clipboard.writeText(content);
            showToast('Message copied to clipboard', 'success');
        }
        setContextMenu(null);
    };

    // Share message
    const handleShareMessage = async (message: MessageWithSender) => {
        const shareText = message.content || 'Shared a file';

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Shared from Studious',
                    text: shareText,
                    url: message.file_url || undefined
                });
            } catch (err) {
                // User cancelled or share failed, copy to clipboard as fallback
                navigator.clipboard.writeText(shareText);
                showToast('Message copied to clipboard', 'success');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText);
            showToast('Message copied to clipboard', 'success');
        }
        setContextMenu(null);
    };

    // Format file size
    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        if (contextMenu) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [contextMenu]);

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showEmojiPicker]);

    // Handle emoji selection
    const handleEmojiSelect = (emoji: any) => {
        setNewMessage(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    // Filter out deleted messages for current user
    const visibleMessages = messages.filter(m => !deletedMessageIds.has(m.id));

    if (authLoading || (!group && !cachedGroup)) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-[var(--background)]">
                <LoadingAnimation />
            </div>
        );
    }

    if (!displayGroup) return null;

    return (
        <div className="flex flex-col h-full bg-[var(--background)]">
            {/* Header */}
            <div className="h-16 px-6 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Avatar src={displayGroup.avatar_url || undefined} fallback={displayGroup.name} className="h-10 w-10 border border-[var(--border)]" />
                    <div>
                        <h2 className="font-semibold text-[var(--foreground)]">{displayGroup.name}</h2>
                        <p className="text-xs text-[var(--muted-foreground)]">{displayGroup.description || "Active now"}</p>
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
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <LoadingAnimation />
                </div>
            ) : (
                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
                        {visibleMessages.map((message, index) => {
                            const isSelf = message.sender_id === user?.id;
                            const showAvatar = index === 0 || visibleMessages[index - 1].sender_id !== message.sender_id;
                            const isDeleted = !!message.deleted_at;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={message.id}
                                    className={cn(
                                        "flex gap-3 group relative",
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

                                        <div className="relative group/message">
                                            {/* Message actions button */}
                                            {!isDeleted && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setContextMenu({
                                                            messageId: message.id,
                                                            x: e.clientX,
                                                            y: e.clientY
                                                        });
                                                    }}
                                                    className={cn(
                                                        "absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/message:opacity-100 transition-opacity p-1 rounded-full bg-gray-100 hover:bg-gray-200",
                                                        isSelf ? "-left-8" : "-right-8"
                                                    )}
                                                >
                                                    <MoreVertical className="h-4 w-4 text-gray-500" />
                                                </button>
                                            )}

                                            {isDeleted ? (
                                                <div className={cn(
                                                    "px-4 py-2 rounded-2xl text-sm italic text-gray-400",
                                                    isSelf ? "bg-gray-200 rounded-tr-sm" : "bg-gray-100 rounded-tl-sm"
                                                )}>
                                                    🚫 This message was deleted
                                                </div>
                                            ) : message.message_type === 'file' && message.file_url ? (
                                                <div className={cn(
                                                    "rounded-2xl overflow-hidden shadow-sm",
                                                    isSelf ? "rounded-tr-sm" : "rounded-tl-sm"
                                                )}>
                                                    {message.file_type?.startsWith('image/') ? (
                                                        <div className="max-w-xs">
                                                            <img
                                                                src={message.file_url}
                                                                alt={message.file_name || 'Image'}
                                                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90"
                                                                onClick={() => window.open(message.file_url!, '_blank')}
                                                            />
                                                            {message.content && (
                                                                <div className={cn(
                                                                    "px-4 py-2 text-sm",
                                                                    isSelf ? "bg-black text-white" : "bg-secondary text-foreground"
                                                                )}>
                                                                    {message.content}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className={cn(
                                                            "flex items-center gap-3 p-3",
                                                            isSelf ? "bg-black text-white" : "bg-secondary text-foreground"
                                                        )}>
                                                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                                                                <FileText className="h-5 w-5 text-gray-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium truncate">{message.file_name}</p>
                                                                <p className="text-xs opacity-70">{formatFileSize(message.file_size)}</p>
                                                            </div>
                                                            <a
                                                                href={message.file_url}
                                                                download={message.file_name}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                                                            >
                                                                <Download className="h-4 w-4" />
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className={cn(
                                                    "px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm",
                                                    isSelf
                                                        ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-sm"
                                                        : "bg-secondary text-foreground rounded-tl-sm"
                                                )}>
                                                    {message.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
            )}

            {/* Context Menu */}
            <AnimatePresence>
                {contextMenu && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed z-50 bg-white rounded-xl shadow-lg border border-gray-200 py-1 min-w-[160px]"
                        style={{ left: contextMenu.x, top: contextMenu.y }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {(() => {
                            const message = messages.find(m => m.id === contextMenu.messageId);
                            if (!message) return null;
                            const isSelf = message.sender_id === user?.id;

                            return (
                                <>
                                    {message.content && (
                                        <button
                                            onClick={() => handleCopyMessage(message.content)}
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                                        >
                                            <Copy className="h-4 w-4" /> Copy
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleShareMessage(message)}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2"
                                    >
                                        <Share2 className="h-4 w-4" /> Share
                                    </button>
                                    <div className="h-px bg-gray-200 my-1" />
                                    <button
                                        onClick={() => handleDeleteForMe(message.id)}
                                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete for me
                                    </button>
                                    {isSelf && (
                                        <button
                                            onClick={() => handleDeleteForEveryone(message.id)}
                                            className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" /> Delete for everyone
                                        </button>
                                    )}
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Attachment Preview */}
            <AnimatePresence>
                {attachment && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="px-4 py-2 bg-gray-50 border-t border-gray-200 max-w-4xl mx-auto w-full"
                    >
                        <div className="flex items-center gap-3">
                            {attachment.type === 'image' && attachment.preview ? (
                                <img src={attachment.preview} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                            ) : (
                                <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-gray-500" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{attachment.file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(attachment.file.size)}</p>
                            </div>
                            <button
                                onClick={removeAttachment}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                            >
                                <X className="h-4 w-4 text-gray-500" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-4 bg-[var(--background)] max-w-4xl mx-auto w-full">
                <form
                    onSubmit={handleSendMessage}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--border)] bg-[var(--secondary)]/20 focus-within:ring-1 focus-within:ring-[var(--ring)] transition-all shadow-sm"
                >
                    {/* File attachment button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] h-9 w-9 shrink-0"
                        disabled={uploading}
                    >
                        <Paperclip className="h-5 w-5" />
                    </Button>

                    {/* Emoji picker button */}
                    <div className="relative" ref={emojiPickerRef}>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] h-9 w-9 shrink-0"
                        >
                            <Smile className="h-5 w-5" />
                        </Button>

                        {/* Emoji picker popover */}
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute bottom-12 left-0 z-50"
                                >
                                    <Picker
                                        data={data}
                                        onEmojiSelect={handleEmojiSelect}
                                        theme="light"
                                        previewPosition="none"
                                        skinTonePosition="none"
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="bg-transparent border-none focus-visible:ring-0 px-2 shadow-none min-h-[24px]"
                            disabled={uploading}
                        />
                    </div>
                    <Button
                        type="submit"
                        size="icon"
                        disabled={(!newMessage.trim() && !attachment) || sending}
                        className={cn(
                            "rounded-xl h-9 w-9 transition-all shrink-0",
                            (newMessage.trim() || attachment)
                                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                                : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            {/* Settings Dialog */}
            {displayGroup && (
                <GroupSettingsDialog
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                    group={displayGroup}
                    isAdmin={isAdmin}
                    onGroupUpdated={() => {
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
            )}
        </div>
    );
}
