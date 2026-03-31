// src/components/store-owner/get-stores.tsx

"use client";
import { getStores, deactivateStore, reactivateStore, deactivateLocation, activateLocation } from "@/lib/store";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Spinner from "../ui/spinner";
import { getProfile } from "@/lib/profile";
import EditStoreNameModal from "./edit-store-name";
import EditLocationModal from "./edit-location";
import AddLocationModal from "./add-location-btn";

interface StoreLocation {
    id: string;
    name: string;
    address: string;
    is_active?: boolean;
}

interface StoreData {
    id: string;
    name: string;
    address: string;
    is_active: boolean;
    locations: StoreLocation[];
}

interface ProfileData {
    name: string;
}

interface GetStoresProps {
    refreshKey?: number;
}

export default function GetStores({ refreshKey }: Readonly<GetStoresProps>) {
    const [stores, setStores] = useState<StoreData[]>([]);
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingStore, setEditingStore] = useState<StoreData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [storesData, profileData] = await Promise.all([getStores(), getProfile()]);
                setStores(Array.isArray(storesData) ? storesData : storesData?.data || []);
                setProfile(profileData?.data ?? profileData);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [refreshKey]);

    const handleStoreEditSuccess = (storeId: string, newName: string) => {
        setStores((prev) =>
            prev.map((s) => (s.id === storeId ? { ...s, name: newName } : s))
        );
    };

    const handleLocationEditSuccess = (storeId: string, locationId: string, updatedFields: { name?: string; address?: string }) => {
        setStores((prev) =>
            prev.map((s) =>
                s.id === storeId
                    ? {
                          ...s,
                          locations: s.locations.map((l) =>
                              l.id === locationId ? { ...l, ...updatedFields } : l
                          ),
                      }
                    : s
            )
        );
    };

    const handleAddLocationSuccess = (storeId: string, newLocations: StoreLocation[]) => {
        setStores((prev) =>
            prev.map((s) =>
                s.id === storeId
                    ? { ...s, locations: [...s.locations, ...newLocations] }
                    : s
            )
        );
    };

    const handleDeactivateStore = async (storeId: string) => {
        try {
            await deactivateStore(storeId);
            setStores((prev) =>
                prev.map((s) => (s.id === storeId ? { ...s, is_active: false } : s))
            );
        } catch (err: unknown) {
            console.error(err instanceof Error ? err.message : "Failed to deactivate store.");
        }
    };

    const handleReactivateStore = async (storeId: string) => {
        try {
            await reactivateStore(storeId);
            setStores((prev) =>
                prev.map((s) => (s.id === storeId ? { ...s, is_active: true } : s))
            );
        } catch (err: unknown) {
            console.error(err instanceof Error ? err.message : "Failed to reactivate store.");
        }
    };

    const handleDeactivateLocation = async (storeId: string, locationId: string) => {
        try {
            await deactivateLocation(locationId);
            setStores((prev) =>
                prev.map((s) =>
                    s.id === storeId
                        ? {
                              ...s,
                              locations: s.locations.map((l) =>
                                  l.id === locationId ? { ...l, is_active: false } : l
                              ),
                          }
                        : s
                )
            );
        } catch (err: unknown) {
            console.error(err instanceof Error ? err.message : "Failed to deactivate location.");
        }
    };

    const handleActivateLocation = async (storeId: string, locationId: string) => {
        try {
            await activateLocation(locationId);
            setStores((prev) =>
                prev.map((s) =>
                    s.id === storeId
                        ? {
                              ...s,
                              locations: s.locations.map((l) =>
                                  l.id === locationId ? { ...l, is_active: true } : l
                              ),
                          }
                        : s
                )
            );
        } catch (err: unknown) {
            console.error(err instanceof Error ? err.message : "Failed to activate location.");
        }
    };

    if (loading) return <div className="flex items-center justify-center py-20"><Spinner /></div>;
    if (error) return <p className="text-red-500 text-sm">{error}</p>;
    if (!stores.length) return <p className="text-gray-400 text-sm">No stores found.</p>;

    return (
        <>
            {editingStore && (
                <EditStoreNameModal
                    store={editingStore}
                    onClose={() => setEditingStore(null)}
                    onSuccess={handleStoreEditSuccess}
                />
            )}
            <div className="flex flex-col gap-6 sec-ff w-max-3xl mb-18">
                {stores.map((store) => (
                    <StoreBlock
                        key={store.id}
                        store={store}
                        ownerName={profile?.name}
                        onEditName={() => setEditingStore(store)}
                        onDeactivate={() => handleDeactivateStore(store.id)}
                        onReactivate={() => handleReactivateStore(store.id)}
                        onLocationEditSuccess={(locationId, updatedFields) =>
                            handleLocationEditSuccess(store.id, locationId, updatedFields)
                        }
                        onAddLocationSuccess={(newLocations) =>
                            handleAddLocationSuccess(store.id, newLocations)
                        }
                        onDeactivateLocation={(locationId) => handleDeactivateLocation(store.id, locationId)}
                        onActivateLocation={(locationId) => handleActivateLocation(store.id, locationId)}
                    />
                ))}
            </div>
        </>
    );
}

