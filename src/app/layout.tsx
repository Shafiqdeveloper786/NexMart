import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Navbar, Footer } from "@/components/shared";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
import { AgentEmbedScript } from "@/components/AgentEmbedScript";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexMart - E-commerce Platform",
  description: "Next-generation e-commerce platform built with Next.js and TypeScript",
  keywords: ["e-commerce", "nexmart", "shopping", "online store"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground max-w-full overflow-x-clip">
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />


            <AgentEmbedScript 
              agentId="6a0b00817ebbad0f8788150c" // <-- Yahan apni asli Agent ID paste kar dena
              accentColor="#00f2ff"          // NexMart ka cyan neon look
            />
            
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
