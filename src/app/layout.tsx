import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, Navbar, Footer } from "@/components/shared";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "sonner";
import { AgentEmbedScript } from "@/components/AgentEmbedScript";
import { QuickViewModal } from "@/components/product/QuickViewModal";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased overflow-x-hidden`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground max-w-full overflow-x-clip">
        <SessionProvider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <QuickViewModal />
            <Toaster position="bottom-right" richColors closeButton />


            <AgentEmbedScript 
              agentId="6a23f0b461c45b8320031056" // <-- Yahan apni asli Agent ID paste kar dena
              accentColor="#00f2ff"          // NexMart ka cyan neon look
            />
            
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

