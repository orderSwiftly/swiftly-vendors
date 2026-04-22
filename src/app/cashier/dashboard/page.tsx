// src/app/cashier/dashboard/page.tsx

import type { Metadata } from 'next';
import ProcessSale from '@/components/process-sales/dashboard';

export const metadata: Metadata = {
    title: 'Process Sale',
};

export default function DashboardPage() {
    return (
        <main className="min-h-screen sec-ff px-6 py-10 max-w-6xl mx-auto pb-24">
            <ProcessSale />
        </main>
    );
}