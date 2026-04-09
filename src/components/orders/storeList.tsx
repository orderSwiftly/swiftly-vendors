"use client";

import { useEffect, useState } from "react";
import { Store as StoreIcon } from "lucide-react";
import { getStores, Store } from "@/lib/store";
import Spinner from "../ui/spinner";
import { toast } from "sonner";

// helpers

const AVATAR_PALETTE = [
    "bg-blue-50 text-blue-800",
    "bg-green-50 text-green-800",
    "bg-purple-50 text-purple-800",
    "bg-orange-50 text-orange-800",
    "bg-teal-50 text-teal-800",
];

function getInitials(name: string) {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// store card 

function StoreCard({
    store,
    colorClass,
    onSelect,
}: {
    store: Store;
    colorClass: string;
    onSelect: () => void;
}) {
    const displayName = store.store_name ?? store.name;
    const activeLocations = store.locations.filter(l => l.is_active).length;
    const totalLocations = store.locations.length;

    return (
        <button
            onClick={onSelect}
            className="w-full text-left bg-(--txt-clr) border border-gray-200 rounded-xl overflow-hidden hover:border-(--prof-clr) hover:shadow-sm transition-all cursor-pointer sec-ff"
        >
            {store.image_url ? (
                <img
                    src={store.image_url}
                    alt={displayName}
                    className="w-full h-36 object-cover"
                />
            ) : (
                <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
                    <StoreIcon size={32} className="text-gray-300" />
                </div>
            )}

            <div className="p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${colorClass}`}>
                        {getInitials(displayName)}
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        store.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-500"
                    }`}>
                        {store.is_active ? "Active" : "Inactive"}
                    </span>
                </div>

                <div>
                    <h3 className="font-semibold text-gray-800 truncate">{displayName}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                        {totalLocations === 0
                            ? "No locations"
                            : `${activeLocations} of ${totalLocations} location${totalLocations !== 1 ? "s" : ""} active`
                        }
                    </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">View orders</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-gray-300">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </button>
    );
}

// component

interface StoreListProps {
    onSelectStore: (store: Store, colorClass: string) => void;
}

export default function StoreList({ onSelectStore }: StoreListProps) {
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await getStores();
                setStores(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch stores.");
                toast.error(err instanceof Error ? err.message : "Failed to fetch stores.");
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, []);

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-6 pry-ff">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        Select a store to view its orders
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Spinner />
                </div>
            ) : error ? (
                <p className="text-red-500 text-sm pry-ff">{error}</p>
            ) : stores.length === 0 ? (
                <div className="flex items-center justify-center py-10">
                    <div className="rounded-xl border border-gray-200 bg-white p-10 flex flex-col items-center gap-3 w-full max-w-sm text-center">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <StoreIcon size={22} className="text-gray-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800">No stores found</h3>
                            <p className="text-sm text-gray-400 mt-1">
                                You don&apos;t have any stores yet.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map((store, idx) => {
                        const colorClass = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                        return (
                            <StoreCard
                                key={store.id}
                                store={store}
                                colorClass={colorClass}
                                onSelect={() => onSelectStore(store, colorClass)}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}