/**
 * COMPLETE STUDIOUS LANDING PAGE - SINGLE FILE VERSION
 * 
 * This file contains all the main components and structure of the Studious landing page.
 * To use this in a new project:
 * 
 * 1. Setup your project with Vite + React + TypeScript
 * 2. Install dependencies: npm install lucide-react react-router-dom
 * 3. Copy the CSS from the accompanying UI_DESIGN_SYSTEM.md file
 * 4. Use the components below in your App.tsx or split them into separate files
 */

import React from 'react';
import { ArrowRight, Circle, Users, FolderOpen, Shield, Zap, Check, Sparkles, Download } from 'lucide-react';

// ============================================================================
// NAVBAR COMPONENT
// ============================================================================

const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Circle className="w-7 h-7 stroke-[2.5]" />
                    <span className="font-semibold text-lg">Studious</span>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="nav-link">Features</a>
                    <a href="#collaboration" className="nav-link">Collaboration</a>
                    <a href="#resources" className="nav-link">Resources</a>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <button className="nav-link hidden sm:block">Log in</button>
                    <button className="btn-primary">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

// ============================================================================
// WORKSPACE PREVIEW COMPONENT
// ============================================================================

const WorkspacePreview = () => {
    return (
        <div className="relative max-w-5xl mx-auto">
            {/* Feature Badge - Floating */}
            <div className="absolute -top-4 left-4 md:left-0 z-10">
                <div className="feature-badge">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-sm">New Feature</p>
                        <p className="text-xs text-muted-foreground">AI-powered note summarization</p>
                    </div>
                </div>
            </div>

            {/* Main Workspace Card */}
            <div className="workspace-card flex flex-col md:flex-row">
                {/* Sidebar */}
                <div className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-border/50">
                    {/* Window Dots */}
                    <div className="flex items-center gap-1.5 mb-6">
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                        <div className="w-3 h-3 rounded-full bg-muted"></div>
                    </div>

                    {/* Workspaces */}
                    <div className="mb-8">
                        <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">Workspaces</p>
                        <div className="space-y-1">
                            <div className="workspace-item bg-secondary/50">
                                <div className="workspace-avatar">P</div>
                                <span className="text-sm font-medium">Physics 101</span>
                            </div>
                            <div className="workspace-item">
                                <div className="workspace-avatar">D</div>
                                <span className="text-sm font-medium">Design Team</span>
                            </div>
                            <div className="workspace-item">
                                <div className="workspace-avatar">F</div>
                                <span className="text-sm font-medium">Final Project</span>
                            </div>
                        </div>
                    </div>

                    {/* Members */}
                    <div>
                        <p className="text-xs font-medium text-muted-foreground tracking-wider uppercase mb-4">Members</p>
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-accent-blue/20 border-2 border-background"></div>
                            <div className="w-8 h-8 rounded-full bg-accent-green/20 border-2 border-background"></div>
                            <div className="w-8 h-8 rounded-full bg-accent-pink/20 border-2 border-background"></div>
                            <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs text-muted-foreground">+3</div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6">
                    <div className="space-y-4">
                        {/* Message 1 */}
                        <div className="flex items-start gap-3">
                            <div className="indicator-dot indicator-blue mt-2"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-2 w-16 bg-muted rounded"></div>
                                </div>
                                <div className="chat-bubble-left">
                                    <p className="text-sm">Hey team! I've uploaded the latest research notes for Chapter 4. Let's review them during our sync.</p>
                                </div>
                            </div>
                        </div>

                        {/* Message 2 */}
                        <div className="flex items-start gap-3 justify-end">
                            <div>
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    <div className="h-2 w-12 bg-muted rounded"></div>
                                    <div className="w-6 h-6 rounded-full bg-accent-pink/30"></div>
                                </div>
                                <div className="chat-bubble-right">
                                    <p className="text-sm">Awesome, checking them now!</p>
                                </div>
                            </div>
                        </div>

                        {/* File Attachment */}
                        <div className="flex items-start gap-3">
                            <div className="indicator-dot indicator-green mt-2"></div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="h-2 w-20 bg-muted rounded"></div>
                                </div>
                                <div className="file-card">
                                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                        <span className="text-xs font-bold text-red-600">PDF</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">Research_Notes_V2.pdf</p>
                                        <p className="text-xs text-muted-foreground">2.4 MB</p>
                                    </div>
                                    <Download className="w-4 h-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="mt-8 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 px-4 py-3 bg-secondary/30 rounded-xl">
                            <p className="text-sm text-muted-foreground">Type a message...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// HERO COMPONENT
// ============================================================================

const Hero = () => {
    return (
        <section className="pt-32 pb-16 px-6">
            <div className="container mx-auto text-center">
                {/* Hero Title */}
                <h1 className="hero-title mb-6">
                    Study better,<br />
                    <span className="hero-title-fade">together.</span>
                </h1>

                {/* Subtitle */}
                <p className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
                    The high-performance workspace for modern students.<br />
                    Real-time collaboration, refined.
                </p>

                {/* CTA Buttons */}
                <div className="flex items-center justify-center gap-4 mb-16">
                    <button className="btn-primary">
                        Start building
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="btn-ghost">View examples</button>
                </div>

                {/* Workspace Preview */}
                <WorkspacePreview />

                {/* Trust Badges */}
                <div className="mt-20">
                    <p className="text-muted-foreground text-sm mb-8">Empowering teams at</p>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                        <span className="university-logo">STANFORD</span>
                        <span className="university-logo">HARVARD</span>
                        <span className="university-logo">MIT</span>
                        <span className="university-logo">OXFORD</span>
                        <span className="university-logo">BERKELEY</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FEATURES COMPONENT
// ============================================================================

const features = [
    {
        icon: Zap,
        title: "Real-time Collaboration",
        description: "Seamless synchronization across all devices. Chat, share, and build together in a unified environment.",
    },
    {
        icon: Users,
        title: "Group Management",
        description: "Granular control over team dynamics. Manage permissions, roles, and workspaces with precision.",
    },
    {
        icon: FolderOpen,
        title: "Resource Sharing",
        description: "A centralized vault for all your assets. Organize, preview, and distribute files with a single click.",
    },
    {
        icon: Shield,
        title: "Secure by Design",
        description: "Enterprise-grade security built on trusted infrastructure. Your data remains yours, always.",
    },
];

const Features = () => {
    return (
        <section id="features" className="py-24 px-6">
            <div className="container mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Capabilities</p>
                    <h2 className="section-title">
                        Refined tools for serious teams.
                    </h2>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card group">
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <feature.icon className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// MESSAGING COMPONENT
// ============================================================================

const benefits = [
    "Instant message delivery",
    "End-to-end encryption",
    "Rich file previews",
    "Advanced search history",
];

const Messaging = () => {
    return (
        <section id="collaboration" className="py-24 px-6 bg-secondary/30">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    {/* Left Content */}
                    <div>
                        <h2 className="section-title mb-6">
                            Messages that <br />
                            <span className="section-title-fade">move fast.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            Experience lightning-fast communication. Our real-time infrastructure ensures your messages and files arrive instantly, no matter where your team is.
                        </p>
                        <ul className="space-y-4">
                            {benefits.map((benefit, index) => (
                                <li key={index} className="check-item">
                                    <div className="check-icon">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    <span className="text-sm">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right - Chat Preview */}
                    <div className="workspace-card p-6">
                        <div className="space-y-4">
                            {/* Message 1 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-blue/20"></div>
                                <div className="chat-bubble-left">
                                    <p className="text-sm">Did you see the new design guidelines?</p>
                                </div>
                            </div>

                            {/* Message 2 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-green/20"></div>
                                <div className="chat-bubble-left">
                                    <p className="text-sm">Looking at them now. Love the typography.</p>
                                </div>
                            </div>

                            {/* Message 3 */}
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-pink/20"></div>
                                <div className="chat-bubble-left">
                                    <p className="text-sm">It feels way more refined.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// CTA COMPONENT
// ============================================================================

const CTA = () => {
    return (
        <section className="py-24 px-6">
            <div className="container mx-auto text-center max-w-3xl">
                <h2 className="section-title mb-6">
                    The workspace of <br />
                    <span className="section-title-fade">tomorrow, today.</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
                    Experience the most refined collaboration platform for modern student teams. Free for individuals, forever.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <button className="btn-primary">
                        Get started for free
                    </button>
                    <button className="btn-ghost">Contact sales</button>
                </div>
            </div>
        </section>
    );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

const Footer = () => {
    return (
        <footer className="py-8 px-6 border-t border-border/50">
            <div className="container mx-auto flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Static route</p>
                <p className="text-sm text-muted-foreground">© 2024 Studious</p>
            </div>
        </footer>
    );
};

// ============================================================================
// MAIN INDEX PAGE
// ============================================================================

const Index = () => {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main>
                <Hero />
                <Features />
                <Messaging />
                <CTA />
            </main>
            <Footer />
        </div>
    );
};

// ============================================================================
// APP COMPONENT (Main Entry Point)
// ============================================================================

const App = () => {
    return <Index />;
};

export default App;

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Install required dependencies:
 *    npm install lucide-react
 * 
 * 2. Copy the CSS from UI_DESIGN_SYSTEM.md to your index.css or globals.css
 * 
 * 3. Make sure your tailwind.config.ts matches the configuration in UI_DESIGN_SYSTEM.md
 * 
 * 4. Import and use this App component in your main.tsx:
 *    import App from './App'
 *    ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
 * 
 * 5. To split into separate files, simply copy each component section into its own file
 *    and export it as a named or default export.
 * 
 * COMPONENT BREAKDOWN:
 * - Navbar: Fixed header with logo, navigation links, and auth buttons
 * - Hero: Main hero section with title, CTA buttons, workspace preview, and trust badges
 * - WorkspacePreview: Interactive workspace mockup with sidebar and chat interface
 * - Features: 4-column grid of feature cards with icons
 * - Messaging: Two-column section with benefits list and chat preview
 * - CTA: Call-to-action section with centered content
 * - Footer: Simple footer with copyright
 * - Index: Main page layout combining all sections
 * - App: Root component
 */
