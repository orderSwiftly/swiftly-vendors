// src/components/store-owner/add-location-btn.tsx

"use client";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { addLocation } from "@/lib/store";

interface LocationEntry {
    name: string;
    address: string;
}

interface AddedLocation {
    id: string;
    name: string;
    address: string;
    is_active?: boolean;
}

interface AddLocationModalProps {
    storeId: string;
    onClose: () => void;
    onSuccess: (newLocations: AddedLocation[]) => void;
}

export default function AddLocationModal({ storeId, onClose, onSuccess }: Readonly<AddLocationModalProps>) {
    const [entries, setEntries] = useState<LocationEntry[]>([{ name: "", address: "" }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateEntry = (index: number, field: keyof LocationEntry, value: string) => {
        setEntries((prev) =>
            prev.map((e, i) => (i === index ? { ...e, [field]: value } : e))
        );
    };

    const addEntry = () => {
        setEntries((prev) => [...prev, { name: "", address: "" }]);
    };

    const removeEntry = (index: number) => {
        if (entries.length === 1) return;
        setEntries((prev) => prev.filter((_, i) => i !== index));
    };

    const isValid = entries.every((e) => e.name.trim() && e.address.trim());

    const handleConfirm = async () => {
        if (!isValid) return;
        setLoading(true);
        setError(null);
        try {
            const body = entries.map((e) => ({ name: e.name.trim(), address: e.address.trim() }));
            const res = await addLocation(storeId, body);
            const added: AddedLocation[] = res?.data ?? res ?? [];
            onSuccess(Array.isArray(added) ? added : []);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to add location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Add location</h2>
                <p className="text-xs text-gray-400 text-center mt-1 mb-6">
                    A store can operate across multiple locations
                </p>

                <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
                    {entries.map((entry, index) => (
                        <div key={index} className="flex flex-col gap-2 border border-gray-100 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium text-gray-600">Location {index + 1}</p>
                                {entries.length > 1 && (
                                    <button
                                        onClick={() => removeEntry(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Location name</label>
                                <input
                                    type="text"
                                    value={entry.name}
                                    onChange={(e) => updateEntry(index, "name", e.target.value)}
                                    placeholder="e.g Winslow Hall"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Address</label>
                                <input
                                    type="text"
                                    value={entry.address}
                                    onChange={(e) => updateEntry(index, "address", e.target.value)}
                                    placeholder="e.g Winslow Hall, Unilag"
                                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-300"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={addEntry}
                    className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <Plus size={13} />
                    Add another location
                </button>

                {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !isValid}
                        className="flex-1 bg-(--prof-clr) text-(--txt-clr) rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Adding..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}