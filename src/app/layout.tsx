import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studious - College Collaboration Platform",
  description: "Connect, collaborate, and share with your classmates. A modern platform for college students combining classroom management with real-time messaging.",
  keywords: ["college", "collaboration", "classroom", "messaging", "students", "study groups"],
  authors: [{ name: "Mayank" }],
  metadataBase: new URL('https://studiousplus.vercel.app'),
  openGraph: {
    title: "Studious - College Collaboration Platform",
    description: "Connect. Collaborate. Learn. A modern platform for college students.",
    type: "website",
    siteName: "Studious",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Studious - Connect. Collaborate. Learn.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Studious - College Collaboration Platform",
    description: "Connect. Collaborate. Learn.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
