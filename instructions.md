I'll create a comprehensive, structured prompt for your AI IDE that breaks down this project into clear sections:

```markdown
# College Collaboration Platform - Next.js + Supabase

## Project Overview
Build a full-stack web application using Next.js 14+ (App Router) and Supabase that combines classroom management features (like Google Classroom) with real-time group messaging (like WhatsApp) for college students.

---

## Core Features Required

### 1. Authentication System
- Implement Supabase Authentication
- Email/password sign up and login
- Password reset functionality
- Protected routes (redirect unauthenticated users)
- User profile management (name, email, avatar)
- Session management and persistence

### 2. Group/Classroom Management
- Create new groups/classrooms
- Each group has:
  - Name and description
  - Creator/admin
  - Member list
  - Unique invite code or link
- Add members to groups via:
  - Email invitation
  - Shareable invite link/code
- Remove members (admin only)
- Leave group functionality
- List all groups user belongs to
- Group settings page

### 3. Real-time Chat System
- WhatsApp-style messaging interface
- Features per group:
  - Text messages
  - File attachments (documents, images, videos)
  - Link sharing with preview
  - Message timestamps
  - Read receipts (optional)
  - User avatars next to messages
- Real-time updates using Supabase Realtime
- Message history/pagination
- Typing indicators (optional enhancement)

### 4. File & Resource Sharing
- Upload and share:
  - Documents (PDF, DOC, DOCX, PPT, etc.)
  - Images (JPG, PNG, GIF)
  - Videos (MP4, MOV, etc.)
  - Links with metadata preview
- Organize shared resources by:
  - Recent uploads
  - File type
  - Uploader
- Download functionality
- File preview where possible
- Storage using Supabase Storage

---

## Technical Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or Radix UI
- **State Management**: React Context API or Zustand
- **Real-time**: Supabase Realtime subscriptions

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Next.js API Routes (App Router route handlers)

---

## Database Schema (Supabase Tables)

### Table: `profiles`
```sql
- id (uuid, primary key, references auth.users)
- email (text, unique)
- full_name (text)
- avatar_url (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

### Table: `groups`
```sql
- id (uuid, primary key)
- name (text, not null)
- description (text, nullable)
- created_by (uuid, foreign key to profiles.id)
- invite_code (text, unique)
- created_at (timestamp)
- updated_at (timestamp)
```

### Table: `group_members`
```sql
- id (uuid, primary key)
- group_id (uuid, foreign key to groups.id, on delete cascade)
- user_id (uuid, foreign key to profiles.id, on delete cascade)
- role (text: 'admin' | 'member')
- joined_at (timestamp)
- unique constraint on (group_id, user_id)
```

### Table: `messages`
```sql
- id (uuid, primary key)
- group_id (uuid, foreign key to groups.id, on delete cascade)
- sender_id (uuid, foreign key to profiles.id)
- content (text, nullable)
- message_type (text: 'text' | 'file' | 'link')
- file_url (text, nullable)
- file_name (text, nullable)
- file_type (text, nullable)
- created_at (timestamp)
```

### Table: `shared_resources`
```sql
- id (uuid, primary key)
- group_id (uuid, foreign key to groups.id, on delete cascade)
- uploaded_by (uuid, foreign key to profiles.id)
- resource_type (text: 'document' | 'image' | 'video' | 'link')
- file_url (text, nullable)
- file_name (text, nullable)
- file_size (bigint, nullable)
- title (text)
- description (text, nullable)
- created_at (timestamp)
```

---

## Folder Structure

```
/app
  /(auth)
    /login
      page.tsx
    /signup
      page.tsx
    /reset-password
      page.tsx
  /(dashboard)
    /dashboard
      page.tsx           # List all groups
    /groups
      /[groupId]
        page.tsx         # Group chat/messages
        /resources
          page.tsx       # Shared resources
        /settings
          page.tsx       # Group settings
    /profile
      page.tsx
  /api
    /groups
      route.ts           # CRUD for groups
    /messages
      route.ts           # Send messages
    /upload
      route.ts           # File uploads
  layout.tsx
  page.tsx               # Landing page

/components
  /auth
    LoginForm.tsx
    SignupForm.tsx
  /groups
    GroupList.tsx
    GroupCard.tsx
    CreateGroupModal.tsx
    InviteMemberModal.tsx
  /chat
    MessageList.tsx
    MessageInput.tsx
    MessageBubble.tsx
    FileUpload.tsx
  /resources
    ResourceGrid.tsx
    ResourceCard.tsx
  /ui
    # shadcn/ui components

/lib
  supabase
    client.ts            # Supabase client
    server.ts            # Server-side client
  utils.ts
  constants.ts

/types
  database.types.ts      # Generated Supabase types
  index.ts

/hooks
  useUser.ts
  useGroups.ts
  useMessages.ts
  useRealtime.ts
```

---

## Key Implementation Steps

### Step 1: Setup & Configuration
1. Initialize Next.js project with TypeScript
2. Install dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install tailwindcss shadcn/ui
   ```
3. Set up Supabase project and get credentials
4. Configure environment variables (.env.local):
   ```
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ```

### Step 2: Database Setup
1. Create all tables in Supabase SQL Editor
2. Set up Row Level Security (RLS) policies:
   - Users can only read their own profile
   - Users can only see groups they're members of
   - Users can only see messages in their groups
   - Only group admins can delete groups
3. Set up Storage buckets:
   - `avatars` bucket (public)
   - `group-files` bucket (authenticated)
4. Generate TypeScript types from database

### Step 3: Authentication
1. Create auth context provider
2. Build login/signup pages
3. Implement protected route middleware
4. Add profile creation trigger (on user signup)

### Step 4: Group Management
1. Build group creation flow
2. Implement invite system (generate unique codes)
3. Create group list dashboard
4. Add member management UI

### Step 5: Real-time Chat
1. Set up Supabase Realtime subscriptions
2. Build message input component with file upload
3. Create message list with infinite scroll
4. Implement file upload to Supabase Storage
5. Add link preview functionality

### Step 6: Resource Sharing
1. Build resource upload interface
2. Create resource gallery/grid view
3. Implement download functionality
4. Add file type filtering

### Step 7: Polish & Optimization
1. Add loading states and skeletons
2. Implement error handling
3. Add toast notifications
4. Optimize images with Next.js Image
5. Add mobile responsive design

---

## Supabase RLS Policy Examples

```sql
-- Groups: Users can only see groups they're members of
CREATE POLICY "Users can view their groups"
ON groups FOR SELECT
USING (
  id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);

-- Messages: Users can only see messages in their groups
CREATE POLICY "Users can view group messages"
ON messages FOR SELECT
USING (
  group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);

-- Messages: Users can insert messages in their groups
CREATE POLICY "Users can send messages to their groups"
ON messages FOR INSERT
WITH CHECK (
  group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);
```

---

## Features to Implement in Order

1. ✅ Authentication (login, signup, password reset)
2. ✅ User profiles
3. ✅ Create groups
4. ✅ Join groups (invite codes)
5. ✅ Group member management
6. ✅ Basic text messaging
7. ✅ Real-time message updates
8. ✅ File uploads in chat
9. ✅ Shared resources section
10. ✅ Link sharing with previews
11. 🔄 Read receipts (optional)
12. 🔄 Typing indicators (optional)
13. 🔄 Push notifications (optional)

---

## Environment Variables Needed

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Additional Considerations

- **Security**: Implement proper RLS policies for all tables
- **Performance**: Use pagination for messages and resources
- **UX**: Add optimistic updates for better perceived performance
- **Mobile**: Ensure responsive design works on all devices
- **File Size**: Limit file upload sizes (e.g., 10MB for free tier)
- **Validation**: Add input validation on both client and server
- **Error Handling**: Graceful error messages for users

---

## Testing Checklist

- [ ] User can sign up and log in
- [ ] User can create a group
- [ ] User can invite others to group
- [ ] User can join group via invite code
- [ ] Messages appear in real-time
- [ ] Files upload successfully
- [ ] Files can be downloaded
- [ ] User can leave a group
- [ ] Admin can remove members
- [ ] Only group members can see content
- [ ] RLS policies prevent unauthorized access

---

## Deployment
- Deploy to Vercel (recommended for Next.js)
- Ensure environment variables are set in production
- Test all features in production environment
```

This structured prompt breaks down your project into manageable sections that your AI IDE can process step-by-step. You can paste this entire prompt or feed it section by section depending on how your AI IDE works best!