Complete UI Design System Documentation
Studious Landing Page - Design Reference
NOTE

This document contains the complete UI design system for the Studious landing page. Use this as a reference to recreate the same design aesthetic in your own applications.

📋 Table of Contents
Technology Stack
Design Philosophy
Color System
Typography
Custom CSS Classes
Component Structures
Layout Patterns
Animations
🛠 Technology Stack
Framework: React 18.3+ with TypeScript
Build Tool: Vite 5.4+
Styling: Tailwind CSS 3.4+ with custom configuration
UI Components: Shadcn UI (Radix UI primitives)
Fonts: Inter (sans-serif) + Playfair Display (serif)
Icons: Lucide React
State Management: TanStack Query
Routing: React Router DOM
🎨 Design Philosophy
The design follows a refined, minimalist aesthetic with:

Clean, spacious layouts with generous whitespace
Sophisticated typography hierarchy using serif fonts for headings
Subtle color palette with muted tones
Smooth transitions and micro-interactions
Card-based components with soft borders
Professional, academic feel suitable for student collaboration
🌈 Color System
CSS Variables (Light Mode)
:root {
  /* Base Colors */
  --background: 0 0% 100%;           /* Pure white */
  --foreground: 0 0% 9%;             /* Almost black */
  
  /* Card Colors */
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  
  /* Interactive Elements */
  --primary: 0 0% 9%;                /* Black for buttons */
  --primary-foreground: 0 0% 100%;   /* White text on black */
  
  --secondary: 0 0% 96%;             /* Light gray backgrounds */
  --secondary-foreground: 0 0% 9%;
  
  /* Muted/Subtle Elements */
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;      /* Medium gray text */
  
  /* Borders & Inputs */
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 0 0% 9%;                   /* Focus ring */
  
  /* Custom Accent Colors */
  --hero-fade: 0 0% 75%;             /* Faded text in hero */
  --chat-blue: 210 100% 95%;         /* Light blue backgrounds */
  --chat-green: 150 60% 95%;         /* Light green backgrounds */
  --chat-pink: 330 100% 95%;         /* Light pink backgrounds */
  --accent-blue: 210 100% 60%;       /* Vibrant blue */
  --accent-green: 150 60% 50%;       /* Vibrant green */
  --accent-pink: 330 80% 70%;        /* Vibrant pink */
  
  /* Border Radius */
  --radius: 0.75rem;                 /* 12px default radius */
}
Dark Mode Colors
.dark {
  --background: 0 0% 4%;             /* Very dark gray */
  --foreground: 0 0% 98%;            /* Almost white */
  --card: 0 0% 7%;
  --card-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 0 0% 9%;
  --secondary: 0 0% 15%;
  --secondary-foreground: 0 0% 98%;
  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;
  --border: 0 0% 20%;
  --input: 0 0% 20%;
  --ring: 0 0% 85%;
}
Tailwind Color Extensions
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  "hero-fade": "hsl(var(--hero-fade))",
  "chat-blue": "hsl(var(--chat-blue))",
  "chat-green": "hsl(var(--chat-green))",
  "chat-pink": "hsl(var(--chat-pink))",
  "accent-blue": "hsl(var(--accent-blue))",
  "accent-green": "hsl(var(--accent-green))",
  "accent-pink": "hsl(var(--accent-pink))",
}
✍️ Typography
Font Families
/* Import from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
/* CSS Variables */
--font-sans: 'Inter', system-ui, sans-serif;
--font-serif: 'Playfair Display', Georgia, serif;
Tailwind Font Configuration
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  serif: ['Playfair Display', 'Georgia', 'serif'],
}
Typography Classes
/* Hero Title - Large serif headings */
.hero-title {
  font-family: var(--font-serif);
  @apply text-6xl md:text-7xl lg:text-8xl font-medium tracking-tight leading-none;
}
.hero-title-fade {
  color: hsl(var(--hero-fade));
  font-style: italic;
}
/* Section Title - Medium serif headings */
.section-title {
  font-family: var(--font-serif);
  @apply text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight;
}
.section-title-fade {
  color: hsl(var(--hero-fade));
  font-style: italic;
}
/* Base Typography */
body {
  @apply bg-background text-foreground font-sans antialiased;
  font-family: var(--font-sans);
}
h1, h2, h3 {
  @apply tracking-tight;
}
🎯 Custom CSS Classes
Cards & Containers
/* Feature Card - Hover effect */
.feature-card {
  @apply bg-card rounded-2xl p-6 border border-border/50 
         hover:border-border transition-colors duration-300;
}
/* Workspace Card - Shadow and overflow */
.workspace-card {
  @apply bg-card rounded-2xl border border-border/50 
         shadow-lg overflow-hidden;
}
/* File Card */
.file-card {
  @apply bg-secondary/50 rounded-xl px-4 py-3 
         flex items-center gap-3 border border-border/30;
}
Chat Bubbles
/* Left-aligned chat bubble */
.chat-bubble-left {
  @apply bg-secondary rounded-2xl rounded-bl-sm 
         px-4 py-3 max-w-xs;
}
/* Right-aligned chat bubble (user message) */
.chat-bubble-right {
  @apply bg-primary text-primary-foreground 
         rounded-2xl rounded-br-sm px-4 py-3 max-w-xs;
}
Buttons
/* Primary Button - Black with white text */
.btn-primary {
  @apply bg-primary text-primary-foreground 
         px-6 py-3 rounded-full font-medium text-sm 
         inline-flex items-center gap-2 
         hover:opacity-90 transition-opacity;
}
/* Ghost Button - Transparent with hover */
.btn-ghost {
  @apply text-foreground px-4 py-3 font-medium text-sm 
         hover:text-muted-foreground transition-colors;
}
Navigation
/* Navigation Link */
.nav-link {
  @apply text-muted-foreground hover:text-foreground 
         transition-colors duration-200 text-sm font-medium;
}
Badges & Indicators
/* Feature Badge - Floating notification style */
.feature-badge {
  @apply inline-flex items-center gap-2 
         bg-secondary/80 text-foreground 
         px-4 py-2 rounded-full text-sm font-medium 
         border border-border/30 shadow-sm;
}
/* Trust Badge - University logos */
.trust-badge {
  @apply text-muted-foreground/40 font-semibold 
         text-sm tracking-widest uppercase;
}
.university-logo {
  @apply text-muted-foreground/30 font-bold 
         text-lg tracking-wider;
}
/* Status Indicator Dots */
.indicator-dot {
  @apply w-3 h-3 rounded-full;
}
.indicator-blue {
  background-color: hsl(var(--accent-blue));
}
.indicator-green {
  background-color: hsl(var(--accent-green));
}
.indicator-pink {
  background-color: hsl(var(--accent-pink));
}
Workspace Elements
/* Workspace Item - Sidebar navigation */
.workspace-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg 
         hover:bg-secondary/50 transition-colors cursor-pointer;
}
/* Workspace Avatar - Letter avatar */
.workspace-avatar {
  @apply w-8 h-8 rounded-lg bg-secondary 
         flex items-center justify-center 
         text-xs font-semibold;
}
Utility Classes
/* Gradient Text */
.gradient-text {
  @apply bg-clip-text text-transparent 
         bg-gradient-to-r from-foreground to-muted-foreground;
}
/* Check Item - List with checkmarks */
.check-item {
  @apply flex items-center gap-3 text-muted-foreground;
}
.check-icon {
  @apply w-5 h-5 rounded-full bg-primary/10 
         flex items-center justify-center;
}
/* Text Balance - Better text wrapping */
.text-balance {
  text-wrap: balance;
}
🧩 Component Structures
1. Navbar Component
import { Circle } from "lucide-react";
const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
                    bg-background/80 backdrop-blur-md 
                    border-b border-border/50">
      <div className="container mx-auto px-6 py-4 
                      flex items-center justify-between">
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
          <button className="btn-primary">Get Started</button>
        </div>
      </div>
    </nav>
  );
};
Key Features:

