// src/components/inventory/InventoryOverviewClient.tsx

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getStores, type Store, type StoreLocation } from "@/lib/store";
import { fetchInventoryByLocation } from "@/lib/inventory";
import { Loader2 } from "lucide-react";

export default function InventoryOverviewClient() {
    const router = useRouter();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inventoryCounts, setInventoryCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        let mounted = true;

        (async () => {
            try {
                setLoading(true);
                const list = await getStores();
                if (!mounted) return;
                setStores(list);

                const counts: Record<string, number> = {};
                for (const store of list) {
                    for (const location of store.locations ?? []) {
                        try {
                            const data = await fetchInventoryByLocation(location.id);
                            counts[location.id] = data.total;
                        } catch {
                            counts[location.id] = 0;
                        }
                    }
                }
                if (mounted) setInventoryCounts(counts);
            } catch (err) {
                if (mounted) setError(err instanceof Error ? err.message : "Failed to load stores.");
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => { mounted = false; };
    }, []);

    return (
        <main className="p-6 max-w-6xl mx-auto pry-ff">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">View Your Inventory</h1>
                <p className="text-sm text-gray-600 mt-2">Select a store to view your inventory</p>
            </div>

            {loading ? (
                <div className="py-10 flex items-center justify-center w-full">
                  <Loader2 className="animate-spin" />
                </div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : stores.length === 0 ? (
                <div className="py-10 text-gray-500">No stores found</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {stores.map((store) => {
                        const totalInventoryCount = (store.locations ?? []).reduce(
                            (sum, location: StoreLocation) => sum + (inventoryCounts[location.id] ?? 0),
                            0
                        );

                        return (
                            <button
                                key={store.id}
                                onClick={() => router.push(`/dashboard/inventory/${store.id}`)}
                                className="p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow text-left cursor-pointer"
                            >
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {store.store_name || store.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {(store.locations ?? []).length} location{(store.locations ?? []).length !== 1 ? "s" : ""} ·{" "}
                                    <span style={{ color: store.is_active ? "var(--prof-clr)" : "#991B1B" }}>
                                        {store.is_active ? "active" : "inactive"}
                                    </span>
                                </p>
                                <div className="mt-3 flex gap-2">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{
                                            backgroundColor: store.is_active ? "#D8FF9C" : "#FFEFC3",
                                            color: store.is_active ? "#166534" : "#991B1B",
                                        }}
                                    >
                                        {store.is_active ? "Active" : "Inactive"}
                                    </span>
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                        style={{ backgroundColor: "#FDEDC3", color: "#8A6500" }}
                                    >
                                        {totalInventoryCount} item{totalInventoryCount !== 1 ? "s" : ""}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </main>
    );
}