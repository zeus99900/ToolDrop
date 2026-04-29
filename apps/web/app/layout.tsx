import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import PostHogPageView from '@/components/providers/PostHogPageView';
import AuthProvider from '@/components/providers/AuthProvider';
import GoogleMapsProvider from '@/components/providers/GoogleMapsProvider';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'ToolDrop — Halifax & Dartmouth Tool Rental Marketplace',
    template: '%s | ToolDrop',
  },
  description:
    'Rent professional-grade power tools, garden equipment, and more in Halifax & Dartmouth. Official ToolDrop rentals delivered to your door or ready for pickup same day.',
  keywords: ['tool rental Halifax', 'rent tools Dartmouth', 'power tools Halifax', 'equipment rental Nova Scotia', 'ToolDrop'],
  authors: [{ name: 'ToolDrop' }],
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    siteName: 'ToolDrop',
    title: 'ToolDrop — Halifax & Dartmouth Tool Rental Marketplace',
    description: 'Premier tool rental marketplace in Halifax. Rent or list tools in your neighbourhood with Official ToolDrop support.',
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          <GoogleMapsProvider>
            <AuthProvider>
              <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
              {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: '12px',
                  fontSize: '14px',
                },
              }}
            />
          </AuthProvider>
        </GoogleMapsProvider>
      </PostHogProvider>
    </body>
    </html>
  );
}
