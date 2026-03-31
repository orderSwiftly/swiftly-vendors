// src/app/dashboard/store-location/page.tsx

import type { Metadata } from 'next';
import GetStores from '@/components/store-owner/get-stores';

export const metadata: Metadata = {
    title: 'Store & Location Management',
};

export default function StoreLocationPage() {
    return (
        <main className="p-6 max-w-4xl">
            <h1 className="text-2xl font-semibold text-gray-800 pry-ff">Store & Location management</h1>
            <p className="text-sm text-(--sec-clr) mt-1 mb-6 sec-ff">Manage all stores and locations</p>
            <GetStores />
        </main>
    );
}