Fixed positioning with backdrop blur
Responsive navigation (hidden on mobile)
Glassmorphism effect with bg-background/80 backdrop-blur-md
2. Hero Section
import { ArrowRight } from "lucide-react";
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
        <p className="text-muted-foreground text-lg md:text-xl 
                      max-w-xl mx-auto mb-10 leading-relaxed">
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
        {/* Trust Badges */}
        <div className="mt-20">
          <p className="text-muted-foreground text-sm mb-8">
            Empowering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center 
                          gap-8 md:gap-16">
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
Key Features:

Large serif typography for impact
Italicized faded text for emphasis
Centered layout with max-width constraints
Trust indicators (university logos)
3. Features Section
import { Users, FolderOpen, Shield, Zap } from "lucide-react";
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
          <p className="text-sm font-medium text-muted-foreground 
                        uppercase tracking-wider mb-4">
            Capabilities
          </p>
          <h2 className="section-title">
            Refined tools for serious teams.
          </h2>
        </div>
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 
                        gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="w-12 h-12 rounded-xl bg-secondary 
                              flex items-center justify-center mb-5 
                              group-hover:bg-primary 
                              group-hover:text-primary-foreground 
                              transition-colors duration-300">
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
Key Features:

4-column responsive grid
Icon hover effect (background changes to primary)
Uppercase section label
Card-based layout
4. Messaging/Collaboration Section
import { Check } from "lucide-react";
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 
                        items-center max-w-6xl mx-auto">
          {/* Left Content */}
          <div>
            <h2 className="section-title mb-6">
              Messages that <br />
              <span className="section-title-fade">move fast.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Experience lightning-fast communication. Our real-time 
              infrastructure ensures your messages and files arrive 
              instantly, no matter where your team is.
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
                  <p className="text-sm">
                    Did you see the new design guidelines?
                  </p>
                </div>
              </div>
              {/* Message 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-accent-green/20"></div>
                <div className="chat-bubble-left">
                  <p className="text-sm">
                    Looking at them now. Love the typography.
                  </p>
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
Key Features:

Two-column layout (text + preview)
Checklist with custom icons
Chat bubble preview with colored avatars
Light background section
5. Workspace Preview Component
import { Sparkles, Download } from "lucide-react";
const WorkspacePreview = () => {
  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Feature Badge - Floating */}
      <div className="absolute -top-4 left-4 md:left-0 z-10">
        <div className="feature-badge">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br 
                          from-amber-100 to-amber-200 
                          flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">New Feature</p>
            <p className="text-xs text-muted-foreground">
              AI-powered note summarization
            </p>
          </div>
        </div>
      </div>
      {/* Main Workspace Card */}
      <div className="workspace-card flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 p-6 border-b md:border-b-0 
                        md:border-r border-border/50">
          {/* Window Dots */}
          <div className="flex items-center gap-1.5 mb-6">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <div className="w-3 h-3 rounded-full bg-muted"></div>
          </div>
          {/* Workspaces */}
          <div className="mb-8">
            <p className="text-xs font-medium text-muted-foreground 
                          tracking-wider uppercase mb-4">
              Workspaces
            </p>
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
            <p className="text-xs font-medium text-muted-foreground 
                          tracking-wider uppercase mb-4">
              Members
            </p>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 
                              border-2 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-accent-green/20 
                              border-2 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-accent-pink/20 
                              border-2 border-background"></div>
              <div className="w-8 h-8 rounded-full bg-muted 
                              border-2 border-background 
                              flex items-center justify-center 
                              text-xs text-muted-foreground">
                +3
              </div>
            </div>
          </div>
        </div>
        {/* Chat Area */}
        <div className="flex-1 p-6">
          <div className="space-y-4">
            {/* Message with indicator */}
            <div className="flex items-start gap-3">
              <div className="indicator-dot indicator-blue mt-2"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="h-2 w-16 bg-muted rounded"></div>
                </div>
                <div className="chat-bubble-left">
                  <p className="text-sm">
                    Hey team! I've uploaded the latest research notes 
                    for Chapter 4. Let's review them during our sync.
                  </p>
                </div>
              </div>
            </div>
            {/* User message (right-aligned) */}
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
                  <div className="w-8 h-8 rounded-lg bg-red-100 
                                  flex items-center justify-center">
                    <span className="text-xs font-bold text-red-600">
                      PDF
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Research_Notes_V2.pdf
                    </p>
                    <p className="text-xs text-muted-foreground">2.4 MB</p>
                  </div>
                  <Download className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
          {/* Message Input */}
          <div className="mt-8 pt-4 border-t border-border/50">
            <div className="flex items-center gap-3 px-4 py-3 
                            bg-secondary/30 rounded-xl">
              <p className="text-sm text-muted-foreground">
                Type a message...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
