import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { Toaster } from "sonner";


export const metadata: Metadata = {
    title: {
        template: '%s | Swiftly Vendors',
        default: 'Swiftly Vendors',
    },
    description: 'Efficient inventory management system.',
    manifest: '/manifest.json',
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black',
      title: 'Swiftly Vendors',
    },
    icons: {
      apple: '/icon-192x192.png',
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Swiftly Vendors" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ServiceWorkerRegistration />
        <PWAInstallBanner />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
