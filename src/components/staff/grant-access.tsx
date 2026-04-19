// src/components/staff/grant-access.tsx

"use client";

import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, Check, Lock } from "lucide-react";
import { toast } from "sonner";
import { grantAccess, type GrantAccessBody } from "@/lib/access";
import { getRoles, type Role } from "@/lib/role";
import { getStores, type Store } from "@/lib/store";

type AccessLevel = "organization" | "MultipleStores" | "store";

interface GrantAccessProps {
    staffId: string;
    onGranted?: () => void;
}

export default function GrantAccess({ staffId, onGranted }: Readonly<GrantAccessProps>) {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [stores, setStores] = useState<Store[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [level, setLevel] = useState<AccessLevel>("organization");
    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);
    const [lockToLocation, setLockToLocation] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState("");
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [expandedRoleId, setExpandedRoleId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [storeData, roleData] = await Promise.all([getStores(), getRoles()]);
                setStores(storeData);
                setRoles(roleData);
            } catch {
                toast.error("Failed to load stores or roles.");
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);

    const selectedStore = stores.find((s) => s.id === selectedStoreId) ?? null;

    const handleLevelChange = (l: AccessLevel) => {
        setLevel(l);
        setSelectedStoreId("");
        setSelectedStoreIds([]);
        setSelectedLocationId("");
        setLockToLocation(false);
    };

    const handleStoreSelect = (storeId: string) => {
        setSelectedStoreId(storeId);
        setSelectedLocationId("");
        setLockToLocation(false);
    };

    const toggleMultipleStore = (storeId: string) => {
        setSelectedStoreIds((prev) =>
            prev.includes(storeId)
                ? prev.filter((id) => id !== storeId)
                : [...prev, storeId]
        );
    };

const handleSubmit = async () => {
    console.log("selectedRoleId:", selectedRoleId);
    console.log("level:", level);
    console.log("selectedStoreId:", selectedStoreId);
    console.log("selectedLocationId:", selectedLocationId);
    console.log("lockToLocation:", lockToLocation);

    if (!selectedRoleId) return toast.error("Please select a role.");

    if (level === "MultipleStores") {
        if (selectedStoreIds.length === 0) return toast.error("Please select at least one store.");
        setLoading(true);
        try {
            await grantAccess(staffId, {
                role_id: selectedRoleId,
                access: {
                    type: "specific_stores",
                    store_ids: selectedStoreIds,
                }
            });
            toast.success("Access granted.");
            onGranted?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to grant access.");
        } finally {
            setLoading(false);
        }
        return;
    }

    if (level === "store" && !selectedStoreId) return toast.error("Please select a store.");
    if (level === "store" && lockToLocation && !selectedLocationId)
        return toast.error("Please select a location to lock to.");

    let body: GrantAccessBody;

    if (level === "organization") {
        body = {
            role_id: selectedRoleId,
            access: { type: "all_stores" }
        };
    } else if (lockToLocation && selectedLocationId) {
        body = {
            role_id: selectedRoleId,
            access: {
                type: "one_store",
                store_id: selectedStoreId,
                locations: {
                    locked: true,
                    location_ids: [selectedLocationId],
                }
            }
        };
    } else {
        body = {
            role_id: selectedRoleId,
            access: {
                type: "one_store",
                store_id: selectedStoreId,
                locations: { locked: false }
            }
        };
    }

    setLoading(true);
    try {
        await grantAccess(staffId, body);
        toast.success("Access granted.");
        onGranted?.();
    } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to grant access.");
    } finally {
        setLoading(false);
    }
};

    if (fetching) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 size={20} className="animate-spin text-(--pry-clr)" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold text-(--pry-clr)/40 sec-ff uppercase tracking-wide">
                Access
            </p>

            {/* Store access */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-(--pry-clr)/60 sec-ff mb-1">Store access</p>

                {/* Option 1 — All stores */}
                <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-colors ${
                    level === "organization"
                        ? "border-(--bg-clr) bg-(--bg-clr)/5"
                        : "border-gray-200 hover:border-gray-300"
                }`}>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        level === "organization" ? "border-(--bg-clr)" : "border-gray-300"
                    }`}>
                        {level === "organization" && <div className="w-2 h-2 rounded-full bg-(--bg-clr)" />}
                    </div>
                    <input type="radio" className="hidden" checked={level === "organization"} onChange={() => handleLevelChange("organization")} />
                    <span className="text-sm font-medium text-(--pry-clr) sec-ff">All stores</span>
                </label>

                {/* Option 2 — Multiple specific stores
                <div className={`rounded-xl border overflow-hidden transition-colors ${
                    level === "MultipleStores" ? "border-(--bg-clr) bg-(--bg-clr)/5" : "border-gray-200"
                }`}>
                    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            level === "MultipleStores" ? "border-(--bg-clr)" : "border-gray-300"
                        }`}>
                            {level === "MultipleStores" && <div className="w-2 h-2 rounded-full bg-(--bg-clr)" />}
                        </div>
                        <input type="radio" className="hidden" checked={level === "MultipleStores"} onChange={() => handleLevelChange("MultipleStores")} />
                        <span className="text-sm font-medium text-(--pry-clr) sec-ff">Multiple specific stores</span>
                    </label>

                    {level === "MultipleStores" && (
                        <div className="px-4 pb-4 pt-3 border-t border-(--bg-clr)/10 flex flex-wrap gap-2">
                            {stores.map((store) => {
                                const selected = selectedStoreIds.includes(store.id);
                                return (
                                    <button
                                        key={store.id}
                                        onClick={() => toggleMultipleStore(store.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold sec-ff transition-colors flex items-center gap-1.5 ${
                                            selected
                                                ? "bg-(--bg-clr) text-white"
                                                : "bg-white border border-gray-200 text-(--pry-clr)/60 hover:border-(--bg-clr)/30"
                                        }`}
                                    >
                                        {selected && <Check size={11} />}
                                        {store.name}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div> */}

                {/* Option 3 — One store */}
                <div className={`rounded-xl border overflow-hidden transition-colors ${
                    level === "store" ? "border-(--bg-clr) bg-(--bg-clr)/5" : "border-gray-200"
                }`}>
                    <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            level === "store" ? "border-(--bg-clr)" : "border-gray-300"
                        }`}>
                            {level === "store" && <div className="w-2 h-2 rounded-full bg-(--bg-clr)" />}
                        </div>
                        <input type="radio" className="hidden" checked={level === "store"} onChange={() => handleLevelChange("store")} />
                        <span className="text-sm font-medium text-(--pry-clr) sec-ff">One store</span>
                    </label>

                    {level === "store" && (
                        <div className="px-4 pb-4 flex flex-col gap-4 border-t border-(--bg-clr)/10 pt-3">
                            {/* Store chips */}
                            <div className="flex flex-wrap gap-2">
                                {stores.map((store) => (
                                    <button
                                        key={store.id}
                                        onClick={() => handleStoreSelect(store.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold sec-ff transition-colors ${
                                            selectedStoreId === store.id
                                                ? "bg-(--bg-clr) text-white"
                                                : "bg-white border border-gray-200 text-(--pry-clr)/60 hover:border-(--bg-clr)/30"
                                        }`}
                                    >
                                        {store.name}
                                    </button>
                                ))}
                            </div>

                            {/* Location restriction */}
                            {selectedStoreId && selectedStore && (
                                <div className="flex flex-col gap-3 pt-3 border-t border-(--bg-clr)/10">
                                    <p className="text-xs text-(--pry-clr)/50 sec-ff">
                                        Location restriction within {selectedStore.name}
                                    </p>

                                    {/* Lock toggle */}
                                    <label className="flex items-center gap-2 cursor-pointer w-fit">
                                        <div
                                            onClick={() => {
                                                setLockToLocation(!lockToLocation);
                                                setSelectedLocationId("");
                                            }}
                                            className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                                                lockToLocation
                                                    ? "bg-(--bg-clr) border-(--bg-clr)"
                                                    : "border-gray-300 bg-white"
                                            }`}
                                        >
                                            {lockToLocation && <Check size={10} className="text-white" />}
                                        </div>
                                        <Lock size={12} className="text-(--pry-clr)/50" />
                                        <span className="text-xs font-medium text-(--pry-clr)/70 sec-ff">
                                            Lock to specific locations
                                        </span>
                                    </label>

                                    {/* Locations — always shown, selectable only when locked */}
                                    <div className="flex flex-wrap gap-2">
                                        {selectedStore.locations.map((loc) => (
                                            <button
                                                key={loc.id}
                                                onClick={() => {
                                                    if (!lockToLocation) return;
                                                    setSelectedLocationId(
                                                        selectedLocationId === loc.id ? "" : loc.id
                                                    );
                                                }}
                                                disabled={!lockToLocation}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold sec-ff transition-colors ${
                                                    lockToLocation
                                                        ? selectedLocationId === loc.id
                                                            ? "bg-(--bg-clr) text-white"
                                                            : "bg-white border border-gray-200 text-(--pry-clr)/60 hover:border-(--bg-clr)/30 cursor-pointer"
                                                        : "bg-white border border-gray-200 text-(--pry-clr)/40 cursor-default"
                                                }`}
                                            >
                                                {loc.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-(--pry-clr)/60 sec-ff">Role</p>
                <div className="flex flex-col gap-2">
                    {roles.map((role) => {
                        const selected = selectedRoleId === role.id;
                        const isExpanded = expandedRoleId === role.id;
                        return (
                            <div
                                key={role.id}
                                className={`rounded-xl border overflow-hidden transition-colors ${
                                    selected ? "border-(--bg-clr)/40 bg-(--bg-clr)/5" : "border-gray-200"
                                }`}
                            >
                                <div className="flex items-center gap-3 px-4 py-3">
                                    <button
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className="flex items-center gap-3 flex-1 text-left"
                                    >
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                                            selected ? "border-(--bg-clr)" : "border-gray-300"
                                        }`}>
                                            {selected && <div className="w-2 h-2 rounded-full bg-(--bg-clr)" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-(--pry-clr) sec-ff">{role.name}</p>
                                            <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                                                {role.permissions.length} permission{role.permissions.length !== 1 ? "s" : ""}
                                            </p>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setExpandedRoleId(isExpanded ? null : role.id)}
                                        className="p-1 text-(--pry-clr)/40 hover:text-(--pry-clr) transition-colors"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="px-4 pb-3 pt-2 border-t border-gray-100 flex flex-col gap-1">
                                        {role.permissions.map((p) => (
                                            <p key={p} className="text-xs text-(--pry-clr)/60 sec-ff">
                                                * {p.replace(/__/g, " ")}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Save */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-(--bg-clr) text-(--txt-clr) text-sm font-semibold sec-ff hover:bg-(--bg-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 size={15} className="animate-spin" />
                        Saving…
                    </>
                ) : (
                    "Save Access"
                )}
            </button>
        </div>
    );
}