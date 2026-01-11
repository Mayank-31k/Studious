'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { FileText, Image as ImageIcon, Video, Link as LinkIcon, Download, Plus, Upload, ArrowLeft } from 'lucide-react';
import type { Group, SharedResource, SharedResourceWithUploader } from '@/types/database.types';
import Link from 'next/link';
import { DocumentViewer } from '@/components/resources/DocumentViewer';

// In-memory cache for resources
const resourcesCache = new Map<string, { data: SharedResourceWithUploader[], timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ResourcesPage() {
    const params = useParams();
    const router = useRouter();
    const groupId = params['groupId'] as string;

    const { user, loading: authLoading } = useAuth();
    const supabase = createClient();

    const [group, setGroup] = useState<Group | null>(null);
    const [resources, setResources] = useState<SharedResourceWithUploader[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploadModalOpen, setUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [filter, setFilter] = useState<'all' | 'document' | 'image' | 'video' | 'link'>('all');
    const hasFetched = useRef(false);

    // Document viewer state
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedResource, setSelectedResource] = useState<SharedResourceWithUploader | null>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

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
        const { data } = await supabase.from('groups').select('*').eq('id', groupId).single();
        if (data) setGroup(data);
    };

    const fetchResources = async () => {
        if (resources.length === 0) setLoading(true);

        const { data } = await supabase
            .from('shared_resources')
            .select(`*, uploader:uploaded_by (id, email, full_name, avatar_url)`)
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });

        if (data) {
            setResources(data as SharedResourceWithUploader[]);
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
            const fileExt = file.name.split('.').pop();
            const filePath = `${groupId}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('group-files').upload(filePath, file);

            if (uploadError) {
                console.error('Upload error:', uploadError);
                setUploading(false);
                return;
            }

            fileUrl = filePath;
            fileName = file.name;
            fileSize = file.size;
        } else if (resourceType === 'link') {
            fileUrl = linkUrl;
        }

        const { error } = await supabase.from('shared_resources').insert({
            group_id: groupId,
            uploaded_by: user.id,
            title,
            description: description || null,
            resource_type: resourceType,
            file_url: fileUrl,
            file_name: fileName,
            file_size: fileSize,
        });

        if (error) {
            console.error('Insert error:', error);
        } else {
            resourcesCache.delete(groupId);
            fetchResources();
            setUploadModalOpen(false);
            setTitle('');
            setDescription('');
            setFile(null);
            setLinkUrl('');
        }

        setUploading(false);
    };

    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'document': return <FileText className="w-12 h-12" />;
            case 'image': return <ImageIcon className="w-12 h-12" />;
            case 'video': return <Video className="w-12 h-12" />;
            case 'link': return <LinkIcon className="w-12 h-12" />;
            default: return <FileText className="w-12 h-12" />;
        }
    };

    const formatFileSize = (bytes: number | null) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileUrl = (resource: SharedResourceWithUploader) => {
        if (resource.resource_type === 'link') return resource.file_url || '#';
        if (resource.file_url) {
            if (resource.file_url.startsWith('http')) return resource.file_url;
            const { data } = supabase.storage.from('group-files').getPublicUrl(resource.file_url);
            return data.publicUrl;
        }
        return '#';
    };

    const filteredResources = filter === 'all' ? resources : resources.filter(r => r.resource_type === filter);

    if (authLoading || !user) return null;

    return (
        <div className="flex-1 flex flex-col h-full bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/groups/${groupId}`}>
                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                    <ArrowLeft className="w-4 h-4" />
                                </Button>
                            </Link>
                            <div className="h-6 w-px bg-gray-200" />
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Resources</h1>
                                <p className="text-sm text-gray-600 mt-0.5">{group?.name}</p>
                            </div>
                        </div>
                        <Button
                            onClick={() => setUploadModalOpen(true)}
                            className="bg-black hover:bg-gray-800 text-white rounded-lg h-11 px-5"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Resource
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-8 border-b border-gray-200">
                        {(['all', 'document', 'image', 'video', 'link'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${filter === type
                                    ? 'border-black text-gray-900'
                                    : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Resources Grid */}
                    {loading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : filteredResources.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
                            <p className="text-gray-600 mb-6">Share documents and links with your group</p>
                            <Button
                                onClick={() => setUploadModalOpen(true)}
                                className="bg-black hover:bg-gray-800 text-white rounded-lg"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Upload First Resource
                            </Button>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredResources.map((resource, index) => (
                                <button
                                    key={resource.id}
                                    onClick={() => {
                                        setSelectedResource(resource);
                                        setSelectedIndex(index);
                                        setViewerOpen(true);
                                    }}
                                    className="block group text-left w-full"
                                >
                                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
                                        <div className="h-40 flex items-center justify-center bg-gray-50 relative group-hover:bg-gray-100 transition-colors">
                                            {resource.resource_type === 'image' && resource.file_url ? (
                                                <img src={getFileUrl(resource)} alt={resource.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-gray-400">{getResourceIcon(resource.resource_type)}</div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 truncate mb-1">{resource.title}</h3>
                                            {resource.description && <p className="text-sm text-gray-600 truncate mb-3">{resource.description}</p>}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar
                                                        src={resource.uploader?.avatar_url}
                                                        fallback={resource.uploader?.full_name || '?'}
                                                        size="xs"
                                                        className="w-6 h-6"
                                                    />
                                                    <span className="text-xs text-gray-600 truncate max-w-[100px]">
                                                        {resource.uploader?.full_name?.split(' ')[0]}
                                                    </span>
                                                </div>
                                                {resource.file_size && (
                                                    <span className="text-xs text-gray-500">{formatFileSize(resource.file_size)}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
                <DialogContent onClose={() => setUploadModalOpen(false)} className="sm:max-w-[480px] bg-white border-gray-200 p-0">
                    <div className="p-6 border-b border-gray-100">
                        <DialogTitle className="text-2xl font-semibold text-gray-900">
                            Upload Resource
                        </DialogTitle>
                        <DialogDescription className="text-[15px] text-gray-600 mt-1">
                            Share a file or link with your group
                        </DialogDescription>
                    </div>

                    <form onSubmit={handleUpload} className="p-6 space-y-5">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-3">Resource Type</label>
                            <div className="grid grid-cols-4 gap-2">
                                {(['document', 'image', 'video', 'link'] as const).map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setResourceType(type)}
                                        className={`p-3 text-sm rounded-lg border transition-colors ${resourceType === type
                                            ? 'bg-black text-white border-black'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Title</label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 rounded-lg"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="min-h-[80px] bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 rounded-lg resize-none"
                            />
                        </div>

                        {/* File/Link Input */}
                        {resourceType === 'link' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">URL</label>
                                <Input
                                    type="url"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    required
                                    className="h-11 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-gray-900 rounded-lg"
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer relative transition-colors">
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {file ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <FileText className="w-8 h-8 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-gray-600">
                                        <Upload className="w-8 h-8 mb-1" />
                                        <span className="text-sm font-medium">Click to upload or drag and drop</span>
                                        <span className="text-xs text-gray-500">PDF, PNG, JPG, MP4 (max 50MB)</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUploadModalOpen(false)}
                                className="flex-1 h-11 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 h-11 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Document Viewer */}
            <DocumentViewer
                open={viewerOpen}
                onOpenChange={setViewerOpen}
                resource={selectedResource}
                fileUrl={selectedResource ? getFileUrl(selectedResource) : ''}
                onNext={() => {
                    if (selectedIndex < filteredResources.length - 1) {
                        const nextIndex = selectedIndex + 1;
                        setSelectedIndex(nextIndex);
                        setSelectedResource(filteredResources[nextIndex]);
                    }
                }}
                onPrevious={() => {
                    if (selectedIndex > 0) {
                        const prevIndex = selectedIndex - 1;
                        setSelectedIndex(prevIndex);
                        setSelectedResource(filteredResources[prevIndex]);
                    }
                }}
                hasNext={selectedIndex < filteredResources.length - 1}
                hasPrevious={selectedIndex > 0}
            />
        </div>
    );
}
