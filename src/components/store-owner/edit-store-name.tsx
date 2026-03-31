// src/components/store-owner/edit-store-name.tsx

"use client";
import { useState } from "react";
import { editStoreName } from "@/lib/store";

interface StoreData {
    id: string;
    name: string;
}

interface EditStoreNameModalProps {
    store: StoreData;
    onClose: () => void;
    onSuccess: (storeId: string, newName: string) => void;
}

export default function EditStoreNameModal({ store, onClose, onSuccess }: Readonly<EditStoreNameModalProps>) {
    const [name, setName] = useState(store.name);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName === store.name) return;
        setLoading(true);
        setError(null);
        try {
            await editStoreName(store.id, { new_name: trimmedName });
            onSuccess(store.id, trimmedName);
            onClose();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to edit store name.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl p-8 w-full max-w-sm shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 text-center">Edit store name</h2>
                <p className="text-xs text-gray-400 text-center mt-1 mb-6">
                    A store can operate across multiple locations
                </p>

                <p className="text-sm font-medium text-gray-700 mb-3">Store details</p>

                <label className="text-xs text-gray-500 mb-1 block">Store name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={`e.g ${store.name}`}
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
                        disabled={loading || !name.trim() || name.trim() === store.name}
                        className="flex-1 bg-(--prof-clr) text-(--txt-clr) rounded-md py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Confirm"}
                    </button>
                </div>
            </div>
        </div>
    );
}