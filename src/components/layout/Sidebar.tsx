'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '../ui/avatar';

interface Group {
    id: string;
    name: string;
    description?: string | null;
}

interface SidebarProps {
    groups: Group[];
    onCreateGroup?: () => void;
    collapsed?: boolean;
    onToggleCollapse?: () => void;
}

export function Sidebar({
    groups,
    onCreateGroup,
    collapsed = false,
    onToggleCollapse,
}: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside className={`
      flex flex-col
      bg-[#0F1210] border-r-4 border-[#2E3830]
      transition-all duration-300
      ${collapsed ? 'w-16' : 'w-64'}
    `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b-2 border-[#2E3830]">
                {!collapsed && (
                    <h2 className="font-pixel text-xs text-[#E8F5E9]">GROUPS</h2>
                )}
                <button
                    onClick={onToggleCollapse}
                    className="p-2 text-[#8BA889] hover:text-[#E8F5E9] hover:bg-[#1A1F1C] transition-colors"
                >
                    <svg
                        className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* Groups List */}
            <div className="flex-1 overflow-y-auto py-2">
                {groups.length === 0 ? (
                    <div className={`px-4 py-8 text-center ${collapsed ? 'hidden' : ''}`}>
                        <p className="text-sm text-[#8BA889]">No groups yet</p>
                        <p className="text-xs text-[#8BA889] mt-1">Create or join a group to get started</p>
                    </div>
                ) : (
                    <nav className="space-y-1 px-2">
                        {groups.map((group) => {
                            const isActive = pathname === `/groups/${group.id}`;
                            return (
                                <Link
                                    key={group.id}
                                    href={`/groups/${group.id}`}
                                    className={`
                    flex items-center gap-3 p-3
                    transition-all duration-200
                    ${isActive
                                            ? 'bg-[#2D5A27]/30 border-l-4 border-[#4A8C3F]'
                                            : 'hover:bg-[#1A1F1C] border-l-4 border-transparent'
                                        }
                  `}
                                >
                                    <Avatar
                                        fallback={group.name}
                                        size="sm"
                                        variant={isActive ? 'glow' : 'pixel'}
                                    />
                                    {!collapsed && (
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${isActive ? 'text-[#E8F5E9]' : 'text-[#B8C9BA]'}`}>
                                                {group.name}
                                            </p>
                                            {group.description && (
                                                <p className="text-xs text-[#8BA889] truncate">
                                                    {group.description}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </div>

            {/* Create Group Button */}
            <div className="p-3 border-t-2 border-[#2E3830]">
                <button
                    onClick={onCreateGroup}
                    className={`
            w-full flex items-center justify-center gap-2
            p-3 bg-[#1A1F1C] border-4 border-[#2E3830]
            text-[#B8C9BA] hover:text-[#E8F5E9]
            hover:border-[#4A8C3F] hover:shadow-[0_0_15px_rgba(74,140,63,0.3)]
            transition-all duration-200
          `}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {!collapsed && <span className="text-sm font-medium">New Group</span>}
                </button>
            </div>
        </aside>
    );
}
