import type { Metadata } from 'next';
import Link from 'next/link';
import { Hospital } from 'lucide-react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import AppFooter from '@/components/layout/AppFooter';

export const metadata: Metadata = {
  title: 'MediSpeak',
  description: 'Multilingual medical consultations',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <div className="flex-grow">
            {children}
          </div>
          <AppFooter />
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
