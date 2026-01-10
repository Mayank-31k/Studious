'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Input, Textarea } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import type { Group, SharedResource, SharedResourceWithUploader } from '@/types/database.types';

// Simple in-memory cache for resources
const resourcesCache = new Map<string, { data: SharedResourceWithUploader[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ResourcesPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params.groupId as string;

    const { user, profile, signOut, loading: authLoading } = useAuth();
    const supabase = createClient();

    const [group, setGroup] = useState<Group | null>(null);
    const [resources, setResources] = useState<SharedResourceWithUploader[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'document' | 'image' | 'video' | 'link'>('all');
    const hasFetched = useRef(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [resourceType, setResourceType] = useState<'document' | 'image' | 'video' | 'link'>('document');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user && groupId) {
            fetchGroup();

            // Check cache first
            const cached = resourcesCache.get(groupId);
            if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
                setResources(cached.data);
                setLoading(false);
                hasFetched.current = true;
            } else if (!hasFetched.current) {
                hasFetched.current = true;
                fetchResources();
            }
        }
    }, [user, groupId]);

    const fetchGroup = async () => {
        const { data } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single();

        if (data) {
            setGroup(data);
        }
    };

    const fetchResources = async () => {
        // Only show loading if no cached data
        if (resources.length === 0) {
            setLoading(true);
        }

        const { data } = await supabase
            .from('shared_resources')
            .select(`
        *,
        uploader:uploaded_by (
          id,
          email,
          full_name,
          avatar_url
        )
      `)
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });

        if (data) {
            setResources(data as SharedResourceWithUploader[]);
            // Update cache
            resourcesCache.set(groupId, { data: data as SharedResourceWithUploader[], timestamp: Date.now() });
        }

        setLoading(false);
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setUploading(true);

        let fileUrl = null;
        let fileName = null;
        let fileSize = null;

        if (resourceType !== 'link' && file) {
            // Upload file to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const filePath = `${groupId}/${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('group-files')
                .upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                setUploading(false);
                return;
            }

            // Get the public URL for the uploaded file
            const { data: urlData } = supabase.storage
                .from('group-files')
                .getPublicUrl(filePath);

            fileUrl = urlData.publicUrl;
            fileName = file.name;
            fileSize = file.size;
        } else if (resourceType === 'link') {
            fileUrl = linkUrl;
        }

        const { error } = await supabase
            .from('shared_resources')
            .insert({
                group_id: groupId,
                uploaded_by: user.id,
                resource_type: resourceType,
                file_url: fileUrl,
                file_name: fileName,
                file_size: fileSize,
                title,
                description: description || null,
            });

        if (!error) {
            setTitle('');
            setDescription('');
            setFile(null);
            setLinkUrl('');
            setUploadModalOpen(false);
            // Clear cache and refresh
            resourcesCache.delete(groupId);
            hasFetched.current = false;
            fetchResources();
        }

        setUploading(false);
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'document':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'image':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'video':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'link':
                return (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileUrl = (resource: SharedResourceWithUploader) => {
        // If it's a link, return the URL directly
        if (resource.resource_type === 'link') {
            return resource.file_url || '#';
        }

        // For uploaded files
        if (resource.file_url) {
            // If it's already a full URL, return it directly
            if (resource.file_url.startsWith('http')) {
                return resource.file_url;
            }

            // Otherwise, generate the public URL from the path
            const { data } = supabase.storage
                .from('group-files')
                .getPublicUrl(resource.file_url);

            return data.publicUrl;
        }

        return '#';
    };

    const filteredResources = filter === 'all'
        ? resources
        : resources.filter(r => r.resource_type === filter);

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

            <div className="flex-1 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/groups/${groupId}`} className="p-2 text-[#8BA889] hover:text-[#E8F5E9] hover:bg-[#1A1F1C] transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="font-pixel text-base text-[#E8F5E9]">RESOURCES</h1>
                            <p className="text-sm text-[#8BA889]">{group?.name}</p>
                        </div>
                    </div>
                    <Button variant="primary" onClick={() => setUploadModalOpen(true)}>
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'document', 'image', 'video', 'link'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`
                px-4 py-2 text-sm font-medium whitespace-nowrap
                border-4 transition-all
                ${filter === type
                                    ? 'bg-[#2D5A27] border-[#1E3D1A] text-[#E8F5E9] shadow-[0_0_15px_rgba(74,140,63,0.3)]'
                                    : 'bg-[#1A1F1C] border-[#2E3830] text-[#8BA889] hover:border-[#3D4A42] hover:text-[#B8C9BA]'
                                }
              `}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Resources Grid */}
                {loading ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-48 bg-[#1A1F1C] border-4 border-[#2E3830] skeleton" />
                        ))}
                    </div>
                ) : filteredResources.length === 0 ? (
                    <Card padding="lg">
                        <CardContent className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-[#1A1F1C] border-4 border-[#2E3830]">
                                <svg className="w-8 h-8 text-[#8BA889]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                </svg>
                            </div>
                            <h3 className="font-pixel text-xs text-[#E8F5E9] mb-2">NO RESOURCES YET</h3>
                            <p className="text-sm text-[#8BA889] mb-6">
                                Share documents, images, videos or links with your group
                            </p>
                            <Button variant="primary" onClick={() => setUploadModalOpen(true)}>
                                Upload First Resource
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredResources.map((resource) => (
                            <a
                                key={resource.id}
                                href={getFileUrl(resource)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Card variant="hover" padding="none" className="overflow-hidden">
                                    {/* Icon/Preview */}
                                    <div className="h-32 flex items-center justify-center bg-[#0F1210] border-b-4 border-[#2E3830]">
                                        {resource.resource_type === 'image' && resource.file_url ? (
                                            <img
                                                src={getFileUrl(resource)}
                                                alt={resource.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="text-[#4A8C3F]">
                                                {getResourceIcon(resource.resource_type)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <CardContent className="p-4">
                                        <h3 className="font-medium text-[#E8F5E9] truncate mb-1">
                                            {resource.title}
                                        </h3>
                                        {resource.description && (
                                            <p className="text-xs text-[#8BA889] truncate mb-2">
                                                {resource.description}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-[#8BA889]">
                                            <div className="flex items-center gap-2">
                                                <Avatar
                                                    src={resource.uploader?.avatar_url}
                                                    fallback={resource.uploader?.full_name || resource.uploader?.email || '?'}
                                                    size="xs"
                                                />
                                                <span className="truncate max-w-[80px]">
                                                    {resource.uploader?.full_name?.split(' ')[0] || 'Unknown'}
                                                </span>
                                            </div>
                                            {resource.file_size && (
                                                <span>{formatFileSize(resource.file_size)}</span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Upload Modal */}
            <Modal
                isOpen={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
                title="Upload Resource"
                description="Share a file or link with your group"
            >
                <form onSubmit={handleUpload}>
                    <div className="space-y-4">
                        {/* Resource Type Selector */}
                        <div>
                            <label className="block text-sm font-medium text-[#B8C9BA] mb-2">Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['document', 'image', 'video', 'link'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setResourceType(type)}
                                        className={`
                      p-2 text-center text-xs border-4 transition-all
                      ${resourceType === type
                                                ? 'bg-[#2D5A27] border-[#1E3D1A] text-[#E8F5E9]'
                                                : 'bg-[#1A1F1C] border-[#2E3830] text-[#8BA889] hover:border-[#3D4A42]'
                                            }
                    `}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Title"
                            placeholder="Resource title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <Textarea
                            label="Description (Optional)"
                            placeholder="Brief description..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={2}
                        />

                        {resourceType === 'link' ? (
                            <Input
                                label="URL"
                                type="url"
                                placeholder="https://..."
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                required
                            />
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-[#B8C9BA] mb-2">File</label>
                                <div className="
                  relative border-4 border-dashed border-[#2E3830] p-6 text-center
                  hover:border-[#4A8C3F] transition-colors cursor-pointer
                ">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        required={resourceType !== 'link'}
                                    />
                                    {file ? (
                                        <p className="text-sm text-[#E8F5E9]">{file.name}</p>
                                    ) : (
                                        <p className="text-sm text-[#8BA889]">Click or drag file here</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <ModalFooter>
                        <Button variant="ghost" type="button" onClick={() => setUploadModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" isLoading={uploading}>
                            Upload
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </div>
    );
}
