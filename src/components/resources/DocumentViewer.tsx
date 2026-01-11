"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Download, ChevronLeft, ChevronRight, ExternalLink, Sparkles } from 'lucide-react';
import type { SharedResourceWithUploader } from '@/types/database.types';
import { AIAssistant } from '@/components/ai/AIAssistant';

interface DocumentViewerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resource: SharedResourceWithUploader | null;
    fileUrl: string;
    onNext?: () => void;
    onPrevious?: () => void;
    hasNext?: boolean;
    hasPrevious?: boolean;
}

export function DocumentViewer({
    open,
    onOpenChange,
    resource,
    fileUrl,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious
}: DocumentViewerProps) {
    const [showAI, setShowAI] = useState(false);

    if (!resource) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = resource.file_name || resource.title;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleOpenInNewTab = () => {
        window.open(fileUrl, '_blank', 'noopener,noreferrer');
    };

    const renderContent = () => {
        switch (resource.resource_type) {
            case 'image':
                return (
                    <div className="flex items-center justify-center h-full bg-gray-900 p-4">
                        <img
                            src={fileUrl}
                            alt={resource.title}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>
                );

            case 'video':
                return (
                    <div className="flex items-center justify-center h-full bg-black p-4">
                        <video
                            src={fileUrl}
                            controls
                            className="max-w-full max-h-full"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );

            case 'document':
                // For PDFs, use iframe
                if (resource.file_name?.toLowerCase().endsWith('.pdf')) {
                    return (
                        <iframe
                            src={fileUrl}
                            className="w-full h-full border-0"
                            title={resource.title}
                        />
                    );
                }
                // For other documents, show download option
                return (
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-8">
                        <div className="text-center max-w-md">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <Download className="w-10 h-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {resource.title}
                            </h3>
                            <p className="text-gray-600 mb-6">
                                This file type cannot be previewed. Click below to download.
                            </p>
                            <Button
                                onClick={handleDownload}
                                className="bg-black hover:bg-gray-800 text-white"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download File
                            </Button>
                        </div>
                    </div>
                );

            case 'link':
                return (
                    <iframe
                        src={fileUrl}
                        className="w-full h-full border-0"
                        title={resource.title}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => onOpenChange(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[800px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex-1 min-w-0 mr-4">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {resource.title}
                        </h2>
                        {resource.description && (
                            <p className="text-sm text-gray-600 truncate">
                                {resource.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Navigation */}
                        {(hasPrevious || hasNext) && (
                            <div className="flex items-center gap-1 mr-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onPrevious}
                                    disabled={!hasPrevious}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={onNext}
                                    disabled={!hasNext}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </Button>
                            </div>
                        )}

                        {/* AI Assistant Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAI(!showAI)}
                            className={`text-gray-600 hover:text-gray-900 ${showAI ? 'bg-purple-50 text-purple-600 hover:text-purple-700' : ''}`}
                            title="AI Assistant"
                        >
                            <Sparkles className="w-5 h-5" />
                        </Button>

                        {/* Open in New Tab */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleOpenInNewTab}
                            className="text-gray-600 hover:text-gray-900"
                            title="Open in new tab"
                        >
                            <ExternalLink className="w-5 h-5" />
                        </Button>

                        {/* Download */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDownload}
                            className="text-gray-600 hover:text-gray-900"
                            title="Download"
                        >
                            <Download className="w-5 h-5" />
                        </Button>

                        {/* Close */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-gray-600 hover:text-gray-900"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Content - Split Panel */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Document Viewer */}
                    <div className={`${showAI ? 'w-1/2' : 'w-full'} h-full transition-all duration-300`}>
                        {renderContent()}
                    </div>

                    {/* AI Assistant Panel */}
                    {showAI && (
                        <div className="w-1/2 h-full">
                            <AIAssistant resource={resource} fileUrl={fileUrl} />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
