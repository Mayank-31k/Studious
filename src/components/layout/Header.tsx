'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '../ui/avatar';
import { Button } from '../ui/button';

interface HeaderProps {
    user?: {
        id: string;
        email: string;
        full_name?: string;
        avatar_url?: string | null;
    } | null;
    onSignOut?: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = React.useState(false);

    return (
        <header className="
      sticky top-0 z-40
      bg-[#0F1210]/95 backdrop-blur-md
      border-b-4 border-[#2E3830]
      shadow-[0_4px_20px_rgba(0,0,0,0.3)]
    ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group">
                        <div className="
              w-10 h-10 flex items-center justify-center
              bg-[#2D5A27] border-4 border-[#1E3D1A]
              shadow-[inset_-2px_-2px_0_#1E3D1A,inset_2px_2px_0_#4A8C3F]
              group-hover:shadow-[0_0_15px_rgba(74,140,63,0.5)]
              transition-all duration-300
            ">
                            <span className="font-pixel text-[#E8B923] text-xs">S</span>
                        </div>
                        <span className="font-pixel text-sm text-[#E8F5E9] hidden sm:block">
                            STUDIOUS
                        </span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        {user ? (
                            <>
                                <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                                    Dashboard
                                </NavLink>
                                <NavLink href="/profile" active={pathname === '/profile'}>
                                    Profile
                                </NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink href="#features" active={false}>
                                    Features
                                </NavLink>
                                <NavLink href="#about" active={false}>
                                    About
                                </NavLink>
                            </>
                        )}
                    </nav>

                    {/* User Menu / Auth Buttons */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 p-1 rounded hover:bg-[#1A1F1C] transition-colors"
                                >
                                    <Avatar
                                        src={user.avatar_url}
                                        alt={user.full_name || user.email}
                                        fallback={user.full_name || user.email}
                                        size="sm"
                                        variant="pixel"
                                    />
                                    <span className="hidden sm:block text-sm text-[#B8C9BA]">
                                        {user.full_name || user.email.split('@')[0]}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-[#8BA889] transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {menuOpen && (
                                    <div className="
                    absolute right-0 mt-2 w-48
                    bg-[#1A1F1C] border-4 border-[#2E3830]
                    shadow-lg animate-slide-up
                  ">
                                        <Link
                                            href="/profile"
                                            className="block px-4 py-3 text-sm text-[#B8C9BA] hover:bg-[#232A26] hover:text-[#E8F5E9]"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setMenuOpen(false);
                                                onSignOut?.();
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-[#EF5350] hover:bg-[#232A26] border-t-2 border-[#2E3830]"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Log In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

function NavLink({
    href,
    active,
    children,
}: {
    href: string;
    active: boolean;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className={`
        text-sm font-medium transition-colors
        ${active ? 'text-[#4A8C3F]' : 'text-[#B8C9BA] hover:text-[#E8F5E9]'}
      `}
        >
            {children}
        </Link>
    );
}
