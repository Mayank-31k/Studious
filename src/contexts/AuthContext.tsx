'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile, Group } from '@/types/database.types';

interface AuthContextType {
    user: User | null;
    profile: Profile | null;
    session: Session | null;
    loading: boolean;
    groups: Group[];
    groupsLoading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
    fetchGroups: () => Promise<void>;
    refreshGroups: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<Group[]>([]);
    const [groupsLoading, setGroupsLoading] = useState(true);
    const [groupsFetched, setGroupsFetched] = useState(false);

    const supabase = createClient();

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (data) {
            setProfile(data);
        }
    };

    const fetchGroupsData = useCallback(async (userId: string) => {
        // Only show loading on first fetch
        if (!groupsFetched) {
            setGroupsLoading(true);
        }

        const { data } = await supabase
            .from('group_members')
            .select(`
                group_id,
                groups:group_id (
                    id,
                    name,
                    description,
                    created_by,
                    invite_code,
                    created_at
                )
            `)
            .eq('user_id', userId);

        if (data) {
            const groupsList = data
                .map((item: any) => {
                    const group = Array.isArray(item.groups) ? item.groups[0] : item.groups;
                    return group;
                })
                .filter((g: any): g is Group => g !== null);
            setGroups(groupsList);
            setGroupsFetched(true);
        }

        setGroupsLoading(false);
    }, [supabase, groupsFetched]);

    useEffect(() => {
        // Get initial session
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
                await fetchGroupsData(session.user.id);
            }
            setLoading(false);
        };

        getSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                if (session?.user) {
                    // Fetch in background - don't block
                    fetchProfile(session.user.id).catch((error) => {
                        console.error('Failed to fetch profile:', error);
                        // Optionally: show a toast notification or set an error state
                    });
                    if (!groupsFetched) {
                        fetchGroupsData(session.user.id).catch((error) => {
                            console.error('Failed to fetch groups:', error);
                            // Optionally: show a toast notification or set an error state
                        });
                    }
                } else {
                    setProfile(null);
                    setGroups([]);
                    setGroupsFetched(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchGroups = useCallback(async () => {
        if (user) {
            await fetchGroupsData(user.id);
        }
    }, [user, fetchGroupsData]);

    const refreshGroups = useCallback(async () => {
        if (user) {
            setGroupsLoading(true);
            await fetchGroupsData(user.id);
        }
    }, [user, fetchGroupsData]);

    const signUp = async (email: string, password: string, fullName: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        });
        return { error: error as Error | null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setProfile(null);
        setSession(null);
        setGroups([]);
        setGroupsFetched(false);
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password/confirm`,
        });
        return { error: error as Error | null };
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: new Error('No user logged in') };

        const { error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (!error) {
            setProfile((prev) => prev ? { ...prev, ...updates } : null);
        }

        return { error: error as Error | null };
    };

    const value = {
        user,
        profile,
        session,
        loading,
        groups,
        groupsLoading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updateProfile,
        fetchGroups,
        refreshGroups,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
