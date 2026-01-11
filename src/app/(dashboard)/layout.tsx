"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { GroupSidebar } from "@/components/layout/GroupSidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
                {/* 1. Single Sidebar (Signal-style) */}
                <GroupSidebar />

                {/* 2. Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 bg-[var(--background)] overflow-hidden">
                    {children}
                </main>
            </div>
        </AuthProvider>
    );
}
