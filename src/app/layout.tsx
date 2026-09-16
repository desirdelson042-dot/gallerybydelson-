import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("*").single();
  return {
    title: data?.site_title || "Portfolio",
    description: data?.site_description || "",
    icons: data?.favicon_url ? [{ url: data.favicon_url }] : undefined,
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <ConfirmProvider>
          {children}
          <Toaster position="top-right" richColors />
        </ConfirmProvider>
      </body>
    </html>
  );
}
