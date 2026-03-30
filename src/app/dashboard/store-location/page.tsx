import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Store Location',
};

export default function StoreLocationPage() {
    return (
        <main>
            <h1 className="text-2xl font-semibold mb-4">Store Location</h1>
            <p className="text-gray-600 mb-6">Manage your store`s locations here.</p>
        </main>
    )
}