Key Features:

Floating feature badge with gradient background
Two-panel layout (sidebar + chat)
Window control dots (macOS style)
Workspace list with letter avatars
Overlapping member avatars
Chat messages with status indicators
File attachment preview
Message input placeholder
6. CTA Section
const CTA = () => {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="section-title mb-6">
          The workspace of <br />
          <span className="section-title-fade">tomorrow, today.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Experience the most refined collaboration platform for modern 
          student teams. Free for individuals, forever.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="btn-primary">Get started for free</button>
          <button className="btn-ghost">Contact sales</button>
        </div>
      </div>
    </section>
  );
};
7. Footer
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
📐 Layout Patterns
Container Pattern
<div className="container mx-auto px-6">
  {/* Content */}
</div>
Section Pattern
<section className="py-24 px-6">
  <div className="container mx-auto">
    {/* Section content */}
  </div>
</section>
Centered Content with Max Width
<div className="max-w-6xl mx-auto">
  {/* Content constrained to 1152px */}
</div>
Responsive Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* Grid items */}
</div>
🎬 Animations
Tailwind Animation Configuration
keyframes: {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "slide-up": {
    "0%": { opacity: "0", transform: "translateY(20px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
},
animation: {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.6s ease-out forwards",
  "slide-up": "slide-up 0.8s ease-out forwards",
}
Usage
<div className="animate-fade-in">Fades in from below</div>
<div className="animate-slide-up">Slides up from below</div>
🎨 Design Tokens Summary
Spacing Scale
Container padding: px-6 (24px)
Section padding: py-24 (96px vertical)
Card padding: p-6 (24px)
Gap between elements: gap-4 (16px), gap-6 (24px), gap-8 (32px)
Border Radius
Default: rounded-2xl (16px)
Buttons: rounded-full
Small elements: rounded-lg (8px), rounded-xl (12px)
Font Sizes
Hero: text-6xl md:text-7xl lg:text-8xl
Section title: text-4xl md:text-5xl lg:text-6xl
Body: text-lg (18px)
Small: text-sm (14px)
Extra small: text-xs (12px)
Transitions
Duration: duration-200, duration-300
Easing: ease-out
Properties: transition-colors, transition-opacity
📦 Package Dependencies
{
  "dependencies": {
    "@radix-ui/react-*": "Latest",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1",
    "@tanstack/react-query": "^5.83.0",
    "lucide-react": "^0.462.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react-swc": "^3.11.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.8.3",
    "vite": "^5.4.19",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6"
  }
}
🚀 Quick Start Guide
1. Setup Tailwind Config
// tailwind.config.ts
import type { Config } from "tailwindcss";
export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        // Copy color configuration from above
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      // Copy animations from above
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
2. Add CSS Variables
/* index.css or globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;
@layer base {
  :root {
    /* Copy all CSS variables from Color System section */
  }
  
  .dark {
    /* Copy dark mode variables */
  }
}
@layer components {
  /* Copy all custom component classes */
}
3. Use Components
Simply copy the component structures from the Component Structures section and adapt them to your needs.

💡 Best Practices
Consistency: Always use the custom classes (.btn-primary, .feature-card, etc.) instead of inline Tailwind classes for common patterns
Spacing: Maintain consistent spacing using the defined scale (gap-4, gap-6, gap-8)
Typography: Use serif fonts for headings, sans-serif for body text
Colors: Stick to the muted color palette; avoid bright, saturated colors except for accents
Borders: Use subtle borders with opacity (border-border/50)
Hover Effects: Keep transitions smooth (200-300ms) and subtle
Responsive: Always consider mobile-first design with responsive breakpoints
🎯 Key Design Principles
Minimalism: Less is more - generous whitespace, clean layouts
Sophistication: Serif typography for elegance, muted colors for professionalism
Clarity: Clear hierarchy, readable text, obvious interactive elements
Consistency: Reusable patterns, consistent spacing, predictable behavior
Performance: Smooth animations, optimized images, fast load times
TIP

This design system works best for professional, academic, or business applications. For more playful or colorful designs, adjust the color palette and typography accordingly.

End of Documentation • Created for the Studious Landing Page Design System