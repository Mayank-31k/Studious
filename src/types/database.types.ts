export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    full_name: string | null;
                    avatar_url: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    full_name?: string | null;
                    avatar_url?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            groups: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    avatar_url: string | null;
                    created_by: string;
                    invite_code: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    avatar_url?: string | null;
                    created_by: string;
                    invite_code: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    avatar_url?: string | null;
                    created_by?: string;
                    invite_code?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            group_members: {
                Row: {
                    id: string;
                    group_id: string;
                    user_id: string;
                    role: 'admin' | 'member';
                    joined_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    user_id: string;
                    role?: 'admin' | 'member';
                    joined_at?: string;
                };
                Update: {
                    id?: string;
                    group_id?: string;
                    user_id?: string;
                    role?: 'admin' | 'member';
                    joined_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    group_id: string;
                    sender_id: string;
                    content: string | null;
                    message_type: 'text' | 'file' | 'link';
                    file_url: string | null;
                    file_name: string | null;
                    file_type: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    sender_id: string;
                    content?: string | null;
                    message_type?: 'text' | 'file' | 'link';
                    file_url?: string | null;
                    file_name?: string | null;
                    file_type?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    group_id?: string;
                    sender_id?: string;
                    content?: string | null;
                    message_type?: 'text' | 'file' | 'link';
                    file_url?: string | null;
                    file_name?: string | null;
                    file_type?: string | null;
                    created_at?: string;
                };
            };
            shared_resources: {
                Row: {
                    id: string;
                    group_id: string;
                    uploaded_by: string;
                    resource_type: 'document' | 'image' | 'video' | 'link';
                    file_url: string | null;
                    file_name: string | null;
                    file_size: number | null;
                    title: string;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    group_id: string;
                    uploaded_by: string;
                    resource_type: 'document' | 'image' | 'video' | 'link';
                    file_url?: string | null;
                    file_name?: string | null;
                    file_size?: number | null;
                    title: string;
                    description?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    group_id?: string;
                    uploaded_by?: string;
                    resource_type?: 'document' | 'image' | 'video' | 'link';
                    file_url?: string | null;
                    file_name?: string | null;
                    file_size?: number | null;
                    title?: string;
                    description?: string | null;
                    created_at?: string;
                };
            };
        };
    };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Group = Database['public']['Tables']['groups']['Row'];
export type GroupMember = Database['public']['Tables']['group_members']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type SharedResource = Database['public']['Tables']['shared_resources']['Row'];

// Extended types with relations
export interface GroupWithMembers extends Group {
    members?: (GroupMember & { profile: Profile })[];
    member_count?: number;
}

export interface MessageWithSender extends Message {
    sender: Profile;
}

export interface SharedResourceWithUploader extends SharedResource {
    uploader: Profile;
}