function StoreBlock({
    store,
    ownerName,
    onEditName,
    onDeactivate,
    onReactivate,
    onLocationEditSuccess,
    onAddLocationSuccess,
    onDeactivateLocation,
    onActivateLocation,
}: Readonly<{
    store: StoreData;
    ownerName?: string;
    onEditName: () => void;
    onDeactivate: () => Promise<void>;
    onReactivate: () => Promise<void>;
    onLocationEditSuccess: (locationId: string, updatedFields: { name?: string; address?: string }) => void;
    onAddLocationSuccess: (newLocations: StoreLocation[]) => void;
    onDeactivateLocation: (locationId: string) => Promise<void>;
    onActivateLocation: (locationId: string) => Promise<void>;
}>) {
    const [editingLocation, setEditingLocation] = useState<StoreLocation | null>(null);
    const [addingLocation, setAddingLocation] = useState(false);
    const [deactivating, setDeactivating] = useState(false);
    const [reactivating, setReactivating] = useState(false);

    const handleDeactivate = async () => {
        setDeactivating(true);
        try {
            await onDeactivate();
        } finally {
            setDeactivating(false);
        }
    };

    const handleReactivate = async () => {
        setReactivating(true);
        try {
            await onReactivate();
        } finally {
            setReactivating(false);
        }
    };

    return (
        <>
            {editingLocation && (
                <EditLocationModal
                    location={editingLocation}
                    onClose={() => setEditingLocation(null)}
                    onSuccess={(locationId, updatedFields) => {
                        onLocationEditSuccess(locationId, updatedFields);
                        setEditingLocation(null);
                    }}
                />
            )}
            {addingLocation && (
                <AddLocationModal
                    storeId={store.id}
                    onClose={() => setAddingLocation(false)}
                    onSuccess={(newLocations) => {
                        onAddLocationSuccess(newLocations);
                        setAddingLocation(false);
                    }}
                />
            )}
            <div className="border border-gray-200 rounded-xl bg-white p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-800">{store.name}</h2>
                        <p className="text-xs text-gray-400 mt-0.5">Owner: {ownerName ?? "—"}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={onEditName}
                            className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Edit Name
                        </button>
                        {store.is_active ? (
                            <button
                                onClick={handleDeactivate}
                                disabled={deactivating}
                                className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {deactivating ? "Deactivating..." : "Deactivate Store"}
                            </button>
                        ) : (
                            <button
                                onClick={handleReactivate}
                                disabled={reactivating}
                                className="text-sm border border-gray-200 rounded-md px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                            >
                                {reactivating ? "Reactivating..." : "Reactivate Store"}
                            </button>
                        )}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Locations</p>
                    <div className="flex flex-col gap-2">
                        {store.locations.map((loc) => (
                            <LocationRow
                                key={loc.id}
                                location={loc}
                                onEdit={() => setEditingLocation(loc)}
                                onDeactivate={() => onDeactivateLocation(loc.id)}
                                onActivate={() => onActivateLocation(loc.id)}
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setAddingLocation(true)}
                    className="mt-4 flex items-center gap-1.5 text-sm font-medium bg-(--prof-clr) text-(--txt-clr) px-4 py-2 rounded-md hover:bg-(--acc-clr)/80 transition-colors cursor-pointer"
                >
                    <Plus size={14} />
                    Add another location
                </button>
            </div>
        </>
    );
}

function LocationRow({
    location,
    onEdit,
    onDeactivate,
    onActivate,
}: Readonly<{
    location: StoreLocation;
    onEdit: () => void;
    onDeactivate: () => Promise<void>;
    onActivate: () => Promise<void>;
}>) {
    const active = location.is_active !== false;
    const [toggling, setToggling] = useState(false);

    const handleToggle = async () => {
        setToggling(true);
        try {
            active ? await onDeactivate() : await onActivate();
        } finally {
            setToggling(false);
        }
    };

    return (
        <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg">
            <div>
                <p className="text-sm text-gray-800 font-semibold">{location.name}</p>
                <p className="text-xs text-gray-400">{location.address}</p>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                    {active ? "Active" : "Inactive"}
                </span>
                <button
                    onClick={onEdit}
                    className="text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    Edit
                </button>
                <button
                    onClick={handleToggle}
                    disabled={toggling}
                    className="text-xs border border-gray-200 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {toggling ? "..." : active ? "Deactivate" : "Reactivate"}
                </button>
            </div>
        </div>
    );
}