import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/contexts/ToastContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-pixel",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Studious - College Collaboration Platform",
  description: "Connect, collaborate, and share with your classmates. A modern platform for college students combining classroom management with real-time messaging.",
  keywords: ["college", "collaboration", "classroom", "messaging", "students", "study groups"],
  authors: [{ name: "Studious Team" }],
  openGraph: {
    title: "Studious - College Collaboration Platform",
    description: "Connect, collaborate, and share with your classmates.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${pressStart2P.variable} antialiased bg-[#0F1210] text-[#E8F5E9]`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
