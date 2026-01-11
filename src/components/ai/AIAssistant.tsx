"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Copy, Trash2, Sparkles } from 'lucide-react';
import type { SharedResourceWithUploader } from '@/types/database.types';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface AIAssistantProps {
    resource?: SharedResourceWithUploader | null;
    fileUrl?: string;
}

export function AIAssistant({ resource, fileUrl }: AIAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const documentContext = resource ? {
                title: resource.title,
                type: resource.resource_type,
                description: resource.description,
                fileName: resource.file_name
            } : null;

            console.log('Sending to AI:', { message: input, documentContext, fileUrl });

            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: input,
                    documentContext,
                    conversationHistory: messages,
                    fileUrl: fileUrl || null
                })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (data.error) {
                throw new Error(data.error + (data.details ? ': ' + data.details : ''));
            }

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.response
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error: any) {
            console.error('AI Error:', error);
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
    };

    const handleClear = () => {
        setMessages([]);
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-gray-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
                        <p className="text-xs text-gray-600">
                            {resource ? `Ask about ${resource.title}` : 'Ask me anything'}
                        </p>
                    </div>
                </div>
                {messages.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClear}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                            {resource ? 'Ask about this document' : 'How can I help you?'}
                        </h4>
                        <p className="text-sm text-gray-600 max-w-xs">
                            {resource
                                ? 'Ask questions about the content, get summaries, or request explanations.'
                                : 'I can help you with studying, homework, research, and more!'}
                        </p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[85%] rounded-lg px-4 py-2.5 ${message.role === 'user'
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                {message.role === 'assistant' && (
                                    <button
                                        onClick={() => handleCopy(message.content)}
                                        className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3" />
                                        Copy
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-lg px-4 py-2.5">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={resource ? "Ask about this document..." : "Ask me anything..."}
                        disabled={loading}
                        className="flex-1 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-300"
                    />
                    <Button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-black hover:bg-gray-800 text-white"
                    >
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
