// src/app/cashier/dashboard/layout.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import { useRoleGuard } from '@/lib/use-role-guard';
import Sidebar from '@/components/cashier/cashier-sidebar';
import SidebarNav from '@/components/cashier/sidebar-nav';

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
            <Sidebar />
            <main
                className="flex-1 bg-white transition-all duration-300"
                style={{ marginLeft: isDesktop ? (collapsed ? '5rem' : '16rem') : '0' }}
            >
                <SidebarNav />
                {children}
            </main>
        </div>
    );
}

export default function DashboardLayout({ children }: Readonly<{ children: ReactNode }>) {
    useRoleGuard(['cashier']);

    return (
        <SidebarProvider>
            <DashboardShell>{children}</DashboardShell>
        </SidebarProvider>
    );
}