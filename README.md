# Studious

A modern collaborative workspace platform for students and teams, built with Next.js, Supabase, and TypeScript.

## ✨ Features

### 🔐 Authentication & User Management
- Secure email/password authentication via Supabase Auth
- User profiles with customizable avatars
- Password reset functionality
- Protected routes and session management

### 💬 Real-time Group Chat
- Create and join collaborative workspaces
- Real-time messaging with instant updates
- Message history and persistence
- Clean, minimalist Signal/Cursor-inspired UI
- Distinct chat bubbles for self and others
- File sharing capabilities in messages

### 👥 Group Management (Admin Features)
- **Create Workspaces**: Set up new collaborative spaces with custom names and descriptions
- **Join via Invite Code**: 6-character invite codes for easy team joining
- **Group Avatars**: Upload custom avatars for each workspace
- **Edit Group Info**: Update workspace name and description
- **Member Management**: 
  - View all group members
  - Promote members to admin
  - Demote admins to member
  - Role-based permissions
- **Delete Groups**: Remove workspaces with confirmation (admin only)

### 📁 Resource Sharing
- Upload and share documents, images, and videos
- Organized resource library per workspace
- File preview and download
- Supabase Storage integration
- Resource metadata (title, description, uploader info)

### 🎨 Modern UI/UX
- **Dashboard**: Clean, professional Webflow/Retell AI-inspired design
  - White background with proper spacing
  - Refined typography and button styles
  - Smooth hover effects and transitions
- **Minimalist Chat Interface**: 
  - 2-column layout (Sidebar + Chat)
  - Backdrop blur effects
  - Monochrome color scheme
- **Responsive Design**: Works seamlessly across devices
- **Dark Mode Support**: Professional dark theme throughout

### 🚀 Technical Features
- **Next.js 15**: Latest App Router with Server Components
- **TypeScript**: Full type safety across the application
- **Supabase**: 
  - PostgreSQL database
  - Real-time subscriptions
  - Storage for files and avatars
  - Row Level Security (RLS)
- **Tailwind CSS**: Utility-first styling with custom design system
- **Framer Motion**: Smooth animations and transitions
- **Radix UI**: Accessible component primitives

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Styling**: Tailwind CSS, Custom CSS Variables
- **UI Components**: Radix UI, Custom Components
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Studious
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

Required Supabase tables:
- `profiles` - User profile information
- `groups` - Workspace/group data
- `group_members` - Group membership and roles
- `messages` - Chat messages
- `shared_resources` - Uploaded files and resources

Storage buckets:
- `avatars` - User profile pictures
- `group-avatars` - Workspace avatars
- `shared-files` - Shared documents and media

## 🎯 Usage

1. **Sign Up/Login**: Create an account or sign in
2. **Create Workspace**: Click "New workspace" on the dashboard
3. **Invite Members**: Share the 6-character invite code with your team
4. **Start Collaborating**: 
   - Send messages in real-time
   - Share files and resources
   - Manage team members (admins)

## 🔒 Security

- Row Level Security (RLS) policies on all tables
- Secure file uploads with access control
- Protected API routes
- Session-based authentication

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the repository owner for contribution guidelines.

---

Built with ❤️ using Next.js and Supabase
