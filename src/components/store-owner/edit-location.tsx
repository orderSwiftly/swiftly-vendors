// src/components/store-owner/edit-location.tsx

"use client";
import { useState } from "react";
import { editLocation } from "@/lib/store";

interface LocationData {
    id: string;
    name: string;
    address: string;
}

interface EditLocationModalProps {
    location: LocationData;
    onClose: () => void;
    onSuccess: (locationId: string, updatedFields: { name?: string; address?: string }) => void;
}

export default function EditLocationModal({ location, onClose, onSuccess }: Readonly<EditLocationModalProps>) {
    const [name, setName] = useState(location.name);
    const [address, setAddress] = useState(location.address);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const nameChanged = name.trim() !== location.name;
    const addressChanged = address.trim() !== location.address;
    const hasChanges = nameChanged || addressChanged;

    const handleConfirm = async () => {
        if (!hasChanges) return;
        setLoading(true);
        setError(null);

        const body: { new_name?: string; new_address?: string } = {};
        if (nameChanged) body.new_name = name.trim();
        if (addressChanged) body.new_address = address.trim();

        try {
            await editLocation(location.id, body);
            onSuccess(location.id, {
                ...(nameChanged && { name: name.trim() }),
                ...(addressChanged && { address: address.trim() }),
            });
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to edit location.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Edit location</h2>
                <p className="text-xs text-gray-400 text-center mt-1 mb-6">
                    Update the name or address for this location
                </p>

                <p className="text-sm font-medium text-gray-700 mb-3">Location details</p>

                <label className="text-xs text-gray-500 mb-1 block">Location name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={location.name}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-300 mb-3"
                />

                <label className="text-xs text-gray-500 mb-1 block">Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={location.address}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-800 outline-none focus:ring-1 focus:ring-gray-300 mb-1"
                />

                {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

                <div className="flex gap-3 mt-5">
                    <button
                        onClick={onClose}
                        className="flex-1 border border-gray-200 rounded-md py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !hasChanges}
                        className="flex-1 bg-(--prof-clr) text-(--txt-clr) rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Saving..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}