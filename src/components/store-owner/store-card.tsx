// src/components/store-owner/store-card.tsx

"use client";
import { useEffect, useState } from "react";
import { Store, Plus } from "lucide-react";
import { getStores } from "@/lib/store";
import CreateStoreBtn from "../create-store-btn";
import Spinner from "../ui/spinner";

interface StoreLocation {
    name: string;
    address: string;
}

interface StoreData {
    id: string;
    name: string;
    is_active: boolean;
    locations: StoreLocation[];
    products_count?: number;
}

export default function StoreCard() {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refresh = () => setRefreshKey((k) => k + 1);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getStores();
                setStores(Array.isArray(data) ? data : data?.data || []);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch stores.");
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, [refreshKey]);

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Your stores</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Select a store to manage or create a new one
                    </p>
                </div>
                {stores.length > 0 && (
                    <CreateStoreBtn label="Create Store" onStoreCreated={refresh} />
                )}
            </div>

            {/* States */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-sm">{error}</p>
            ) : stores.length === 0 ? (
                <EmptyState onStoreCreated={refresh} />
            ) : (
                <StoreGrid stores={stores} onStoreCreated={refresh} />
            )}
        </div>
    );
}

function EmptyState({ onStoreCreated }: { onStoreCreated: () => void }) {
    return (
        <div className="flex items-center justify-center py-10">
            <div className="rounded-xl border border-gray-200 bg-white p-10 flex flex-col items-center gap-4 w-full max-w-sm text-center">
                <div className="w-12 h-12 rounded-lg bg-(--prof-clr) flex items-center justify-center">
                    <Store size={22} className="text-white" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">No stores yet</h3>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                        Create your first store to get started. A store can have multiple
                        locations — like different hostel branches or kiosks.
                    </p>
                </div>
                <CreateStoreBtn label="Create Your First Store" onStoreCreated={onStoreCreated} />
                <p className="text-xs text-gray-400">
                    You can add more stores anytime from this screen.
                </p>
            </div>
        </div>
    );
}

function StoreGrid({
    stores,
    onStoreCreated,
}: {
    stores: StoreData[];
    onStoreCreated: () => void;
}) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stores.map((store) => (
                    <StoreItem key={store.id} store={store} />
                ))}

                {/* Create store tile */}
                <div
                    onClick={() => setShowModal(true)}
                    className="rounded-xl border-2 border-dashed border-gray-200 bg-(--txt-clr) flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-(--prof-clr) hover:bg-(--prof-clr)/5 transition-all min-h-[100px]"
                >
                    <Plus size={24} className="text-(--pry-clr)" />
                    <span className="text-sm text-(--pry-clr)">Create store</span>
                </div>
            </div>

            {showModal && (
                <CreateStoreBtn
                    label=""
                    _forceOpen
                    onStoreCreated={() => { setShowModal(false); onStoreCreated(); }}
                    _onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}

function StoreItem({ store }: { store: StoreData }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 cursor-pointer hover:border-(--prof-clr) hover:shadow-sm transition-all">
            <div>
                <h3 className="font-semibold text-gray-800">{store.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                    {store.locations?.length ?? 0} location{store.locations?.length !== 1 ? "s" : ""}
                </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
                <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        store.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-500"
                    }`}
                >
                    {store.is_active ? "Active" : "Inactive"}
                </span>
                {store.products_count !== undefined && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                        {store.products_count} products
                    </span>
                )}
            </div>
        </div>
    );
}