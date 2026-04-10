import type { Metadata } from 'next';
import StoreCard from '@/components/store-owner/store-card';

export const metadata: Metadata = {
    title: 'Dashboard',
};

export default function DashboardPage() {
    return (
        <main className="min-h-screen sec-ff px-6 py-10 max-w-6xl mx-auto pb-24">
            <StoreCard />
        </main>
    );
}