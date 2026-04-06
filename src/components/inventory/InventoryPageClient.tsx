// src/components/inventory/InventoryPageClient.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getStores } from "@/lib/store";
import GetInventory from "./get-inventory";

interface Location {
    id: string;
    name: string;
}

export default function InventoryPageClient({ storeId }: Readonly<{ storeId: string }>) {
    const router = useRouter();
    const [storeName, setStoreName] = useState("");
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStores()
            .then((stores) => {
                const store = stores.find((s) => s.id === storeId);
                if (!store) return;
                setStoreName(store.store_name || store.name || "");
                const locs = (store.locations ?? []).map((l) => ({
                    id: l.id,
                    name: l.name,
                }));
                setLocations(locs);
                if (locs.length > 0) setSelectedLocationId(locs[0].id);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [storeId]);

    const selectedLocation = locations.find((l) => l.id === selectedLocationId);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 size={24} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 mb-20">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Go back"
                >
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-(--pry-clr) sec-ff">Inventory</h1>
                    {storeName && (
                        <p className="text-sm text-(--pry-clr)/60 sec-ff mt-0.5">{storeName}</p>
                    )}
                </div>
            </div>

            {/* Location Selector */}
            {locations.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap">
                    {locations.map((loc) => (
                        <button
                            key={loc.id}
                            onClick={() => setSelectedLocationId(loc.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium sec-ff transition-colors ${
                                selectedLocationId === loc.id
                                    ? "bg-(--pry-clr) text-white"
                                    : "border border-gray-200 text-(--pry-clr) hover:bg-(--pry-clr)/5"
                            }`}
                        >
                            {loc.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Inventory */}
            {selectedLocationId ? (
                <GetInventory
                    locationId={selectedLocationId}
                    locationName={selectedLocation?.name}
                />
            ) : (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center py-16">
                    <p className="text-sm text-(--pry-clr)/50 sec-ff">No locations found for this store.</p>
                </div>
            )}
        </div>
    );
}