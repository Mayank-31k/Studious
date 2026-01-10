import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F1210]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0F1210]/90 backdrop-blur-md border-b-4 border-[#2E3830]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="
                w-10 h-10 flex items-center justify-center
                bg-[#2D5A27] border-4 border-[#1E3D1A]
                shadow-[inset_-2px_-2px_0_#1E3D1A,inset_2px_2px_0_#4A8C3F]
              ">
                <span className="font-pixel text-[#E8B923] text-xs">S</span>
              </div>
              <span className="font-pixel text-sm text-[#E8F5E9] hidden sm:block">STUDIOUS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-grid">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#4A8C3F]/20 blur-3xl animate-float" />
          <div className="absolute top-40 right-20 w-40 h-40 bg-[#E8B923]/15 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-20 left-1/3 w-48 h-48 bg-[#2D5A27]/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Main Heading */}
          <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-[#E8F5E9] mb-6 leading-relaxed">
            STUDY <span className="text-[#E8B923]">TOGETHER</span>
            <br />
            <span className="text-[#4A8C3F]">ACHIEVE</span> MORE
          </h1>

          <p className="text-lg sm:text-xl text-[#B8C9BA] max-w-2xl mx-auto mb-10">
            The ultimate collaboration platform for college students. Create study groups, share resources,
            and chat in real-time with your classmates.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="text-base px-8">
                Start Free Today
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-base px-8">
                See Features
              </Button>
            </Link>
          </div>

          {/* Preview Card */}
          <div className="
            relative max-w-4xl mx-auto
            bg-[#1A1F1C] border-4 border-[#4A8C3F]
            shadow-[0_0_60px_rgba(74,140,63,0.3),inset_-4px_-4px_0_#1E3D1A,inset_4px_4px_0_#4A8C3F]
            p-1
          ">
            <div className="bg-[#0F1210] p-4">
              {/* Fake Browser Bar */}
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#2E3830]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-[#EF5350] rounded-full" />
                  <div className="w-3 h-3 bg-[#E8B923] rounded-full" />
                  <div className="w-3 h-3 bg-[#4CAF50] rounded-full" />
                </div>
                <div className="flex-1 ml-4 h-6 bg-[#1A1F1C] rounded border border-[#2E3830] flex items-center px-3">
                  <span className="text-xs text-[#8BA889]">studious.app/dashboard</span>
                </div>
              </div>
              {/* Preview Content */}
              <div className="grid grid-cols-4 gap-4 min-h-[200px]">
                {/* Sidebar */}
                <div className="col-span-1 bg-[#1A1F1C] border-2 border-[#2E3830] p-3 space-y-2">
                  <div className="h-3 w-16 bg-[#4A8C3F] rounded" />
                  <div className="space-y-2 mt-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#2D5A27] border-2 border-[#1E3D1A]" />
                        <div className="flex-1">
                          <div className="h-2 w-full bg-[#2E3830] rounded" />
                          <div className="h-2 w-2/3 bg-[#2E3830] rounded mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Chat Area */}
                <div className="col-span-3 bg-[#1A1F1C] border-2 border-[#2E3830] p-3 flex flex-col">
                  <div className="flex-1 space-y-3">
                    {/* Message bubbles */}
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-[#E8B923] border-2 border-[#C49A1A]" />
                      <div className="bg-[#232A26] p-2 rounded max-w-[60%]">
                        <div className="h-2 w-32 bg-[#8BA889] rounded" />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="bg-[#2D5A27] p-2 rounded max-w-[60%]">
                        <div className="h-2 w-24 bg-[#4A8C3F] rounded" />
                      </div>
                      <div className="w-6 h-6 bg-[#4A8C3F] border-2 border-[#2D5A27]" />
                    </div>
                  </div>
                  {/* Input */}
                  <div className="h-10 bg-[#232A26] border-2 border-[#2E3830] mt-3 flex items-center px-3">
                    <div className="h-2 w-24 bg-[#8BA889] rounded opacity-50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-[#0A0D0B]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-pixel text-xl sm:text-2xl text-[#E8F5E9] mb-4">FEATURES</h2>
            <p className="text-[#B8C9BA] max-w-xl mx-auto">
              Everything you need to collaborate effectively with your study groups
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="
              p-6 bg-[#1A1F1C] border-4 border-[#2E3830]
              hover:border-[#4A8C3F] hover:shadow-[0_0_30px_rgba(74,140,63,0.2)]
              transition-all duration-300 group
            ">
              <div className="
                w-14 h-14 mb-6 flex items-center justify-center
                bg-[#2D5A27] border-4 border-[#1E3D1A]
                shadow-[inset_-2px_-2px_0_#1E3D1A,inset_2px_2px_0_#4A8C3F]
                group-hover:shadow-[0_0_20px_rgba(74,140,63,0.4)]
                transition-all duration-300
              ">
                <svg className="w-6 h-6 text-[#E8B923]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-pixel text-xs text-[#E8F5E9] mb-3">REAL-TIME CHAT</h3>
              <p className="text-sm text-[#8BA889]">
                Instant messaging with your study groups. Share ideas, ask questions, and collaborate in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="
              p-6 bg-[#1A1F1C] border-4 border-[#2E3830]
              hover:border-[#E8B923] hover:shadow-[0_0_30px_rgba(232,185,35,0.2)]
              transition-all duration-300 group
            ">
              <div className="
                w-14 h-14 mb-6 flex items-center justify-center
                bg-[#E8B923] border-4 border-[#C49A1A]
                shadow-[inset_-2px_-2px_0_#C49A1A,inset_2px_2px_0_#FFD54F]
                group-hover:shadow-[0_0_20px_rgba(232,185,35,0.4)]
                transition-all duration-300
              ">
                <svg className="w-6 h-6 text-[#0F1210]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-pixel text-xs text-[#E8F5E9] mb-3">FILE SHARING</h3>
              <p className="text-sm text-[#8BA889]">
                Upload and share documents, images, and videos. Access all your study materials in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="
              p-6 bg-[#1A1F1C] border-4 border-[#2E3830]
              hover:border-[#4A8C3F] hover:shadow-[0_0_30px_rgba(74,140,63,0.2)]
              transition-all duration-300 group
            ">
              <div className="
                w-14 h-14 mb-6 flex items-center justify-center
                bg-[#2D5A27] border-4 border-[#1E3D1A]
                shadow-[inset_-2px_-2px_0_#1E3D1A,inset_2px_2px_0_#4A8C3F]
                group-hover:shadow-[0_0_20px_rgba(74,140,63,0.4)]
                transition-all duration-300
              ">
                <svg className="w-6 h-6 text-[#E8B923]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-pixel text-xs text-[#E8F5E9] mb-3">GROUP MANAGEMENT</h3>
              <p className="text-sm text-[#8BA889]">
                Create unlimited study groups. Invite classmates with a simple link or code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-[#0F1210] bg-grid">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-pixel text-xl sm:text-2xl text-[#E8F5E9] mb-6">
            READY TO <span className="text-[#4A8C3F]">LEVEL UP</span>?
          </h2>
          <p className="text-[#B8C9BA] mb-10 text-lg">
            Join thousands of students already collaborating on Studious.
            Start for free and upgrade anytime.
          </p>
          <Link href="/signup">
            <Button variant="secondary" size="lg" className="text-base px-10 animate-pulse-glow">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-[#0A0D0B] border-t-4 border-[#2E3830]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="
                w-8 h-8 flex items-center justify-center
                bg-[#2D5A27] border-3 border-[#1E3D1A]
              ">
                <span className="font-pixel text-[#E8B923] text-xs">S</span>
              </div>
              <span className="font-pixel text-xs text-[#E8F5E9]">STUDIOUS</span>
            </div>
            <p className="text-sm text-[#8BA889]">
              © 2026 Studious. Built for students, by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
