// src/app/(buyer)/dashboard/layout.tsx

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import Sidebar from '@/components/store-owner/sidebar';
import SidebarNav from '@/components/store-owner/sidebar-nav';
import { Toaster } from 'sonner';

function DashboardShell({ children }: Readonly<{ children: ReactNode }>) {
    const { collapsed } = useSidebar();
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const check = () => setIsDesktop(window.innerWidth >= 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    return (
        <div className="flex min-h-screen">
            <Toaster position="top-right" />
            <Sidebar />

            <main
                className="flex-1 bg-white transition-all duration-300"
                style={{
                    marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0',
                }}
            >
                <SidebarNav />
                {children}

            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
    );
}
