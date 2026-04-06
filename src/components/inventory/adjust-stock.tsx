// src/components/inventory/adjust-stock.tsx

"use client";

import { useState } from "react";
import { X, Loader2, Package, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { adjustStock, type InventoryItem } from "@/lib/inventory";

interface AdjustStockProps {
    item: InventoryItem;
    locationId: string;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AdjustStock({ item, locationId, onClose, onSuccess }: Readonly<AdjustStockProps>) {
    const [quantity, setQuantity] = useState<number | "">(0);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (quantity === "" || quantity === 0) return toast.error("Quantity is required and cannot be zero.");
        if (!reason.trim()) return toast.error("A reason is required.");

        try {
            setLoading(true);
            await adjustStock(locationId, item.product_id, {
                adjusted_quantity: Number(quantity),
                reason: reason.trim(),
            });
            toast.success("Stock adjusted successfully.");
            onSuccess?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to adjust stock.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md p-6 flex flex-col gap-5"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-(--pry-clr) sec-ff">Adjust Stock</h2>
                        <p className="text-xs text-(--pry-clr)/50 sec-ff mt-0.5">
                            Update stock level for {item.name}.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={17} className="text-(--pry-clr)/60" />
                    </button>
                </div>

                {/* Product Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="w-9 h-9 rounded-lg bg-(--pry-clr)/10 flex items-center justify-center shrink-0">
                        <Package size={15} className="text-(--pry-clr)/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-(--pry-clr) sec-ff truncate">{item.name}</p>
                        <p className="text-xs text-(--pry-clr)/50 sec-ff">SKU: {item.sku}</p>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-xs text-(--pry-clr)/50 sec-ff">Current Stock</p>
                        <p className={`text-sm font-bold sec-ff ${
                            item.current_stock > 0 ? "text-green-600" : "text-red-500"
                        }`}>
                            {item.current_stock} units
                        </p>
                    </div>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff flex items-center gap-1.5">
                            <SlidersHorizontal size={12} />
                            Adjusted Quantity
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="e.g. 12 or -5"
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30"
                        />
                        <p className="text-xs text-(--pry-clr)/40 sec-ff">
                            Use a positive number to add stock, negative to remove.
                        </p>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-(--pry-clr)/70 sec-ff">
                            Reason
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Restocked from supplier"
                            rows={3}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-(--pry-clr) sec-ff outline-none focus:border-(--pry-clr) transition-colors placeholder:text-(--pry-clr)/30 resize-none"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-(--pry-clr) hover:bg-gray-50 transition-colors sec-ff disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 bg-(--pry-clr) text-white rounded-xl text-sm font-semibold sec-ff hover:bg-(--pry-clr)/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Adjusting…
                            </>
                        ) : (
                            <>
                                <SlidersHorizontal size={14} />
                                Adjust Stock
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}