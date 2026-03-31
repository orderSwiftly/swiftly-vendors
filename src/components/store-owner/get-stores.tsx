// src/components/store-owner/get-stores.tsx

"use client";
import { getStores } from "@/lib/store";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
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
}

interface GetStoresProps {
    refreshKey?: number;
}

export default function GetStores({ refreshKey }: Readonly<GetStoresProps>) {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Spinner />
            </div>
        );
    }

    if (error) return <p className="text-red-500 text-sm">{error}</p>;
    if (!stores.length) return <p className="text-gray-400 text-sm">No stores found.</p>;

    return (
        <div className="flex flex-col gap-6 sec-ff w-max-3xl mb-18">
            {stores.map((store) => (
                <StoreBlock key={store.id} store={store} />
            ))}
        </div>
    );
}

function StoreBlock({ store }: Readonly<{ store: StoreData }>) {
    return (
        <div className="border border-gray-200 rounded-xl bg-white p-6">
            {/* Store header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-gray-800">{store.name}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">Owner: —</p>
                </div>
                <div className="flex gap-2">
                    <button className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors">
                        Edit Name
                    </button>
                    <button
                        className={`text-sm rounded-md px-3 py-1.5 transition-colors ${
                            store.is_active
                                ? "border border-gray-200 text-gray-600 hover:bg-gray-50"
                                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        {store.is_active ? "Deactivate Store" : "Reactivate Store"}
                    </button>
                </div>
            </div>

            {/* Locations */}
            <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Locations</p>
                <div className="flex flex-col gap-2">
                    {store.locations.map((loc, i) => (
                        <LocationRow key={i} location={loc} />
                    ))}
                </div>
            </div>

            {/* Add location */}
            <button className="mt-4 flex items-center gap-1.5 text-sm font-medium bg-(--prof-clr) text-(--txt-clr) px-4 py-2 rounded-md hover:bg-(--acc-clr)/80 transition-colors cursor-pointer">
                <Plus size={14} />
                Add another location
            </button>
        </div>
    );
}

function LocationRow({ location }: Readonly<{ location: { name: string; address: string; is_active?: boolean } }>) {
    const active = location.is_active !== false;

    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <div>
                <p className="text-sm font-medium text-gray-800">{location.name}</p>
                <p className="text-xs text-gray-400">{location.address}</p>
            </div>
            <div className="flex items-center gap-2">
                <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"
                    }`}
                >
                    {active ? "Active" : "Inactive"}
                </span>
                <button className="text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors">
                    Edit
                </button>
                <button className="text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors">
                    {active ? "Deactivate" : "Reactivate"}
                </button>
            </div>
        </div>
    );
}