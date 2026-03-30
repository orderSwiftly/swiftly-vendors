"use client";
import { Plus, Trash2 } from "lucide-react";
import { createStore } from "@/lib/store";
import { useEffect, useState } from "react";
import Spinner from "./ui/spinner";
import { toast } from "sonner";

interface Location {
    name: string;
    address: string;
}

interface CreateStoreBtnProps {
    readonly onStoreCreated?: () => void;
    readonly label?: string;
    readonly _forceOpen?: boolean;
    readonly _onClose?: () => void;
}

export default function CreateStoreBtn({
    onStoreCreated,
    label = "Create Store",
    _forceOpen,
    _onClose,
}: Readonly<CreateStoreBtnProps>) {
    const [open, setOpen] = useState(_forceOpen ?? false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [storeName, setStoreName] = useState("");
    const [locations, setLocations] = useState<Location[]>([{ name: "", address: "" }]);

    useEffect(() => {
        if (_forceOpen !== undefined) setOpen(_forceOpen);
    }, [_forceOpen]);

    const handleClose = () => {
        setOpen(false);
        _onClose?.();
    };

    const addLocation = () => {
        setLocations((prev) => [...prev, { name: "", address: "" }]);
    };

    const removeLocation = (index: number) => {
        setLocations((prev) => prev.filter((_, i) => i !== index));
    };

    const updateLocation = (index: number, field: keyof Location, value: string) => {
        setLocations((prev) =>
            prev.map((loc, i) => (i === index ? { ...loc, [field]: value } : loc))
        );
    };

    const handleSubmit = async () => {
        if (!storeName.trim()) {
            setError("Store name is required.");
            toast.error("Store name is required.");
            return;
        }
        if (locations.some((l) => !l.name.trim() || !l.address.trim())) {
            setError("All location fields are required.");
            toast.error("All location fields are required.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await createStore({
                store_name: storeName,
                locations,
            });
            handleClose();
            setStoreName("");
            setLocations([{ name: "", address: "" }]);
            onStoreCreated?.();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create store.");
            toast.error(err instanceof Error ? err.message : "Failed to create store.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {label && (
                <button
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-center bg-(--prof-clr) text-(--txt-clr) rounded-md px-4 py-2 gap-2 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>{label}</span>
                </button>
            )}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto text-left">

                        {/* Header */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Create a new store</h2>
                            <p className="text-xs text-gray-400 mt-0.5">A store can operate across multiple locations</p>
                        </div>

                        {/* Store Details */}
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold text-gray-700">Store details</p>
                            <div className="flex flex-col gap-1">
                                <label className="text-xs text-gray-500 font-medium">Store name *</label>
                                <input
                                    type="text"
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    placeholder="e.g DC-HUB"
                                    className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr)"
                                />
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Locations</p>
                                <p className="text-xs text-gray-400">A store must have at least one location. You can add more later.</p>
                            </div>

                            {locations.map((loc, index) => (
                                <div key={index} className="flex flex-col gap-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs text-gray-500 font-medium">
                                            Location {index + 1}
                                        </label>
                                        {locations.length > 1 && (
                                            <button
                                                onClick={() => removeLocation(index)}
                                                className="text-gray-300 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={loc.name}
                                            onChange={(e) => updateLocation(index, "name", e.target.value)}
                                            placeholder="e.g Shop 11"
                                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr) w-1/2"
                                        />
                                        <input
                                            type="text"
                                            value={loc.address}
                                            onChange={(e) => updateLocation(index, "address", e.target.value)}
                                            placeholder="e.g Behind BUSA House"
                                            className="border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-(--prof-clr) w-1/2"
                                        />
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addLocation}
                                className="flex items-center gap-1.5 text-sm font-medium bg-(--prof-clr) text-(--txt-clr) px-4 py-2 rounded-md w-fit cursor-pointer hover:bg-(--acc-clr)/80 transition-colors"
                            >
                                <Plus size={14} />
                                Add another location
                            </button>
                        </div>

                        {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}

                        {/* Actions */}
                        <div className="flex gap-3 justify-end mt-1">
                            <button
                                onClick={handleClose}
                                className="px-4 py-2 text-sm rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-md bg-(--prof-clr) text-(--txt-clr) hover:bg-(--acc-clr)/80 transition-colors disabled:opacity-60"
                            >
                                {loading ? <Spinner /> : "Create Store"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}