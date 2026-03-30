/* not used for now, but will be used in the future when we want to show the list of stores to select from when creating a product or viewing store details
*/

"use client";
import { getStores } from "@/lib/store";
import { useEffect, useState } from "react";
import { Store, MapPin } from "lucide-react";

interface StoreLocation {
    name: string;
    address: string;
}

interface StoreData {
    _id: string;
    store_name: string;
    status: "active" | "inactive";
    locations: StoreLocation[];
    products_count?: number;
}

interface GetStoresProps {
    refreshKey?: number;
    onSelectStore?: (store: StoreData) => void;
}

export default function GetStores({ refreshKey, onSelectStore }: GetStoresProps) {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStores = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getStores();
                setStores(data?.data?.stores || data?.data || []);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch stores.");
            } finally {
                setLoading(false);
            }
        };
        fetchStores();
    }, [refreshKey]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 h-36 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-sm">{error}</p>;
    }

    if (!stores.length) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {stores.map((store) => (
                <div
                    key={store._id}
                    onClick={() => onSelectStore?.(store)}
                    className="rounded-xl border border-gray-200 bg-white p-4 flex flex-col gap-3 cursor-pointer hover:border-(--prof-clr) hover:shadow-sm transition-all"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="font-semibold text-gray-800">{store.store_name}</h3>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <MapPin size={11} />
                                {store.locations?.length ?? 0} location{store.locations?.length !== 1 ? "s" : ""} · {store.status}
                            </p>
                        </div>
                        <Store size={18} className="text-(--prof-clr) mt-0.5" />
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                store.status === "active"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-500"
                            }`}
                        >
                            {store.status === "active" ? "Active" : "Inactive"}
                        </span>
                        {store.products_count !== undefined && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                                {store.products_count} products
                            </span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}