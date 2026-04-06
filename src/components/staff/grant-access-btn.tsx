// src/components/staff/grant-access-btn.tsx

"use client";

import { useState } from "react";
import { Loader2, ShieldPlus, X, Check } from "lucide-react";
import { toast } from "sonner";
import { grantAccess, getRoles, type Role } from "@/lib/access";
import { getStores, type Store, type StoreLocation } from "@/lib/store";

interface GrantAccessBtnProps {
    staffId: string;
    staffName: string;
    onGranted?: () => void;
}

type AccessType = "all_stores" | "specific_stores" | "one_store_all" | "one_store_specific";

const ACCESS_TYPES: { key: AccessType; label: string; description: string }[] = [
    { key: "all_stores",          label: "All Stores",                    description: "Access to every store" },
    { key: "specific_stores",     label: "Specific Stores",               description: "Access to selected stores" },
    { key: "one_store_all",       label: "One Store — All Locations",     description: "Full access within one store" },
    { key: "one_store_specific",  label: "One Store — Specific Locations", description: "Limited to certain locations" },
];

export default function GrantAccessBtn({
    staffId,
    staffName,
    onGranted,
}: Readonly<GrantAccessBtnProps>) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    const [stores, setStores] = useState<Store[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [accessType, setAccessType] = useState<AccessType | "">("");

    // for specific_stores
    const [selectedStoreIds, setSelectedStoreIds] = useState<string[]>([]);

    // for one_store_all and one_store_specific
    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);

    const selectedStore = stores.find((s) => s.id === selectedStoreId) ?? null;

    const openModal = async () => {
        setOpen(true);
        setFetching(true);
        try {
            const [storeData, roleData] = await Promise.all([getStores(), getRoles()]);
            setStores(storeData);
            setRoles(roleData);
        } catch {
            toast.error("Failed to load stores or roles.");
            setOpen(false);
        } finally {
            setFetching(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        setOpen(false);
        setSelectedRoleId("");
        setAccessType("");
        setSelectedStoreIds([]);
        setSelectedStoreId("");
        setSelectedLocationIds([]);
    };

    const handleAccessTypeChange = (type: AccessType) => {
        setAccessType(type);
        setSelectedStoreIds([]);
        setSelectedStoreId("");
        setSelectedLocationIds([]);
    };

    const toggleStoreId = (id: string) => {
        setSelectedStoreIds((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );
    };

    const toggleLocationId = (id: string) => {
        setSelectedLocationIds((prev) =>
            prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!selectedRoleId) return toast.error("Please select a role.");
        if (!accessType) return toast.error("Please select an access type.");
        if (accessType === "specific_stores" && selectedStoreIds.length === 0)
            return toast.error("Please select at least one store.");
        if ((accessType === "one_store_all" || accessType === "one_store_specific") && !selectedStoreId)
            return toast.error("Please select a store.");
        if (accessType === "one_store_specific" && selectedLocationIds.length === 0)
            return toast.error("Please select at least one location.");

        let access;
        if (accessType === "all_stores") {
            access = { type: "all_stores" as const };
        } else if (accessType === "specific_stores") {
            access = { type: "specific_stores" as const, store_ids: selectedStoreIds };
        } else if (accessType === "one_store_all") {
            access = {
                type: "one_store" as const,
                store_id: selectedStoreId,
                locations: { locked: false as const },
            };
        } else {
            access = {
                type: "one_store" as const,
                store_id: selectedStoreId,
                locations: { locked: true as const, location_ids: selectedLocationIds },
            };
        }

        setLoading(true);
        try {
            await grantAccess(staffId, { role_id: selectedRoleId, access });
            toast.success(`Access granted to ${staffName}.`);
            handleClose();
            onGranted?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to grant access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-(--pry-clr)/10 text-(--pry-clr) text-xs font-semibold sec-ff hover:bg-(--pry-clr)/20 transition-colors"
            >
                <ShieldPlus size={13} />
                Grant Access
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                    onClick={handleClose}
                >
                    <div
                        className="w-full max-w-md bg-(--txt-clr) rounded-2xl shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Grant Access</h2>
                                <p className="text-sm text-(--pry-clr)/70 sec-ff mt-0.5">
                                    Assign a role to{" "}
                                    <span className="font-semibold text-(--pry-clr)">{staffName}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleClose}
                                disabled={loading}
                                className="p-1.5 rounded-lg hover:bg-(--pry-clr)/10 transition-colors text-(--pry-clr) disabled:opacity-50"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {fetching ? (
                            <div className="flex items-center justify-center py-10">
                                <Loader2 size={22} className="animate-spin text-(--pry-clr)" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">

                                {/* Role */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-(--pry-clr) sec-ff">Role</label>
                                    <div className="flex flex-wrap gap-2">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                onClick={() => setSelectedRoleId(role.id)}
                                                disabled={loading}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold sec-ff transition-colors disabled:opacity-50 ${
                                                    selectedRoleId === role.id
                                                        ? "bg-(--pry-clr) text-white"
                                                        : "bg-(--pry-clr)/10 text-(--pry-clr) hover:bg-(--pry-clr)/20"
                                                }`}
                                            >
                                                {role.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Access Type */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-(--pry-clr) sec-ff">Access Type</label>
                                    <div className="flex flex-col gap-2">
                                        {ACCESS_TYPES.map(({ key, label, description }) => (
                                            <button
                                                key={key}
                                                onClick={() => handleAccessTypeChange(key)}
                                                disabled={loading}
                                                className={`w-full text-left px-4 py-3 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-50 ${
                                                    accessType === key
                                                        ? "border-(--pry-clr) bg-(--pry-clr)/5"
                                                        : "border-gray-200 hover:border-(--pry-clr)/30"
                                                }`}
                                            >
                                                <p className={`font-semibold ${accessType === key ? "text-(--pry-clr)" : "text-(--pry-clr)/80"}`}>
                                                    {label}
                                                </p>
                                                <p className="text-xs text-(--pry-clr)/50 mt-0.5">{description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Specific Stores picker */}
                                {accessType === "specific_stores" && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-(--pry-clr) sec-ff">Select Stores</label>
                                        <div className="flex flex-col gap-2">
                                            {stores.map((s) => {
                                                const selected = selectedStoreIds.includes(s.id);
                                                return (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => toggleStoreId(s.id)}
                                                        disabled={loading}
                                                        className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-50 ${
                                                            selected
                                                                ? "border-(--pry-clr) bg-(--pry-clr)/5 text-(--pry-clr) font-medium"
                                                                : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30"
                                                        }`}
                                                    >
                                                        {s.store_name || s.name}
                                                        {selected && <Check size={14} className="text-(--pry-clr)" />}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* One Store picker */}
                                {(accessType === "one_store_all" || accessType === "one_store_specific") && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-(--pry-clr) sec-ff">Select Store</label>
                                        <div className="flex flex-col gap-2">
                                            {stores.map((s) => (
                                                <button
                                                    key={s.id}
                                                    onClick={() => { setSelectedStoreId(s.id); setSelectedLocationIds([]); }}
                                                    disabled={loading}
                                                    className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-50 ${
                                                        selectedStoreId === s.id
                                                            ? "border-(--pry-clr) bg-(--pry-clr)/5 text-(--pry-clr) font-medium"
                                                            : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30"
                                                    }`}
                                                >
                                                    {s.store_name || s.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Specific Locations picker */}
                                {accessType === "one_store_specific" && selectedStore && (
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-(--pry-clr) sec-ff">
                                            Select Locations
                                            <span className="text-(--pry-clr)/40 font-normal ml-1">
                                                — {selectedStore.store_name || selectedStore.name}
                                            </span>
                                        </label>
                                        {selectedStore.locations.length === 0 ? (
                                            <p className="text-xs text-(--pry-clr)/50 sec-ff">No locations found for this store.</p>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                {selectedStore.locations.map((loc: StoreLocation) => {
                                                    const selected = selectedLocationIds.includes(loc.id);
                                                    return (
                                                        <button
                                                            key={loc.id}
                                                            onClick={() => toggleLocationId(loc.id)}
                                                            disabled={loading}
                                                            className={`w-full flex items-center justify-between text-left px-4 py-2.5 rounded-xl border text-sm sec-ff transition-colors disabled:opacity-50 ${
                                                                selected
                                                                    ? "border-(--pry-clr) bg-(--pry-clr)/5"
                                                                    : "border-gray-200 text-(--pry-clr)/60 hover:border-(--pry-clr)/30"
                                                            }`}
                                                        >
                                                            <div>
                                                                <p className={`font-medium ${selected ? "text-(--pry-clr)" : ""}`}>{loc.name}</p>
                                                                <p className="text-xs text-(--pry-clr)/50 mt-0.5">{loc.address}</p>
                                                            </div>
                                                            {selected && <Check size={14} className="text-(--pry-clr) shrink-0" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {!fetching && (
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-(--pry-clr) sec-ff hover:bg-(--pry-clr)/10 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-2.5 rounded-xl bg-(--pry-clr) text-white text-sm font-semibold sec-ff hover:bg-(--pry-clr)/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={15} className="animate-spin" />
                                            Granting…
                                        </>
                                    ) : (
                                        "Grant Access"
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}